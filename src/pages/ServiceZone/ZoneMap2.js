import L from 'leaflet';
import React, { useRef, useState } from 'react';
import { FeatureGroup, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import mapUrlProvider from './mapUrlProvider';

function ZoneMap2() {
  // eslint-disable-next-line no-unused-vars
  const [center, setCenter] = useState({ lat: 23.8103, lon: 90.4125 });
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  });

  const zoom_level = 13;

  const mapRef = useRef(null);

  return (
    <MapContainer
      style={{ zIndex: '9' }}
      center={[center.lat, center.lon]}
      zoom={zoom_level}
      ref={mapRef}
      scrollWheelZoom
    >
      {/* Map edit controler */}
      <FeatureGroup></FeatureGroup>

      <TileLayer url={mapUrlProvider.maptiler.url}></TileLayer>
      <Marker position={[center.lat, center.lon]}>
        <Popup>{JSON.stringify(center)}</Popup>
      </Marker>
      <Marker position={[23.82, 90.4125]}>
        <Popup>{JSON.stringify(center)}</Popup>
      </Marker>
    </MapContainer>
  );
}

export default ZoneMap2;
