import React, { useEffect, useRef } from 'react';

export default function OrderTrackingMap({ pickup, dropoff }) {
  const { google } = window;
  const mapRef = useRef();
  const sidebar = useRef();
  const floatingPanel = useRef();

  useEffect(() => {
    // mounted/unmounted flag
    const directionsRenderer_ = new google.maps.DirectionsRenderer();
    const directionsService_ = new google.maps.DirectionsService();

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
          directionsRenderer.setDirections(response);
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
  }, []);

  return <div ref={mapRef} className="map" style={{ width: '100%', height: '400px' }}></div>;
}
