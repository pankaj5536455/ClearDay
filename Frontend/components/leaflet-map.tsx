'use client'

import { CircleMarker, MapContainer, Popup, TileLayer, ZoomControl } from 'react-leaflet'
import type { MapLocation } from './neighborhood-map-page'

const colorForAqi = (aqi: number) => aqi > 400 ? '#9b174f' : aqi > 300 ? '#e52f58' : aqi > 200 ? '#ef7431' : aqi > 100 ? '#e5ad16' : '#159957'

export function LeafletMap({ locations, selectedId, onSelect }: { locations: MapLocation[]; selectedId: string; onSelect: (id: string) => void }) {
  return (
    <MapContainer center={[28.6692, 77.4538]} zoom={12} scrollWheelZoom zoomControl={false} className="leaflet-map" aria-label="Interactive neighbourhood air quality map">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ZoomControl position="bottomright" />
      {locations.map((location) => {
        const selected = selectedId === location.id
        return <CircleMarker key={location.id} center={location.position} radius={selected ? 13 : 10} pathOptions={{ color: '#fff', weight: selected ? 4 : 2, fillColor: colorForAqi(location.aqi), fillOpacity: .94 }} eventHandlers={{ click: () => onSelect(location.id) }}>
          <Popup><b>{location.name}</b><br/>AQI {location.aqi} · {location.label}</Popup>
        </CircleMarker>
      })}
    </MapContainer>
  )
}
