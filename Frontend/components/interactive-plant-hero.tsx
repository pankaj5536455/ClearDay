'use client'

import { useState } from 'react'
import { Droplets, Leaf, Sparkles, Sun } from 'lucide-react'

const careActions = [
  { label: 'Water', icon: Droplets, message: 'A little water goes a long way.' },
  { label: 'Sunlight', icon: Sun, message: 'Finding the brightest spot.' },
  { label: 'Mist', icon: Sparkles, message: 'Leaves refreshed and dust-free.' },
]

export function InteractivePlantHero() {
  const [care, setCare] = useState(68)
  const [message, setMessage] = useState('Your little green companion is doing well.')
  const [lastAction, setLastAction] = useState('')

  function careForPlant(action: (typeof careActions)[number]) {
    setCare((current) => Math.min(100, current + 8))
    setMessage(action.message)
    setLastAction(action.label)
  }

  return (
    <section className="plant-hero" aria-labelledby="plant-hero-title">
      <div className="plant-story">
        <span className="plant-kicker"><Leaf size={14} /> YOUR DAILY BREATH OF GREEN</span>
        <h2 id="plant-hero-title">Better air.<br /><span>Healthier days.</span></h2>
        <p>Small acts of care make a brighter space to breathe. Give your plant a moment today.</p>
        <div className="plant-impact"><span><b>+{Math.min(32, Math.floor(care / 3))}%</b><small>care today</small></span><i/><span><b>1</b><small>green moment</small></span></div>
      </div>
      <div className={`plant-stage ${lastAction ? 'plant-stage-active' : ''}`}>
        <div className="plant-halo" />
        <div className="plant-orbit orbit-one" />
        <div className="plant-orbit orbit-two" />
        <img className="feature-plant" src="/clearday-tree.png" alt="A leafy green indoor tree growing in a white planter" />
        <span className="plant-floating floating-one"><Leaf size={16}/></span>
        <span className="plant-floating floating-two"><Leaf size={12}/></span>
        <span className="plant-stage-caption"><span className="plant-status-dot"/> Your little green companion</span>
      </div>
      <div className="plant-care-card">
        <div className="plant-care-heading"><div><span className="eyebrow">A MOMENT FOR NATURE</span><h3>Care for your plant</h3></div><span className="plant-sparkle"><Sparkles size={17}/></span></div>
        <p className="plant-care-message" aria-live="polite">{message}</p>
        <div className="plant-care-meter"><div><span>Plant wellbeing</span><b>{care}%</b></div><div className="plant-care-track"><span style={{ width: `${care}%` }}/></div></div>
        <div className="plant-care-actions">
          {careActions.map(({ label, icon: Icon, ...action }) => <button className={lastAction === label ? 'plant-action selected' : 'plant-action'} key={label} onClick={() => careForPlant({ label, icon: Icon, ...action })} aria-label={`${label} your plant`}><Icon size={17}/><span>{label}</span></button>)}
        </div>
        <small className="plant-care-note">A small green moment, just for you.</small>
      </div>
    </section>
  )
}
