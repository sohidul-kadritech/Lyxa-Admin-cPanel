import { Box } from '@mui/material';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import L from 'leaflet';
import { FeatureGroup, MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { successMsg } from '../../helpers/successMsg';
import './ZoneMap.css';
import { calculatePolygonArea, colorList } from './helper';
import mapUrlProvider from './mapUrlProvider';

// eslint-disable-next-line no-unused-vars

// eslint-disable-next-line no-unused-vars
function ZoneMap({ selectedLocation, setCreatedZoneGeometry, allZones, currentLocation, setPolygonArea }) {
  // eslint-disable-next-line no-unused-vars
  const [center, setCenter] = useState(
    // eslint-disable-next-line prettier/prettier
		currentLocation?.loaded ? currentLocation?.coordinates : {lat: 23.8103, lon: 90.4125}
  );
  // eslint-disable-next-line no-unused-vars
  const [selectedMarker, setSelectedMarker] = useState({ lat: 0, lon: 0 });
  // eslint-disable-next-line no-unused-vars
  const [polygonGeoData, setPolygonGeoData] = useState([]);

  // Map Pin Icon URL
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  });

  const zoom_level = 13;

  const mapRef = useRef(null);

  const createdPolygon = (e) => {
    const polygon = e.layer;
    console.log('polygon: ', polygon);
    setPolygonArea(calculatePolygonArea(polygon));
    const coordinates = polygon.getLatLngs()[0].map((latLng) => [latLng.lat, latLng.lng]);
    console.log('get geo: ', coordinates);
    setPolygonGeoData(coordinates);
    setCreatedZoneGeometry(coordinates);
  };

  const polygonEdited = (e) => {
    successMsg('Polygon edited succesfully', 'success');
    const polygon = e?.layers?.getLayers()[0];
    console.log('polygon: ', polygon);
    setPolygonArea(calculatePolygonArea(polygon));
    const coordinates = polygon.getLatLngs()[0].map((latLng) => [latLng.lat, latLng.lng]);
    setPolygonGeoData(coordinates);
    setCreatedZoneGeometry(coordinates);
  };

  const polygonDeleted = () => {
    successMsg('Polygon deleted succesfully', 'success');
    setPolygonArea(0);
    setCreatedZoneGeometry([
      [0, 0],
      [0, 0],
      [0, 0],
    ]);
  };

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

  // for selecting the current location and selected location
  useEffect(() => {
    setCenter(() => {
      if (selectedLocation?.lat !== null && selectedLocation?.lon !== null) {
        handleSetView(selectedLocation?.lat, selectedLocation?.lon);
        handleFlyTo(selectedLocation?.lat, selectedLocation?.lon);
        return { lat: selectedLocation?.lat, lon: selectedLocation?.lon };
      }

      handleSetView(currentLocation?.coordinates?.lat || 23.8103, currentLocation?.coordinates?.lon || 90.4125);
      handleFlyTo(currentLocation?.coordinates?.lat || 23.8103, currentLocation?.coordinates?.lon || 90.4125);
      return currentLocation?.loaded ? currentLocation?.coordinates : { lat: 23.8103, lon: 90.4125 };
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
        {/* Map edit controler */}
        <FeatureGroup>
          <EditControl
            position="topleft"
            onCreated={createdPolygon}
            onEdited={polygonEdited}
            onDeleted={polygonDeleted}
            draw={{
              rectangle: false,
              circle: false,
              circlemarker: false,
              marker: false,
              polyline: false,
            }}
          ></EditControl>
        </FeatureGroup>

        {/* Previous zone will be show here */}
        {allZones.map((loc, i) => (
          <Polygon
            key={i}
            pathOptions={{ color: `${colorList[i % 50]}` }}
            positions={loc?.zoneGeometry?.coordinates[0]}
          >
            <Popup>{loc.zoneName}</Popup>
          </Polygon>
        ))}

        <TileLayer url={mapUrlProvider.maptiler.url}></TileLayer>

        {/* Location marker here */}
        <Marker position={[center.lat, center.lon]}>
          <Popup>{JSON.stringify(center)}</Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}

export default ZoneMap;
