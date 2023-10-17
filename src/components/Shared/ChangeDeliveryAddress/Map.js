/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';

import { Box } from '@mui/material';
import CustomerLocation from '../../../assets/icons/customer-location.png';
import { addCurrentLocationControl, customMarker, smoothPanTo } from './helpers';

function Map({ dropoff, deliveryAddress, getSelectedLatLng, setMapReference }) {
  const { google } = window;
  const mapRef = useRef();
  const sidebar = useRef();
  const floatingPanel = useRef();
  const userLocationMarker = useRef();

  useEffect(() => {
    // initializing google map here
    let isMounted = true;
    const directionsRenderer_ = new google.maps.DirectionsRenderer();
    const directionsService_ = new google.maps.DirectionsService();
    // center points
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: dropoff?.latitude, lng: dropoff?.longitude },
      zoom: 19,
      disableDefaultUI: true,
    });

    setMapReference(map);

    // icons --
    const userIcon = {
      url: CustomerLocation,
      scaledSize: new google.maps.Size(30, 60),
    };

    // drag||dragend||dragstart
    const mapDragListener = map.addListener('dragend', () => {
      const newCenter = map.getCenter();
      map.setCenter(newCenter);
      const latitude = newCenter.lat();
      const longitude = newCenter.lng();

      getSelectedLatLng({ latitude, longitude });
    });

    // get current location
    addCurrentLocationControl(map, google, smoothPanTo, getSelectedLatLng);

    // custom animated marker
    customMarker(map, google);

    // initializing control panel
    const control = floatingPanel.current;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

    return () => {
      isMounted = false;
    };
  }, []);

  return <Box ref={mapRef} className="map" style={{ width: '100%', height: '100%', borderRadius: '7px' }}></Box>;
}

export default Map;
