export interface Cidade {
  id: number
  nome: string
  lat: number
  lon: number
}

export const cidadesFixas: Cidade[] = [
  { id: 1, nome: 'São Luís', lat: -2.5307, lon: -44.3028 },      // ← primeiro lugar
  { id: 2, nome: 'São Paulo', lat: -23.5505, lon: -46.6333 },
  { id: 3, nome: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729 },
  { id: 4, nome: 'Belo Horizonte', lat: -19.9167, lon: -43.9345 },
  { id: 5, nome: 'Porto Alegre', lat: -30.0331, lon: -51.23 },
  { id: 6, nome: 'Salvador', lat: -12.9714, lon: -38.5014 },
  { id: 7, nome: 'Brasília', lat: -15.8267, lon: -47.9218 },
]


interface GeoResult {
  name: string
  latitude: number
  longitude: number
}

export async function buscarCidadePorNome(nome: string): Promise<Omit<Cidade, 'id'> | null> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nome)}&count=1&language=pt&format=json`
  const res = await fetch(url)
  const data = await res.json()
  if (data.results && data.results.length > 0) {
    const result: GeoResult = data.results[0]
    return {
      nome: result.name,
      lat: result.latitude,
      lon: result.longitude
    }
  }
  return null
}