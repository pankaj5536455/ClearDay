import { NextRequest, NextResponse } from 'next/server'
export const runtime='nodejs'
const SYSTEM = `You are ClearDay, a concise and practical urban air quality assistant. You are given trusted air-quality context by the server. Explain risks without making medical diagnoses. Do not invent pollutant measurements, times, sources, or percentage reductions. Distinguish model-estimated US AQI from India's CPCB AQI; never equate them. Offer low-cost exposure reduction and low-emission routines. Existing greenery can help shade, comfort and local environments, but houseplants do not replace HEPA filtration and do not solve severe outdoor pollution. Never pressure users to buy plants. For severe pollution, avoid suggesting outdoor exercise or open windows without checking actual conditions. Use age group only to tailor general caution, not as a diagnosis. Keep answers under 170 words.`
export async function POST(req:NextRequest) {
  let body:any
  try {body=await req.json()} catch{return NextResponse.json({error:'Invalid JSON'},{status:400})}
  const question=String(body?.question||'').trim().slice(0,1000)
  const aqi=Number(body?.aqi)
  const location=String(body?.location||'the selected location').slice(0,100)
  const ageGroup=String(body?.ageGroup||'general').slice(0,40)
  if(!question) return NextResponse.json({error:'Question required'},{status:400})
  if(!Number.isFinite(aqi)||aqi<0||aqi>500) return NextResponse.json({error:'Valid AQI context required'},{status:400})
  const key=process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY
  const provider=process.env.GROQ_API_KEY?'groq':'openrouter'
  if(!key) return NextResponse.json({error:'AI provider not configured',code:'AI_UNAVAILABLE'},{status:503})
  const url=provider==='groq'?'https://api.groq.com/openai/v1/chat/completions':'https://openrouter.ai/api/v1/chat/completions'
  const model=process.env.AI_MODEL || (provider==='groq'?'openai/gpt-oss-20b':'openrouter/free')
  try {
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000)
    let response:Response
    try {response=await fetch(url,{method:'POST',signal:controller.signal,headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,temperature:0.3,max_tokens:350,messages:[{role:'system',content:SYSTEM},{role:'user',content:`Location: ${location}; model-estimated US EPA AQI: ${aqi}; age group: ${ageGroup}. Question: ${question}`}]})})}finally{clearTimeout(timeout)}
    if(!response.ok) return NextResponse.json({error:'AI service unavailable or rate limited'},{status:503})
    const data=await response.json()
    const answer=data.choices?.[0]?.message?.content
    if(typeof answer!=='string'||!answer.trim()) throw new Error('Empty response')
    return NextResponse.json({answer,model,provider})
  } catch {return NextResponse.json({error:'AI service temporarily unavailable'},{status:503})}
}
