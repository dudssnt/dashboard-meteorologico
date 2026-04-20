import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude e longitude obrigatórias' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relativehumidity_2m,wind_speed_10m&hourly=temperature_2m&timezone=auto&forecast_days=1`
    );

    const data = await res.json();

    return NextResponse.json({
      current: {
        temp: Math.round(data.current.temperature_2m),
        humidity: data.current.relativehumidity_2m,
        wind: data.current.wind_speed_10m,
      },
      hourly: data.hourly.time.slice(0, 12).map((time: string, i: number) => ({
        time: new Date(time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        temp: Math.round(data.hourly.temperature_2m[i]),
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Falha ao buscar dados' }, { status: 500 });
  }
}