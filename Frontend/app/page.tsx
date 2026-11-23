'use client'

import { useEffect, useState } from 'react'
import { airAdvice, airLevel, type AirResponse } from '@/lib/air'
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bot, CalendarDays, Check, ChevronDown, CircleHelp, Clock3, Droplets, Home, Leaf, MapPin, Menu, Moon, MoreHorizontal, ShieldCheck, Sparkles, Sun, Wind, X } from 'lucide-react'
import { InteractivePlantHero } from '@/components/interactive-plant-hero'
import { NeighborhoodMapPage } from '@/components/neighborhood-map-page'

const sections = ['Home', 'Map', 'AQI Trends', 'Daily Routine', 'Indoor Hacks', 'Green Guidance'] as const
type Section = (typeof sections)[number]

const readings = [
  { name: 'PM₂.₅', value: '210', unit: 'µg/m³', label: 'Severe', tone: 'rose' },
  { name: 'PM₁₀', value: '328', unit: 'µg/m³', label: 'Severe', tone: 'rose' },
  { name: 'NO₂', value: '72', unit: 'µg/m³', label: 'Moderate', tone: 'amber' },
  { name: 'O₃', value: '18', unit: 'µg/m³', label: 'Good', tone: 'green' },
]

function Brand() {
  return <div className="brand"><span className="brand-mark"><Leaf size={19} /></span><span><b>ClearDay</b><small>Urban Air Quality Assistant</small></span></div>
}

function AqiLine({ compact = false }: { compact?: boolean }) {
  return <div className={`chart-wrap ${compact ? 'chart-compact' : ''}`}>
    <div className="chart-grid"><span>500</span><span>400</span><span>300</span><span>200</span><span>100</span><span>0</span></div>
    <svg className="aqi-chart" viewBox="0 0 600 220" role="img" aria-label="AQI rose over the last seven days, reaching 347 today">
      <defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#fb7185" stopOpacity=".32"/><stop offset="100%" stopColor="#fb7185" stopOpacity=".02"/></linearGradient></defs>
      <path d="M24 84 C56 87 78 91 112 88 S166 74 200 75 S254 68 290 78 S340 93 378 96 S432 91 466 94 S526 82 576 72 L576 198 L24 198 Z" fill="url(#area)"/>
      <path d="M24 84 C56 87 78 91 112 88 S166 74 200 75 S254 68 290 78 S340 93 378 96 S432 91 466 94 S526 82 576 72" fill="none" stroke="#ed3155" strokeWidth="4" strokeLinecap="round"/>
      {[24,112,200,290,378,466,576].map((x,i)=><circle key={x} cx={x} cy={[84,88,75,78,96,94,72][i]} r="5" fill="#ed3155" stroke="white" strokeWidth="2"/>)}
      <g className="chart-days"><text x="24" y="217">16 Nov</text><text x="112" y="217">17 Nov</text><text x="200" y="217">18 Nov</text><text x="290" y="217">19 Nov</text><text x="378" y="217">20 Nov</text><text x="466" y="217">21 Nov</text><text x="576" y="217">22 Nov</text></g>
    </svg>
    <span className="chart-current">347<br/><small>Severe</small></span>
  </div>
}

function Pollutants({air}:{air:AirResponse|null}) {
  const live=[['PM₂.₅',air?.current?.pm2_5],['PM₁₀',air?.current?.pm10],['NO₂',air?.current?.nitrogen_dioxide],['O₃',air?.current?.ozone]]
  return <div className="pollutants">{live.map(([name,value])=><div className="pollutant" key={String(name)}><b>{name}</b><strong>{typeof value==='number'?value.toFixed(1):'—'}<small> µg/m³</small></strong><span>Model estimate</span></div>)}</div>
}

