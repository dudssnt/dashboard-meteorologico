import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude e longitude obrigatórias' }, { status: 400 });
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relativehumidity_2m,wind_speed_10m&hourly=temperature_2m&timezone=auto&forecast_days=1`;
    const res = await fetch(url);
    const data = await res.json();

    const current = {
      temp: Math.round(data.current.temperature_2m),
      humidity: data.current.relativehumidity_2m,
      wind: data.current.wind_speed_10m,
    };
    const hourly = data.hourly.time.slice(0, 12).map((time: string, idx: number) => ({
      time: new Date(time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(data.hourly.temperature_2m[idx]),
    }));

    return NextResponse.json({ current, hourly });
  } catch {
    return NextResponse.json({ error: 'Falha ao buscar dados' }, { status: 500 });
  }
}