/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-syntax */
import { Avatar, Box, CircularProgress, Stack, Typography } from '@mui/material';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import * as turf from '@turf/turf';
import L from 'leaflet';
import { FeatureGroup, MapContainer, Marker, Polygon, TileLayer, Tooltip } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { useQuery } from 'react-query';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import './ZoneMap.css';
import {
  calculatePolygonArea,
  colorList,
  convertedLatLonToLonLat,
  convertedLonLatToLatLon,
  getLocationFromLatLng,
} from './helper';
import mapUrlProvider from './mapUrlProvider';

function getTurfPolygonData(data) {
  console.log('data', data);
  if (data.length > 4) {
    return [[...data, data[0]]];
  }

  return [[...data, data[0], data[0], data[0]]];
}

function isThisPolygonHasAnyStore(polygon, stores) {
  let isIntersects = false;

  const polygonFeature = turf.polygon(getTurfPolygonData(polygon));

  const allStore = stores.map((store) => ({ shopZone: store?.shopZone, markerPosition: store?.location?.coordinates }));

  allStore.forEach(({ shopZone, markerPosition }, i) => {
    const markerPoint = turf.point([markerPosition[1], markerPosition[0]]);

    if (turf.booleanPointInPolygon(markerPoint, polygonFeature) && shopZone) {
      console.log('shopZone');
      isIntersects = true;
    }
  });

  return isIntersects;
}

function checkPolygonIntersections(newPolygons, existingPolygons) {
  let isIntersects = false;

  const allZones = existingPolygons.map((loc) => convertedLatLonToLonLat(loc?.zoneGeometry?.coordinates[0]));

  console.log('allZones', allZones);

  console.log('newPolygons', newPolygons);

  const poly1 = turf.polygon(getTurfPolygonData(newPolygons));

  allZones.forEach((item, i) => {
    const poly2 = turf.polygon(getTurfPolygonData(item));
    // console.log(newPolygon.getBounds().intersects(existingPolygon.getBounds()));

    const intersection = turf.intersect(poly1, poly2);

    console.log('intersection', intersection);
    if (intersection) {
      isIntersects = true;
    }
  });

  return isIntersects; // No intersection found
}
const defaultCenter = { lat: 23.1, lon: 80.0 };

