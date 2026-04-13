import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DadoGrafico {
  time: string
  temp: number
}

interface WeatherChartProps {
  dados: DadoGrafico[]
  cidade: string
}

export default function WeatherChart({ dados, cidade }: WeatherChartProps) {
  if (!dados || dados.length === 0) {
    return <div className="text-center text-gray-500">Selecione uma cidade para ver o gráfico</div>
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4">
      <h3 className="text-xl font-bold mb-4 text-gray-700"> Histórico de Temperatura - {cidade}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dados} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="#e0e7ff" strokeDasharray="3 3" /> {/* Lilás pastel */}
          <XAxis dataKey="time" tick={{ fill: '#6b7280' }} /> {/* Cinza suave */}
          <YAxis 
            label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#6b7280' }} 
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip 
            formatter={(value) => [`${value}°C`, 'Temperatura']}
            contentStyle={{ backgroundColor: '#ffffffcc', borderRadius: '12px', border: 'none', color: '#1f2937' }}
          />
          <Line 
            type="monotone" 
            dataKey="temp" 
            stroke="#93c5fd"   
            strokeWidth={3} 
            dot={{ r: 4, fill: '#60a5fa', stroke: '#ffffff', strokeWidth: 2 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}