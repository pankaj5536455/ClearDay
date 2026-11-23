import { NextRequest, NextResponse } from 'next/server'
export async function GET(req:NextRequest) {
  const name=(req.nextUrl.searchParams.get('q')||'').trim().slice(0,80)
  if(name.length<2) return NextResponse.json({results:[]})
  try {
    const url='https://geocoding-api.open-meteo.com/v1/search?'+new URLSearchParams({name,count:'8',language:'en',format:'json'})
    const r=await fetch(url,{next:{revalidate:86400}})
    if(!r.ok) throw new Error('Search unavailable')
    const data=await r.json()
    return NextResponse.json({results:(data.results||[]).map((x:any)=>({name:x.name,region:x.admin1,country:x.country,latitude:x.latitude,longitude:x.longitude}))})
  } catch {return NextResponse.json({results:[],error:'Location search unavailable'},{status:502})}
}
