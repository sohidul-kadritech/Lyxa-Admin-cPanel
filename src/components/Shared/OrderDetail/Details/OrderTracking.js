/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import CustomerLocation from '../../../../assets/icons/customer-location.png';
import GroceryLocation from '../../../../assets/icons/grocery-location.png';
import PharmacyLocation from '../../../../assets/icons/pharmacy-location.png';
import ReturantLocation from '../../../../assets/icons/restaurant-location.png';

const shopTypeToIconMap = { grocery: GroceryLocation, pharmacy: PharmacyLocation, food: ReturantLocation };

export default function OrderTrackingMap({ pickup, dropoff, shopType }) {
  const [directionsRenderer, setdirectionsRenderer] = useState(null);
  const [directionsService, setdirectionsService] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const { google } = window;
  const mapRef = useRef();
  const sidebar = useRef();
  const floatingPanel = useRef();

  useEffect(() => {
    let isMounted = true;

    const directionsRenderer_ = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    const directionsService_ = new google.maps.DirectionsService();
    setdirectionsRenderer(directionsRenderer_);
    setdirectionsService(directionsService_);

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 22.328127, lng: 91.805502 },
      zoom: 12,
      disableDefaultUI: true,
    });

    // icons --
    const userIcon = {
      url: CustomerLocation,
      scaledSize: new google.maps.Size(23, 46),
    };

    const shopIcon = {
      url: shopTypeToIconMap[shopType],
      scaledSize: new google.maps.Size(23, 46),
    };

    new google.maps.Marker({
      position: { lat: pickup?.latitude, lng: pickup?.longitude },
      icon: shopIcon,
      map,
    });

    new google.maps.Marker({
      position: { lat: dropoff?.latitude, lng: dropoff?.longitude },
      icon: userIcon,
      map,
    });

    function calculateAndDisplayRoute(directionsService, directionsRenderer) {
      directionsService
        .route({
          origin: { lat: pickup?.latitude, lng: pickup?.longitude },
          destination: { lat: dropoff?.latitude, lng: dropoff?.longitude },
          travelMode: google?.maps?.TravelMode.DRIVING,
        })
        .then((response) => {
          const route = response.routes[0];
          directionsRenderer.setDirections(response);

          if (isMounted) {
            setDistance(route.legs[0].distance.value.toString());
            setDuration(route.legs[0].duration.value.toString());
          }
        })
        .catch((e) => {
          console.log(e);
          // eslint-disable-next-line no-alert
          window.alert(`Directions request failed due to ${e.message}`);
        });
    }

    directionsRenderer_.setMap(map);
    directionsRenderer_.setPanel(sidebar.current);

    const control = floatingPanel.current;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
    calculateAndDisplayRoute(directionsService_, directionsRenderer_);

    return () => {
      isMounted = false;
    };
  }, []);

  return <Box ref={mapRef} className="map" style={{ width: '100%', height: '250px', borderRadius: '7px' }}></Box>;
}
