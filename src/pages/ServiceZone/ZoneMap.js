import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import L from 'leaflet';
import { FeatureGroup, MapContainer, Marker, Polygon, TileLayer, Tooltip } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { useQuery } from 'react-query';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import './ZoneMap.css';
import { calculatePolygonArea, colorList, convertedLonLatToLatLon, getLocationFromLatLng } from './helper';
import mapUrlProvider from './mapUrlProvider';

const defaultCenter = { lat: 23.8103, lon: 90.4125 };

function ZoneMap({
  selectedLocation = {},
  setCreatedZoneGeometry = [],
  allZones = [],
  currentLocation = {},
  setPolygonArea = 0,
  setCreatedZoneArea,
}) {
  const [center, setCenter] = useState(
    // eslint-disable-next-line prettier/prettier
    currentLocation?.loaded && currentLocation?.coordinates ? currentLocation?.coordinates : defaultCenter,
  );
  // eslint-disable-next-line no-unused-vars
  const [selectedMarker, setSelectedMarker] = useState({ lat: 0, lon: 0 });

  // Map Pin Icon URL
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  });

  const zoom_level = 13;

  const mapRef = useRef(null);

  // getAllStore
  const getAllStore = useQuery([API_URL.ALL_SHOP], () => AXIOS.get(API_URL.ALL_SHOP));

  const createdPolygon = (e) => {
    const polygon = e.layer;
    setPolygonArea(calculatePolygonArea(polygon));
    const coordinates = polygon?.getLatLngs()[0]?.map((latLng) => [latLng.lat, latLng.lng]) || [];
    const polygonCenter = polygon.getBounds().getCenter();
    const location = getLocationFromLatLng(polygonCenter.lat, polygonCenter.lng).catch((error) => console.log(error));
    location.then((res) => {
      setCreatedZoneArea(res?.data?.results[0]?.formatted_address);
    });
    setCreatedZoneGeometry(coordinates);
  };

  const polygonEdited = (e) => {
    successMsg('Polygon edited succesfully', 'success');
    const polygon = e?.layers?.getLayers()[0] || [];
    setPolygonArea(calculatePolygonArea(polygon));
    const polygonCenter = polygon.getBounds().getCenter();
    const location = getLocationFromLatLng(polygonCenter.lat, polygonCenter.lng).catch((error) => console.log(error));
    location.then((res) => {
      setCreatedZoneArea(res?.data?.results[0]?.formatted_address);
    });
    const coordinates = polygon?.getLatLngs()[0]?.map((latLng) => [latLng.lat, latLng.lng]) || [];
    // setPolygonGeoData(coordinates);
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
      {getAllStore.isLoading ? (
        <Stack
          sx={{
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: '9999',
            backdropFilter: 'blur(15px)',
            background: '#737373',
            borderRadius: '7px',
          }}
          justifyContent="center"
          alignContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <CircularProgress color="primary" sx={{ width: '100px !important', height: '100px !important' }} />
          <Typography>Please Wait...</Typography>
        </Stack>
      ) : (
        <MapContainer
          style={{ zIndex: '9999' }}
          center={[center?.lat, center?.lon]}
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
              positions={convertedLonLatToLatLon(loc?.zoneGeometry?.coordinates[0]).slice(0, -1)}
            >
              {/* <Popup>{loc.zoneName}</Popup> */}
              <Tooltip background="red" direction="top" offset={[0, 0]} opacity={1} sticky>
                {loc.zoneName}
              </Tooltip>
            </Polygon>
          ))}

          <TileLayer url={mapUrlProvider.maptiler.url}></TileLayer>

          {/* Location marker here */}
          <Marker position={[center?.lat, center?.lon]}>
            <Tooltip direction="top" offset={[-15, -10]} opacity={1} permanent>
              Current Location
            </Tooltip>
            {/* <Popup>{JSON.stringify(center)}</Popup> */}
          </Marker>
          {getAllStore?.data?.data?.shops.map((store) => (
            <Marker position={[store?.location?.coordinates[1], store?.location?.coordinates[0]]}>
              {/* <Popup>{store?.shopName}</Popup> */}
              <Tooltip direction="top" offset={[-15, -10]} opacity={1} permanent>
                {store?.shopName}
              </Tooltip>
              {/* <Typography sx={{ position: 'absolute', top: '0', left: '0' }}>{store?.shopName}</Typography> */}
            </Marker>
          ))}
        </MapContainer>
      )}
    </Box>
  );
}

export default ZoneMap;
