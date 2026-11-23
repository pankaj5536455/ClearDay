import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'
const fields = 'us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone'
const num = (v: string | null, fallback: number) => v === null ? fallback : Number(v)
export async function GET(req: NextRequest) {
  const lat = num(req.nextUrl.searchParams.get('lat'), 28.6692)
  const lon = num(req.nextUrl.searchParams.get('lon'), 77.4538)
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat)>90 || Math.abs(lon)>180) return NextResponse.json({error:'Invalid coordinates'}, {status:400})
  try {
    const url = new URL('https://air-quality-api.open-meteo.com/v1/air-quality')
    url.search = new URLSearchParams({latitude:String(lat),longitude:String(lon),current:fields,hourly:fields,timezone:'auto',past_days:'7',forecast_days:'2'}).toString()
    const response = await fetch(url, {next:{revalidate:900}})
    if (!response.ok) throw new Error('AQI provider unavailable')
    const data = await response.json()
    return NextResponse.json({source:'Open-Meteo / CAMS',sourceType:'model_estimate',scale:'US EPA AQI',latitude:lat,longitude:lon,updatedAt:data.current?.time ?? null,current:data.current,hourly:data.hourly,units:data.current_units},{headers:{'Cache-Control':'public, s-maxage=600, stale-while-revalidate=300'}})
  } catch { return NextResponse.json({error:'Live air quality temporarily unavailable'},{status:502}) }
}
