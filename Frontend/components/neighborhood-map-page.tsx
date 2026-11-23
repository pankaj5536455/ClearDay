'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Activity, ArrowRight, Info, MapPin, Navigation, Wind } from 'lucide-react'

export type MapLocation = { id: string; name: string; distance: string; aqi: number; label: string; position: [number, number] }

const locations: MapLocation[] = [
  { id: 'you', name: 'Your area · Ghaziabad', distance: 'You are here', aqi: 347, label: 'Severe', position: [28.6692, 77.4538] },
  { id: 'indirapuram', name: 'Indirapuram', distance: '3 km', aqi: 298, label: 'Poor', position: [28.6469, 77.3703] },
  { id: 'vaishali', name: 'Vaishali', distance: '5 km', aqi: 289, label: 'Poor', position: [28.6497, 77.3397] },
  { id: 'raj-nagar', name: 'Raj Nagar', distance: '6 km', aqi: 412, label: 'Severe', position: [28.6925, 77.4405] },
  { id: 'sahibabad', name: 'Sahibabad', distance: '8 km', aqi: 154, label: 'Moderate', position: [28.6777, 77.3391] },
]

const LeafletMap = dynamic(() => import('./leaflet-map').then((module) => module.LeafletMap), { ssr: false, loading: () => <div className="map-loading">Loading neighbourhood map…</div> })

function aqiClass(aqi: number) {
  if (aqi <= 50) return 'good'
  if (aqi <= 100) return 'satisfactory'
  if (aqi <= 200) return 'moderate'
  if (aqi <= 300) return 'poor'
  if (aqi <= 400) return 'very-poor'
  return 'severe'
}

export function NeighborhoodMapPage({ onViewTrends }: { onViewTrends: () => void }) {
  const [selectedId, setSelectedId] = useState('you')
  const selected = locations.find((location) => location.id === selectedId) ?? locations[0]

  return <section className="neighborhood-page" aria-label="Neighbourhood AQI map">
    <div className="map-page-heading"><div><span className="eyebrow"><MapPin size={14}/> LOCAL AIR QUALITY</span><h2>Air quality, around you.</h2><p>Explore current air quality across Ghaziabad and nearby areas.</p></div><span className="map-updated"><span className="live-dot"/> Updated 5 min ago</span></div>
    <div className="map-dashboard">
      <div className="map-frame"><LeafletMap locations={locations} selectedId={selectedId} onSelect={setSelectedId}/><div className="map-overlay-pill"><MapPin size={14}/> Ghaziabad, India</div><div className="map-legend"><span><i className="good"/> Good</span><span><i className="moderate"/> Moderate</span><span><i className="poor"/> Poor</span><span><i className="severe"/> Severe</span></div></div>
      <aside className="map-sidebar"><article className="card map-nearby"><div className="card-title"><div><span className="mini-icon"><Navigation size={16}/></span><h2>Nearby areas</h2></div><span className="small-tag">5 LOCATIONS</span></div><p className="map-side-intro">Tap an area to explore its latest reading.</p><div className="nearby-list">{locations.map((location) => <button className={selectedId === location.id ? 'nearby-row active' : 'nearby-row'} key={location.id} onClick={() => setSelectedId(location.id)} aria-pressed={selectedId === location.id}><span className="nearby-location"><b>{location.name}</b><small>{location.distance}</small></span><span className={`aqi-chip ${aqiClass(location.aqi)}`}>{location.aqi}</span></button>)}</div></article>
        <article className="card map-legend-card"><div className="card-title"><div><span className="mini-icon"><Activity size={16}/></span><h2>AQI scale</h2></div><Info size={15}/></div><div className="legend-list">{[['good','Good','0–50'],['satisfactory','Satisfactory','51–100'],['moderate','Moderate','101–200'],['poor','Poor','201–300'],['very-poor','Very poor','301–400'],['severe','Severe','401+']].map(([tone,label,range])=><div className="legend-row" key={tone}><i className={tone}/><span>{label}</span><small>{range}</small></div>)}</div></article></aside>
    </div>
    <div className="map-insight card"><span className="map-insight-icon"><Wind size={18}/></span><div><span className="eyebrow">YOUR AREA · {selected.distance.toUpperCase()}</span><p><b>{selected.name}</b> is currently <strong className={`aqi-text ${aqiClass(selected.aqi)}`}>{selected.label.toLowerCase()}</strong> with an AQI of {selected.aqi}. {selected.aqi > 300 ? 'Limit outdoor exertion and keep windows closed during peak hours.' : 'Check back before planning time outdoors.'}</p></div><button type="button" onClick={onViewTrends} className="text-link">View trends <ArrowRight size={14}/></button></div>
  </section>
}
