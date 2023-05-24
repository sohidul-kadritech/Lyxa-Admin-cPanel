import { Typography } from '@mui/material';
import L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { FeatureGroup, MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';
import { convertedLonLatToLatLon } from './helper';
import mapUrlProvider from './mapUrlProvider';

function ZoneMap2({ infoData, polygon, zoneName }) {
  console.log('polygon here edited: ', polygon[0][0]);
  // eslint-disable-next-line no-unused-vars
  const [center, setCenter] = useState({ lat: polygon[0][0][1] || 23.8103, lon: polygon[0][0][0] || 90.4125 });
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  });

  const zoom_level = 13;

  const mapRef = useRef(null);

  // Map view handler
  const handleSetView = (newLatitude, newLongitude, newZoomLevel = zoom_level) => {
    const map = mapRef.current;
    if (map) {
      map.setView([newLatitude, newLongitude], newZoomLevel);
    }
  };

  // Map view handler
  const handleFlyTo = (newLatitude, newLongitude, newZoomLevel = zoom_level) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([newLatitude, newLongitude], newZoomLevel, {
        duration: 2, // Animation duration in seconds
      });
    }
  };

  useEffect(() => {
    handleSetView(polygon[0][0][1], polygon[0][0][0], zoom_level);
    handleFlyTo(polygon[0][0][1], polygon[0][0][0], zoom_level);
  }, [polygon]);

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
      <Polygon positions={convertedLonLatToLatLon(polygon[0]).slice(0, -1)} pathOptions={{ color: `#000000` }}>
        <Popup>
          <Typography sx={{ textTransform: 'capitalize' }}>{`${zoneName} Zone`}</Typography>
        </Popup>
      </Polygon>
      {infoData.map((data) => (
        <Marker position={[data?.location?.coordinates[1], data?.location?.coordinates[0]]}>
          <Popup>
            {' '}
            <Typography sx={{ textTransform: 'capitalize' }}>{data?.name}</Typography>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default ZoneMap2;