function ZoneMap({
  selectedLocation = {},
  setCreatedZoneGeometry = [],
  allZones = [],
  currentLocation = {},
  setPolygonArea = 0,
  setCreatedZoneArea,
  currentZone = null,
  isEditZone = false,
  isEditable = true,
  isLoading = false,
  setIsDisable,
}) {
  // eslint-disable-next-line no-unused-vars
  const existingPolygons = [
    [
      [90.27836217031873, 23.80625533896962],
      [90.30204893256419, 23.809398698822793],
      [90.30204893256419, 23.8026403810798],
      [90.28591447132455, 23.793523953586853],
      [90.27836217031873, 23.80625533896962],
      [90.27836217031873, 23.80625533896962],
    ],
    // Add more polygons if needed...
  ];

  // console.log('getBounds(existingPolygons);', checkPolygonIntersections(existingPolygons));

  const [currentLocationName, setCurrentLocationName] = useState(currentZone?.zoneName || '');

  const [center, setCenter] = useState(
    // eslint-disable-next-line prettier/prettier
    currentLocation?.loaded && currentLocation?.coordinates ? currentLocation?.coordinates : defaultCenter,
  );

  // eslint-disable-next-line no-unused-vars
  const [selectedMarker, setSelectedMarker] = useState({ lat: 23.1, lon: 80.0 });

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
  const getAllStore = useQuery([API_URL?.ALL_SHOP, { isLoading }], () => AXIOS.get(API_URL?.ALL_SHOP), {
    onSuccess: (data) => {
      if (data.status) {
        console.log('data', data?.data?.shops);
      }
    },
  });

  const createdPolygon = (e) => {
    const polygon = e.layer;
    setPolygonArea(calculatePolygonArea(polygon));

    const coordinates = polygon?.getLatLngs()[0]?.map((latLng) => [latLng.lat, latLng.lng]) || [];
    const polygonCenter = polygon.getBounds().getCenter();
    const location = getLocationFromLatLng(polygonCenter.lat, polygonCenter.lng).catch((error) => console.log(error));
    location.then((res) => {
      setCreatedZoneArea(res?.data?.results[0]?.formatted_address);
    });

    if (
      checkPolygonIntersections(coordinates, allZones) &&
      !isThisPolygonHasAnyStore(coordinates, getAllStore?.data?.data?.shops)
    ) {
      successMsg('Already assigned a zone in this area!');
    }

    setCreatedZoneGeometry(coordinates);

    if (
      checkPolygonIntersections(coordinates, allZones) &&
      isThisPolygonHasAnyStore(coordinates, getAllStore?.data?.data?.shops) &&
      !isEditZone
    ) {
      successMsg('Already assigned a shop in this area try different area!');
      setIsDisable(true);
      return;
    }

    setIsDisable(false);
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

    if (checkPolygonIntersections(coordinates, allZones)) {
      successMsg('Already assigned a zone in this area!');
    }
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
    setIsDisable(false);
  };

  // Map view handler
  const handleSetView = (newLatitude, newLongitude, newZoomLevel = zoom_level) => {
    const location = getLocationFromLatLng(newLatitude, newLongitude).catch(
      // eslint-disable-next-line prettier/prettier
      (error) => console.log(error),
    );
    location.then((res) => {
      setCurrentLocationName(res?.data?.results[0]?.formatted_address || 'Please relocate it');
    });

    const map = mapRef.current;
    if (map) {
      map.setView([newLatitude, newLongitude], newZoomLevel);
    }
  };

  // Map view handler
  const handleFlyTo = (newLatitude, newLongitude, newZoomLevel = zoom_level) => {
    const location = getLocationFromLatLng(newLatitude, newLongitude).catch(
      // eslint-disable-next-line prettier/prettier
      (error) => console.log(error),
    );
    location.then((res) => {
      setCurrentLocationName(res?.data?.results[0]?.formatted_address || 'Please relocate it');
    });
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

      handleSetView(currentLocation?.coordinates?.lat || 0, currentLocation?.coordinates?.lon || 0);
      handleFlyTo(currentLocation?.coordinates?.lat || 0, currentLocation?.coordinates?.lon || 0);
      return currentLocation?.loaded ? currentLocation?.coordinates : { lat: 0, lon: 0 };
    });
  }, [selectedLocation, currentLocation]);

  return (
    <Box sx={{ width: '100%', height: '100%', zIndex: '-1' }}>
      {/* When all store is loading it will show a circular loader */}
      {getAllStore?.isLoading ? (
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
          maxZoom={50}
          ref={mapRef}
          scrollWheelZoom
        >
          {/* Map edit controler */}
          {isEditable && (
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
          )}

          {/* Previous zone will be show here */}
          {allZones.map((loc, i) => (
            <Polygon
              key={i}
              pathOptions={{ color: `${colorList[i % 50]}` }}
              positions={convertedLonLatToLatLon(loc?.zoneGeometry?.coordinates[0]).slice(0, -1)}
            >
              {/* <Popup>{loc.zoneName}</Popup> */}
              <Tooltip background="red" direction="top" className="custom-tooltip" offset={[0, 0]} opacity={1} sticky>
                {loc.zoneName}
              </Tooltip>
            </Polygon>
          ))}

          <TileLayer url={mapUrlProvider.maptiler.url}></TileLayer>

          {/* Location marker here */}
          <Marker position={[center?.lat, center?.lon]}>
            <Tooltip direction="top" offset={[-15, -10]} opacity={1} permanent>
              <Typography
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: '600',
                  maxWidth: '250px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {currentLocation?.loaded && currentLocation?.isCurrent !== null
                  ? currentLocation?.isCurrent === false
                    ? `Please give permission to get your current location`
                    : `${currentLocationName} (Your Location)`
                  : `${currentLocationName}`}
              </Typography>
            </Tooltip>
            {/* <Popup>{JSON.stringify(center)}</Popup> */}
          </Marker>

          {getAllStore?.data?.data?.shops.map((store) => (
            <Marker position={[store?.location?.coordinates[1], store?.location?.coordinates[0]]}>
              {/* <Popup>{store?.shopName}</Popup> */}
              <Tooltip direction="top" offset={[-15, -10]} opacity={1} permanent>
                <Stack direction="row" gap="5.2px" alignItems="center">
                  {' '}
                  <Avatar src={store?.shopLogo} width="36px" height="36px"></Avatar>
                  <Typography sx={{ textTransform: 'capitalize' }}>{store?.shopName}</Typography>
                </Stack>
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
