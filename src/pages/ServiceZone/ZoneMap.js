import { Box } from '@mui/material';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import L from 'leaflet';
import { FeatureGroup, MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import './ZoneMap.css';
import mapUrlProvider from './mapUrlProvider';

// eslint-disable-next-line no-unused-vars

const polygonData = [
  [51.515, -0.09],
  [51.52, -0.1],
  [51.52, -0.12],
];

// eslint-disable-next-line no-unused-vars
const calculatePolygonArea = (polygonCoordinates) => {
  // const turfPolygon = polygon([polygonCoordinates]);
  // const getArea = area(turfPolygon);
  // return getArea;
};

// eslint-disable-next-line no-unused-vars
function ZoneMap({ selectedLocation, setCreatedZoneGeometry, allZones }) {
  // eslint-disable-next-line no-unused-vars
  const [center, setCenter] = useState({ lat: 23.8103, lon: 90.4125 });
  // eslint-disable-next-line no-unused-vars
  const [selectedMarker, setSelectedMarker] = useState({ lat: 0, lon: 0 });
  // eslint-disable-next-line no-unused-vars
  const [polygonGeoData, setPolygonGeoData] = useState([]);

  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  });
  const zoom_level = 13;
  const mapRef = useRef(null);
  const _created = (e) => {
    const polygon = e.layer;
    const coordinates = polygon.getLatLngs()[0].map((latLng) => [latLng.lat, latLng.lng]);
    console.log('get geo: ', coordinates);
    setPolygonGeoData(coordinates);
    setCreatedZoneGeometry(coordinates);
  };
  // eslint-disable-next-line no-unused-vars
  const handleSetView = (newLatitude, newLongitude, newZoomLevel = zoom_level) => {
    const map = mapRef.current;
    if (map) {
      map.setView([newLatitude, newLongitude], newZoomLevel);
    }
  };
  // eslint-disable-next-line no-unused-vars
  const handleFlyTo = (newLatitude, newLongitude, newZoomLevel = zoom_level) => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([newLatitude, newLongitude], newZoomLevel, {
        duration: 2, // Animation duration in seconds
      });
    }
  };

  useEffect(() => {
    setCenter(() => {
      handleSetView(selectedLocation?.lat, selectedLocation?.lon);
      handleFlyTo(selectedLocation?.lat, selectedLocation?.lon);
      return { lat: selectedLocation?.lat, lon: selectedLocation?.lon };
    });
  }, [selectedLocation]);

  return (
    <Box sx={{ width: '100%', height: '60vh', zIndex: '-1' }}>
      <MapContainer
        style={{ zIndex: '9999' }}
        center={[center.lat, center.lon]}
        zoom={zoom_level}
        ref={mapRef}
        scrollWheelZoom
      >
        <FeatureGroup>
          <EditControl
            position="topleft"
            onCreated={_created}
            draw={{
              rectangle: false,
              circle: false,
              circlemarker: false,
              marker: false,
              polyline: false,
            }}
          ></EditControl>
        </FeatureGroup>
        <Polygon pathOptions={{ color: 'red' }} positions={polygonData} />
        {allZones.map((loc, i) => (
          <Polygon
            key={i}
            pathOptions={{ color: `#${Math.floor(Math.random() * 16777215).toString(16)}` }}
            positions={loc?.zoneGeometry?.coordinates[0]}
          />
        ))}
        <TileLayer url={mapUrlProvider.maptiler.url}></TileLayer>
        {/* Location marker here */}
        <Marker position={[center.lat, center.lon]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}

export default ZoneMap;
