/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable no-new */
/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ButlerLocation from '../../../assets/icons/butler-location.png';
import CustomerLocation from '../../../assets/icons/customer-location.png';
import GroceryLocation from '../../../assets/icons/grocery-location.png';
import PharmacyLocation from '../../../assets/icons/pharmacy-location.png';
import ReturantLocation from '../../../assets/icons/restaurant-location.png';
import RiderLocation from '../../../assets/icons/riderPin.png';
import getCookiesAsObject from '../../../helpers/cookies/getCookiesAsObject';
import './gmap.css';
import { getTitleForMarker } from './helpers';

const orderTypeToIconMap = {
  grocery: GroceryLocation,
  pharmacy: PharmacyLocation,
  food: ReturantLocation,
  butler: ButlerLocation,
  rider: RiderLocation,
};

let counter = 0;
// let position = [23.774390073503145, 90.41418541219299];

let numDeltas = 100;
let delay = 100; // milliseconds
let i = 0;
let deltaLat;
let deltaLng;

export default function OrderTrackingMap({ pickup = {}, dropoff = {}, order, orderType = '' }) {
  const { socket } = useSelector((state) => state.socketReducer);

  const { access_token } = getCookiesAsObject();

  const [riderLoc, setRiderLoc] = useState({});
  const [directionsRenderer, setdirectionsRenderer] = useState(null);
  const [directionsService, setdirectionsService] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const { google } = window;
  const mapRef = useRef();
  const sidebar = useRef();
  const floatingPanel = useRef();

  const history = useHistory();
  const routeMatch = useRouteMatch();

  const redirectWithId = (id, type) => {
    console.log('click me');
    const path = type === 'shop' ? '/shop/profile/' : type === 'user' ? '/accounts/' : '/riders/';
    history.push({
      pathname: `${path}${id}`,
      state: {
        from: routeMatch?.path,

        backToLabel: 'Back to Order List',
      },
    });
  };

  // useEffect(() => {
  //   if (order?._id && socket) {
  //     console.log('socket emmitting');

  //     socket.emit('join_room', { room: order?._id, data: { access_token } });

  //     socket?.on(`deliveryBoyCurrentLocationUpdate-${order?._id}`, (data) => {
  //       console.log('socket data', data);
  //       setRiderLoc(() => {
  //         console.log('data', data);
  //         return data;
  //       });
  //     });
  //   } else {
  //     console.log('socket for deliveryboy else', socket);
  //   }
  //   return () => {
  //     socket?.removeListener(`deliveryBoyCurrentLocationUpdate-${order?._id}`);
  //   };
  // }, [order?._id, socket]);

  // console.log('riderLoc', riderLoc);

  useEffect(() => {
    let isMounted = true;
    const directionsRenderer_ = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    const directionsService_ = new google.maps.DirectionsService();
    setdirectionsRenderer(directionsRenderer_);
    setdirectionsService(directionsService_);

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: pickup?.latitude, lng: pickup?.longitude },
      zoom: 15,
      disableDefaultUI: true,
    });

    // icons --
    const userIcon = {
      url: CustomerLocation,
      scaledSize: new google.maps.Size(30, 60),
    };

    const shopIcon = {
      url: orderTypeToIconMap[orderType],
      scaledSize: new google.maps.Size(30, 60),
    };

    const RiderIcon = {
      url: orderTypeToIconMap.rider,
      scaledSize: new google.maps.Size(60, 70),
    };

    const shopLocation = new google.maps.Marker({
      position: { lat: pickup?.latitude, lng: pickup?.longitude },
      icon: shopIcon,
      map,
    });

    const userLocation = new google.maps.Marker({
      position: { lat: dropoff?.latitude, lng: dropoff?.longitude },
      icon: userIcon,
      map,
    });

    let riderLocation;

    let bounds = new google.maps.LatLngBounds();

    // check wheather there have any delivery boy or not.
    if (order?.deliveryBoy) {
      riderLocation = new google.maps.Marker({
        position: {
          lat: order?.deliveryBoy?.location?.coordinates[1] || 0,
          lng: order?.deliveryBoy?.location?.coordinates[0] || 0,
        },
        icon: RiderIcon,
        map,
      });
      // Rider Title

      let infowindowForRider = new google.maps.InfoWindow({
        content: getTitleForMarker(order?.deliveryBoy?.name || 'Rider Title'),
      });

      infowindowForRider.open(map, riderLocation);

      riderLocation.addListener('click', () => {
        redirectWithId(order?.deliveryBoy?._id, 'rider');
      });
      bounds.extend(riderLocation.getPosition());
    }
    bounds.extend(userLocation.getPosition());
    bounds.extend(shopLocation.getPosition());
    map.fitBounds(bounds);

    // shop title
    let infowindowForShop = new google.maps.InfoWindow({
      content: getTitleForMarker(order?.shop?.shopName || 'Rider Title'),
    });

    infowindowForShop.open(map, shopLocation);

    // user title
    let infowindowForUser = new google.maps.InfoWindow({
      content: getTitleForMarker(order?.user?.name || 'User Title Not Found'),
    });

    infowindowForUser.open(map, userLocation);

    shopLocation.addListener('click', () => {
      redirectWithId(order?.shop?._id, 'shop');
    });

    userLocation.addListener('click', () => {
      redirectWithId(order?.user?._id, 'user');
    });

    // fit all the markers
    function moveMarker() {
      let lat = riderLocation.getPosition().lat();
      let lng = riderLocation.getPosition().lng();
      lat += deltaLat;
      lng += deltaLng;

      let latlng = new google.maps.LatLng(lat, lng);

      riderLocation.setPosition(latlng);
      if (i !== numDeltas) {
        i++;
        setTimeout(moveMarker, delay);
      }
    }

    function transition(result) {
      i = 0;
      const lat = riderLocation.getPosition().lat();
      const lng = riderLocation.getPosition().lng();
      deltaLat = (result.lat - lat) / numDeltas;
      deltaLng = (result.lng - lng) / numDeltas;
      moveMarker();
    }

    // listening current delivery location via socket
    if (order?._id && socket && order?.deliveryBoy) {
      socket.emit('join_room', { room: order?._id, data: { access_token } });

      socket?.on(`deliveryBoyCurrentLocationUpdate-${order?._id}`, (data) => {
        console.log('socket data', data);
        const coordinates = data?.location?.coordinates;
        const newPosition = new google.maps.LatLng(coordinates[1], coordinates[0]);

        console.log('socket order', order);
        map.panTo({
          lat: coordinates[1],
          lng: coordinates[0],
        });

        transition({
          lat: coordinates[1],
          lng: coordinates[0],
        });
      });
    }

    const control = floatingPanel.current;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

    return () => {
      isMounted = false;
      socket?.removeListener(`deliveryBoyCurrentLocationUpdate-${order?._id}`);
    };
  }, []);

  return <Box ref={mapRef} className="map" style={{ width: '100%', height: '100%', borderRadius: '7px' }}></Box>;
}