function SectionHeading({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return <div className="section-heading"><div className="heading-icon">{icon}</div><div><h1>{title}</h1><p>{subtitle}</p></div><button className="location"><MapPin size={14}/> Ghaziabad, India <ChevronDown size={14}/></button></div>
}

function AirCard({ air }: { air: AirResponse | null }) {
  const aqi=air?.current?.us_aqi ?? null
  const level=airLevel(aqi)
  const values=[['PM₂.₅',air?.current?.pm2_5],['PM₁₀',air?.current?.pm10],['NO₂',air?.current?.nitrogen_dioxide],['O₃',air?.current?.ozone]]
  return <article className="air-card card"><div className="air-top"><div><span className="eyebrow"><Activity size={14}/> LIVE AIR QUALITY</span><p className="aqi-label">Your local AQI</p><div className="aqi-number">{aqi ?? "—"} <span className={`pill ${level.tone}`}>{level.label}</span></div><p className="updated"><span className="live-dot"/> {air?.updatedAt ? `Model update: ${air.updatedAt}` : "Loading live data…"}</p></div><div className="air-orb"><div className="orb-glow"/><span className="orb-leaf">✦</span><Leaf size={74}/><span className="orb-caption">Breathe a little easier</span></div></div>
    <div className="scale"><div className="scale-bar"><span/></div><div className="scale-labels"><span>Good</span><span>Moderate</span><span>Poor</span><span>Severe</span></div></div>
    <div className="readings-inline">{values.map(([name,value])=><div key={String(name)}><span>{name}</span><b>{typeof value==="number" ? value.toFixed(1) : "—"}<small> µg/m³</small></b></div>)}</div>
    <p className="air-note"><ShieldCheck size={17}/> {airAdvice(aqi)}</p>
  </article>
}

function TrendCard({ compact = false }: { compact?: boolean }) {
  return <article className={`card trend-card ${compact ? 'compact' : ''}`}><div className="card-title"><div><span className="mini-icon"><Activity size={17}/></span><h2>AQI Over Time</h2></div><button className="period">Last 7 Days <ChevronDown size={13}/></button></div><AqiLine compact={compact}/></article>
}

const routines = [
  { time: 'Morning', hours: '6:00 – 10:00 AM', title: 'Air is comparatively better.', detail: 'Do essential outdoor work early.', state: 'Better', icon: <Sun size={24}/> },
  { time: 'Midday', hours: '10:00 AM – 4:00 PM', title: 'Higher pollution and stronger exposure.', detail: 'Stay indoors, keep windows closed.', state: 'Avoid', icon: <Sun size={24}/> },
  { time: 'Evening', hours: '4:00 – 7:00 PM', title: 'Moderate to high pollution.', detail: 'Keep outdoor time short and light.', state: 'Limited', icon: <Sun size={24}/> },
  { time: 'Night', hours: 'After 7:00 PM', title: 'Relatively better air.', detail: 'Good time for indoor ventilation.', state: 'Good', icon: <Moon size={24}/> },
]

function RoutinePanel() {
  return <div className="routine-layout"><article className="card routine-card">{routines.map((r)=><div className="routine-row" key={r.time}><span className={`weather-icon ${r.time.toLowerCase()}`}>{r.icon}</span><div className="routine-copy"><b>{r.time} <small>({r.hours})</small></b><span>{r.title}</span><p>{r.detail}</p></div><span className={`pill ${r.state.toLowerCase()}`}>{r.state}</span></div>)}</article><aside className="card tips-card"><div className="card-title"><div><span className="mini-icon"><Sparkles size={16}/></span><h2>Routine tips</h2></div><MoreHorizontal size={19}/></div>{['Plan outdoor tasks early.','Use a mask (N95/KN95) if you must go out.','Keep indoor air clean (see Indoor Hacks).','Stay hydrated and eat a balanced diet.','Check AQI before planning outdoor activities.'].map(t=><div className="tip" key={t}><Check size={15}/><span>{t}</span></div>)}</aside></div>
}

const hacks = [
  { icon: <Wind/>, title: 'Ventilation', text: 'Open windows only when outdoor AQI is lower (check first).' },
  { icon: <Activity/>, title: 'Air Filtration', text: 'Use a HEPA filter or air purifier (if available).' },
  { icon: <Sparkles/>, title: 'Dust Control', text: 'Regularly clean surfaces, curtains and soft furnishings.' },
  { icon: <Droplets/>, title: 'Moisture Balance', text: 'Keep humidity at 40–60% to reduce dust and irritation.' },
  { icon: <Leaf/>, title: 'Clean Practices', text: 'Avoid indoor smoking and minimise strong chemical sprays.' },
  { icon: <Leaf/>, title: 'Indoor Plants', text: 'Maintain your existing healthy plants; keep their leaves clean.' },
  { icon: <Wind/>, title: 'Air Flow', text: 'Use exhaust fans in kitchen and bathroom to remove pollutants.' },
  { icon: <Home/>, title: 'Cleaner Indoors', text: 'Keep shoes outside and use a doormat to reduce dust.' },
]

function AdvicePanel({ green = false }: { green?: boolean }) {
  const items = green ? [
    ['Care for Existing Greenery','Keep the plants and trees around your home, street and community healthy with basic care.'],
    ['Add Green Spaces (Where Possible)','Use available space (balcony, terrace, or community areas) for greenery such as small gardens or shared plantation.'],
    ['Keep Surroundings Clean','Avoid burning waste, keep areas dust-free and support proper waste disposal in your locality.'],
    ['Choose Cleaner Movement','Walk or cycle for short distances, use public transport or carpool when possible.'],
  ] : []
  if (green) return <div className="green-layout"><div className="park-art" aria-label="Illustration of a green city park"><div className="sun-disc"/><div className="cityline"><i/><i/><i/><i/><i/></div><div className="park-tree tree-one"/><div className="park-tree tree-two"/><div className="park-path"/></div><div className="green-actions">{items.map(([title,text],i)=><div className="green-action" key={title}><span>{[<Leaf key="leaf"/>,<SproutIcon key="sprout"/>,<Sparkles key="spark"/>,<ArrowRight key="arrow"/>][i]}</span><div><b>{title}</b><p>{text}</p></div></div>)}</div><aside className="impact card"><h2><Activity/> The impact</h2>{['Cleaner, cooler and more pleasant surroundings.','Helps reduce dust and local pollution.','Supports long-term improvement in air quality for your community.'].map(t=><p key={t}><Check/>{t}</p>)}</aside></div>
  return <div className="hack-grid">{hacks.map(h=><article className="hack-card card" key={h.title}><span className="hack-icon">{h.icon}</span><b>{h.title}</b><p>{h.text}</p></article>)}</div>
}
function SproutIcon({ className }: { className?: string }) { return <Leaf className={className}/> }

function AssistantCard({ aqi }: { aqi: number | null }) {
  const [busy,setBusy]=useState(false)
  async function ask(e:React.FormEvent){e.preventDefault();if(!question.trim()||busy)return;setBusy(true);setAnswer('');try{const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,aqi,location:'Ghaziabad'})});const data=await r.json();setAnswer(r.ok?data.answer:(data.error||'AI unavailable'))}catch{setAnswer('AI temporarily unavailable.')}finally{setBusy(false);setQuestion('')}}
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  return <article className="card assistant-card"><div className="card-title"><div><span className="mini-icon"><Bot size={17}/></span><h2>Ask ClearDay</h2></div><span className="online"><i/> Here to help</span></div><div className="assistant-greeting"><span className="assistant-avatar"><Sparkles/></span><p>Hi there! I can help you make sense of today&apos;s air and find simple ways to feel better.</p></div>{answer&&<p className="assistant-answer">{answer}</p>}<form className="ask-form" onSubmit={ask}><input aria-label="Ask ClearDay a question" placeholder="Ask about today’s air…" value={question} onChange={e=>setQuestion(e.target.value)}/><button aria-label="Send question"><ArrowRight size={17}/></button></form><small className="assistant-disclaimer">Guidance is informational, not medical advice.</small></article>
}

