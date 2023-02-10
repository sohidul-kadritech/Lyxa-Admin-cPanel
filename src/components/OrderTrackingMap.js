import React, { useEffect, useRef, useState } from 'react';

function OrderTrackingMap({ pickup, dropoff }) {
  // eslint-disable-next-line no-unused-vars
  const [directionsRenderer, setdirectionsRenderer] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [directionsService, setdirectionsService] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [distance, setDistance] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [duration, setDuration] = useState('');
  const { google } = window;
  const mapRef = useRef();
  const sidebar = useRef();
  const floatingPanel = useRef();

  useEffect(() => {
    // mounted/unmounted flag
    let isMounted = true;

    const directionsRenderer_ = new google.maps.DirectionsRenderer();
    const directionsService_ = new google.maps.DirectionsService();
    setdirectionsRenderer(directionsRenderer_);
    setdirectionsService(directionsService_);

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 22.328127, lng: 91.805502 },
      zoom: 12,
      disableDefaultUI: true,
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

  return <div ref={mapRef} className="map" style={{ width: '100%', height: '400px' }}></div>;
}

export default OrderTrackingMap;
