/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import ButlerLocation from '../../../assets/icons/butler-location.png';
import CustomerLocation from '../../../assets/icons/customer-location.png';
import GroceryLocation from '../../../assets/icons/grocery-location.png';
import PharmacyLocation from '../../../assets/icons/pharmacy-location.png';
import ReturantLocation from '../../../assets/icons/restaurant-location.png';
import RiderLocation from '../../../assets/icons/riderPin.png';
import { dummyLocationRider } from './helpers';

const orderTypeToIconMap = {
  grocery: GroceryLocation,
  pharmacy: PharmacyLocation,
  food: ReturantLocation,
  butler: ButlerLocation,
  rider: RiderLocation,
};

let counter = 0;
let position = [23.774390073503145, 90.41418541219299];

let numDeltas = 100;
let delay = 100; // milliseconds
let i = 0;
let deltaLat;
let deltaLng;

export default function OrderTrackingMap({ pickup = {}, dropoff = {}, order, orderType = '' }) {
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
      center: { lat: pickup?.latitude, lng: pickup?.longitude },
      zoom: 12,
      disableDefaultUI: true,
    });

    // icons --
    const userIcon = {
      url: CustomerLocation,
      scaledSize: new google.maps.Size(30, 60),
      anchor: new google.maps.Point(14, 43),
      labelOrigin: new google.maps.Point(15, -9),
    };

    const shopIcon = {
      url: orderTypeToIconMap[orderType],
      scaledSize: new google.maps.Size(30, 60),
      anchor: new google.maps.Point(14, 43),
      labelOrigin: new google.maps.Point(15, -9),
    };

    const RiderIcon = {
      url: orderTypeToIconMap.rider,
      scaledSize: new google.maps.Size(60, 60),
      anchor: new google.maps.Point(14, 43),
      labelOrigin: new google.maps.Point(30, -9),
    };

    new google.maps.Marker({
      position: { lat: pickup?.latitude, lng: pickup?.longitude },
      icon: shopIcon,
      title: order?.shop?.shopName,
      label: {
        text: order?.shop?.shopName,
        color: '#525252',
        fontSize: '20px',
        fontWeight: 'bold',
      },
      map,
    });

    new google.maps.Marker({
      position: { lat: dropoff?.latitude, lng: dropoff?.longitude },
      icon: userIcon,
      title: order?.user?.name,
      label: {
        text: order?.user?.name,
        color: '#525252',
        fontSize: '20px',
        fontWeight: 'bold',
      },
      map,
    });

    const riderLocation = new google.maps.Marker({
      position: {
        lat: 23.774390073503145,
        lng: 90.41418541219299,
      },
      icon: RiderIcon,
      title: order?.deliveryBoy?.name || 'Rider Title',
      label: {
        text: order?.deliveryBoy?.name || 'Rider label',
        color: '#525252',
        fontSize: '20px',
        fontWeight: 'bold',
      },
      map,
    });
    function moveMarker() {
      let lat = riderLocation.getPosition().lat();
      let lng = riderLocation.getPosition().lng();
      lat += deltaLat;
      lng += deltaLng;
      // console.log('latlng', );
      let latlng = new google.maps.LatLng(lat, lng);
      // riderLocation.setTitle(`Latitude:${result.lat} | Longitude:${result.lng}`);
      riderLocation.setPosition(latlng);
      if (i !== numDeltas) {
        i++;
        setTimeout(moveMarker, delay);
      }
    }

    function transition(result) {
      i = 0;
      const lat = riderLocation.getPosition().lat();
      // console.log('lat', lat, 'res', result.lat - lat);
      const lng = riderLocation.getPosition().lng();
      // console.log('lng', lng, 'res', result.lng - lng);
      deltaLat = (result.lat - lat) / numDeltas;
      deltaLng = (result.lng - lng) / numDeltas;
      moveMarker();
    }

    setInterval(() => {
      const newPosition = new google.maps.LatLng(dummyLocationRider[counter]?.lat, dummyLocationRider[counter]?.lng);
      let old = counter < dummyLocationRider?.length ? counter : 0;
      transition(dummyLocationRider[old]);
      counter = counter < dummyLocationRider?.length ? counter + 1 : 0;
    }, 1000);

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

    // directionsRenderer_.setMap(map);
    // directionsRenderer_.setPanel(sidebar.current);

    const control = floatingPanel.current;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
    // calculateAndDisplayRoute(directionsService_, directionsRenderer_);

    return () => {
      isMounted = false;
    };
  }, []);

  return <Box ref={mapRef} className="map" style={{ width: '100%', height: '100%', borderRadius: '7px' }}></Box>;
}
