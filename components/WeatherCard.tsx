'use client'

interface WeatherCardProps {
  cidade: string
  temperatura: number
  umidade: number
  vento: number
  onSelect: () => void
}

function getCardColor(temp: number): string {
  if (temp < 15) return 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
  if (temp >= 15 && temp < 25) return 'bg-gradient-to-br from-green-400 to-green-600 text-white'
  if (temp >= 25 && temp < 35) return 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
  return 'bg-gradient-to-br from-red-500 to-red-700 text-white'
}

export default function WeatherCard({
  cidade,
  temperatura,
  umidade,
  vento,
  onSelect,
}: WeatherCardProps) {
  const cardColor = getCardColor(temperatura)

  return (
    <div
      onClick={onSelect}
      className={`${cardColor} rounded-2xl shadow-xl p-5 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
    >
      <h3 className="text-2xl font-bold mb-2">{cidade}</h3>
      <div className="text-5xl font-extrabold mb-3">{temperatura}°C</div>
      <div className="space-y-1 text-sm opacity-90">
        <p>💧 Umidade: {umidade}%</p>
        <p>💨 Vento: {vento} km/h</p>
      </div>
    </div>
  )
}