/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';

import { Box } from '@mui/material';
import CustomerLocation from '../../../assets/icons/customer-location.png';

function Map({ dropoff, deliveryAddress, getSelectedLatLng }) {
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
      zoom: 15,
      disableDefaultUI: true,
    });

    // icons --
    const userIcon = {
      url: CustomerLocation,
      scaledSize: new google.maps.Size(30, 60),
    };

    userLocationMarker.current = new google.maps.Marker({
      position: {
        lat: deliveryAddress?.deliveryAddress?.latitude || 0,
        lng: deliveryAddress?.deliveryAddress?.longitude || 0,
      },
      icon: userIcon,
      map,
      draggable: true,
    });

    // userLocationMarker.current.addListener('dragstart', () => {
    //   // Handle drag start event

    //   const markerPosition = userLocationMarker.current.getPosition();
    //   const latitude = markerPosition.lat();
    //   const longitude = markerPosition.lng();
    //   console.log('drag start', { latitude, longitude });
    // });

    // userLocationMarker.current.addListener('drag', () => {
    //   // Handle drag event (e.g., update the position on the sidebar)
    //   const markerPosition = userLocationMarker.current.getPosition();
    //   const latitude = markerPosition.lat();
    //   const longitude = markerPosition.lng();
    //   console.log('dragging', { latitude, longitude });
    // });

    userLocationMarker.current.addListener('dragend', () => {
      // Handle drag end event (e.g., update the new position in your application)
      const markerPosition = userLocationMarker.current.getPosition();
      const latitude = markerPosition.lat();
      const longitude = markerPosition.lng();

      getSelectedLatLng({ latitude, longitude });
    });

    // intializing boundary
    const bounds = new google.maps.LatLngBounds();

    bounds.extend(userLocationMarker.current.getPosition());
    map.fitBounds(bounds);

    // initializing control panel
    const control = floatingPanel.current;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

    return () => {
      isMounted = false;
    };
  }, [deliveryAddress?.deliveryAddress?.latitude, deliveryAddress?.deliveryAddress?.longitude]);

  return <Box ref={mapRef} className="map" style={{ width: '100%', height: '100%', borderRadius: '7px' }}></Box>;
}

export default Map;
