'use client'

import { useState, useEffect } from 'react'
import WeatherCard from '@/components/WeatherCard'
import WeatherChart from '@/components/WeatherChart'
import { cidadesFixas, buscarCidadePorNome, Cidade } from '@/lib/cidades'

interface DadosClima {
  current: {
    temp: number
    humidity: number
    wind: number
  }
  hourly: Array<{ time: string; temp: number }>
}

export default function Home() {
  const [cidades, setCidades] = useState<Cidade[]>(cidadesFixas)
  const [dadosCidades, setDadosCidades] = useState<Record<number, DadosClima>>({})
  const [loading, setLoading] = useState(true)
  const [cidadeSelecionada, setCidadeSelecionada] = useState<Cidade | null>(cidadesFixas[0])
  const [dadosGrafico, setDadosGrafico] = useState<Array<{ time: string; temp: number }>>([])
  const [buscaInput, setBuscaInput] = useState('')
  const [buscando, setBuscando] = useState(false)

  const fetchClima = async (cidade: Cidade): Promise<DadosClima | null> => {
    try {
      const res = await fetch(`/api/clima?lat=${cidade.lat}&lon=${cidade.lon}`)
      const data = await res.json()
      if (!data || !data.current) return null
      return { current: data.current, hourly: data.hourly || [] }
    } catch (error) {
      console.error(`Erro ao buscar ${cidade.nome}:`, error)
      return null
    }
  }


  useEffect(() => {
    const carregarInicial = async () => {
      setLoading(true)
      const novosDados: Record<number, DadosClima> = {}
      for (const cidade of cidades) {
        const clima = await fetchClima(cidade)
        if (clima) novosDados[cidade.id] = clima
      }
      setDadosCidades(novosDados)
      if (cidades.length > 0 && !cidadeSelecionada) {
        setCidadeSelecionada(cidades[0])
      }
      setLoading(false)
    }
    carregarInicial()

  }, []) 

  useEffect(() => {
    if (cidadeSelecionada && dadosCidades[cidadeSelecionada.id]) {
      setDadosGrafico(dadosCidades[cidadeSelecionada.id].hourly)
    }
  }, [cidadeSelecionada, dadosCidades])

  const adicionarCidade = async () => {
    if (!buscaInput.trim()) return
    setBuscando(true)
    const cidadeEncontrada = await buscarCidadePorNome(buscaInput)
    setBuscando(false)
    if (cidadeEncontrada) {
      if (cidades.some(c => c.nome.toLowerCase() === cidadeEncontrada.nome.toLowerCase())) {
        alert('Cidade já adicionada!')
        return
      }
      const novaCidade: Cidade = {
        id: Date.now(),
        ...cidadeEncontrada
      }
      const clima = await fetchClima(novaCidade)
      if (clima) {
        setCidades(prev => [...prev, novaCidade])
        setDadosCidades(prev => ({ ...prev, [novaCidade.id]: clima }))
      } else {
        alert('Não foi possível obter os dados climáticos dessa cidade.')
      }
      setBuscaInput('')
    } else {
      alert('Cidade não encontrada. Tente outro nome.')
    }
  }

  const removerCidade = (id: number) => {
    if (cidades.length <= 1) {
      alert('Mantenha pelo menos uma cidade no dashboard.')
      return
    }
    setCidades(prev => prev.filter(c => c.id !== id))
    setDadosCidades(prev => {
      const newState = { ...prev }
      delete newState[id]
      return newState
    })
  
    if (cidadeSelecionada?.id === id) {
      const proximaCidade = cidades.find(c => c.id !== id)
      setCidadeSelecionada(proximaCidade || null)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-2">Dashboard Meteorológico</h1>
      </header>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
        <input
          type="text"
          placeholder="Digite o nome de uma cidade (ex: Curitiba)"
          value={buscaInput}
          onChange={(e) => setBuscaInput(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-80 text-gray-900"
          onKeyDown={(e) => e.key === 'Enter' && adicionarCidade()}
        />
        <button
          onClick={adicionarCidade}
          disabled={buscando}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition disabled:opacity-50"
        >
          {buscando ? 'Buscando...' : 'Adicionar cidade'}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {cidades.map((cidade) => {
              const dados = dadosCidades[cidade.id]
              if (!dados || !dados.current) return null
              return (
                <div key={cidade.id} className="relative group">
                  <button
                    onClick={() => removerCidade(cidade.id)}
                    className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    title="Remover cidade"
                  >
                    ✕
                  </button>
                  <WeatherCard
                    cidade={cidade.nome}
                    temperatura={dados.current.temp}
                    umidade={dados.current.humidity}
                    vento={dados.current.wind}
                    onSelect={() => setCidadeSelecionada(cidade)}
                  />
                </div>
              )
            })}
          </div>

          <div className="mt-8">
            <WeatherChart
              dados={dadosGrafico}
              cidade={cidadeSelecionada?.nome || ''}
            />
          </div>
        </>
      )}
    </main>
  )
}