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
      zoom: 13,
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

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    }

    // Function to smoothly pan the map to a new location with easing
    function smoothPanTo(map, finalPosition, duration) {
      const initialPosition = map.getCenter();
      const startTime = Date.now();

      function animateStep() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const percentage = Math.min(1, elapsedTime / duration);
        const easedPercentage = easeInOutCubic(percentage);

        const newLat = initialPosition.lat() + (finalPosition.lat() - initialPosition.lat()) * easedPercentage;
        const newLng = initialPosition.lng() + (finalPosition.lng() - initialPosition.lng()) * easedPercentage;

        const newPosition = new google.maps.LatLng(newLat, newLng);
        map.panTo(newPosition);
        map.setZoom(13);

        if (percentage < 1) {
          requestAnimationFrame(animateStep);
        }
      }

      requestAnimationFrame(animateStep);
    }

    // drag||dragend||dragstart

    userLocationMarker.current.addListener('dragend', () => {
      // Handle drag end event (e.g., update the new position in your application)
      const markerPosition = userLocationMarker.current.getPosition();
      const latitude = markerPosition.lat();
      const longitude = markerPosition.lng();

      getSelectedLatLng({ latitude, longitude });
    });

    // intializing boundary
    const bounds = new google.maps.LatLngBounds();

    // bounds.extend(userLocationMarker.current.getPosition());
    // map.fitBounds(bounds);
    // map.panTo(userLocationMarker.current.getPosition());

    // map.panTo(userLocationMarker.current.getPosition());
    setTimeout(() => {
      smoothPanTo(map, userLocationMarker.current.getPosition(), 300);
    }, 100);

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