export default function Page() {
  const [active, setActive] = useState<Section>('Home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [air,setAir]=useState<AirResponse|null>(null)
  useEffect(()=>{let live=true;async function load(){try{const r=await fetch('/api/air?lat=28.6692&lon=77.4538');if(r.ok&&live)setAir(await r.json())}catch{}}load();const t=setInterval(load,900000);return()=>{live=false;clearInterval(t)}},[])
  return <main className="app-shell"><header className="topbar"><a className="brand-link" href="#home" onClick={()=>setActive('Home')}><Brand/></a><nav className={menuOpen?'nav-links open':'nav-links'} aria-label="Main navigation">{sections.map((s,i)=><button className={active===s?'nav-item active':'nav-item'} onClick={()=>{setActive(s);setMenuOpen(false)}} key={s}>{[<Home key="h"/>,<MapPin key="m"/>,<Activity key="a"/>,<CalendarDays key="c"/>,<Home key="i"/>,<Leaf key="l"/>][i]}{s}</button>)}</nav><div className="top-actions"><span className="location top-location"><MapPin size={14}/> Ghaziabad, India <ChevronDown size={13}/></span><button className="profile-button" aria-label="Help and profile"><CircleHelp size={18}/></button><button className="menu-toggle" aria-label={menuOpen?'Close menu':'Open menu'} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button></div></header>
    <div className="page-content"><div className="welcome-row"><div><div className="date-kicker"><span className="live-dot"/> TUESDAY, NOVEMBER 22 <span className="date-divider">/</span> YOUR DAILY AIR BRIEFING</div><h1>{active==='Home'?'A clearer day starts here.':active}</h1><p>{active==='Home'?'Know your air. Make your day a little healthier.':active==='Map'?'Explore live air quality in your neighbourhood.':active==='AQI Trends'?'Track air quality changes, pollutant levels and patterns over time.':active==='Daily Routine'?"A simple, time-based plan for a safer, healthier day.":active==='Indoor Hacks'?'Practical, low-cost ways to keep your indoor air cleaner.':'Small community actions. A greener, healthier place to breathe.'}</p></div><div className="date-chip"><CalendarDays size={17}/><span>Today <b>· 22 Nov</b></span></div></div>
    {active==='Home'&&<><InteractivePlantHero/><div className="hero-grid"><AirCard air={air}/><div className="right-stack"><article className="card guide-card"><div className="card-title"><div><span className="mini-icon"><Sparkles size={17}/></span><h2>Today&apos;s guide</h2></div><span className="small-tag">PERSONALIZED</span></div><p className="guide-intro">Based on current AQI, here are practical suggestions for your health and day.</p><div className="guide-row"><span className="guide-icon red"><Wind/></span><div><b>Outdoor activity</b><p>Avoid prolonged outdoor activity, especially for children and elderly.</p></div><span className="pill avoid">Avoid</span></div><div className="guide-row"><span className="guide-icon amber"><Home/></span><div><b>Indoor environment</b><p>Keep indoor air clean; ventilate at low-pollution times.</p></div><span className="pill better">Do this</span></div><div className="guide-row"><span className="guide-icon green"><Leaf/></span><div><b>Greener surroundings</b><p>Maintain existing greenery and keep nearby areas clean.</p></div><span className="pill good">Helpful</span></div></article><AssistantCard aqi={air?.current?.us_aqi ?? null}/></div></div><div className="lower-grid"><TrendCard compact/><article className="card meaning-card"><span className="meaning-icon"><Activity/></span><div><b>What does the current US AQI mean?</b><p>{airAdvice(air?.current?.us_aqi)}</p></div><button onClick={()=>setActive('AQI Trends')} className="text-link">Explore AQI <ArrowRight size={14}/></button></article></div><AdBanner/></>}
    {active==='Map'&&<NeighborhoodMapPage onViewTrends={()=>setActive('AQI Trends')}/>}
    {active==='AQI Trends'&&<><div className="tabs-bar"><button className="selected">Overview</button><button>Pollutants</button><button>Hourly</button><button>Daily</button><button>Weekly</button></div><div className="trends-layout"><TrendCard/><article className="card breakdown-card"><div className="card-title"><div><span className="mini-icon"><Sparkles size={17}/></span><h2>Pollutant breakdown <span className="muted">(current)</span></h2></div><span className="small-tag">LIVE</span></div><Pollutants air={air}/><div className="meaning-banner"><Activity/><div><b>What this means</b><p>{airAdvice(air?.current?.us_aqi)}</p></div></div></article></div></>}
    {active==='Daily Routine'&&<><div className="routine-intro"><div className="routine-sun"><Sun/></div><div><span className="eyebrow">YOUR DAY, AT A GLANCE</span><h2>Make room for a breath of fresh air.</h2><p>Check current conditions before planning outdoor activity. Hourly conditions can change.</p></div></div><RoutinePanel/><div className="routine-footnote"><ShieldCheck/><span>Air quality can change throughout the day. Check current conditions before heading out.</span></div></>}
    {(active==='Indoor Hacks'||active==='Green Guidance')&&<><div className="topic-banner"><div className="topic-mark">{active==='Indoor Hacks'?<Home/>:<Leaf/>}</div><div><span className="eyebrow">{active==='Indoor Hacks'?'A HEALTHIER HOME':'A HEALTHIER COMMUNITY'}</span><h2>{active==='Indoor Hacks'?'Your home, a little fresher.':'Grow a greener tomorrow.'}</h2><p>{active==='Indoor Hacks'?'Simple habits to help reduce dust and pollutants in the air you breathe indoors.':'Simple, practical and community-friendly actions to support cleaner air.'}</p></div><div className="topic-decoration"><Leaf/><Leaf/><Leaf/></div></div><AdvicePanel green={active==='Green Guidance'}/><div className="why-card"><span><Check/></span><div><b>{active==='Indoor Hacks'?'Why it helps':'Every action adds up'}</b><p>{active==='Indoor Hacks'?'These steps can reduce indoor pollutant levels like PM₂.₅ and dust, lowering exposure and helping you breathe easier.':'Cleaner surroundings support better health, cooler streets and a more pleasant place for everyone.'}</p></div></div>{active==='Green Guidance'&&<AdBanner green/>}</>}
    <footer className="footer"><Brand/><span>Better air is a shared breath.</span><span className="footer-link">Your local air companion <Leaf size={13}/></span></footer></div></main>
}

function AdBanner({ green = false }: { green?: boolean }) {
  return <div className="ad-banner"><span className="ad-label">COMMUNITY</span><div className="ad-leaf"><Leaf/><Leaf/><Leaf/></div><div><b>{green?'Everyday choices for cleaner air':'Support cleaner air & greener spaces'}</b><p>{green?'Simple tools for a healthier and greener life.':'Simple solutions for a healthier home and neighbourhood.'}</p></div><button>Explore {green?'essentials':'now'} <ArrowRight size={15}/></button></div>
}
