/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import CustomerLocation from '../../../assets/icons/customer-location.png';
import GroceryLocation from '../../../assets/icons/grocery-location.png';
import PharmacyLocation from '../../../assets/icons/pharmacy-location.png';
import ReturantLocation from '../../../assets/icons/restaurant-location.png';
import { addCurrentLocationControl, smoothPanTo } from '../../../components/Shared/ChangeDeliveryAddress/helpers';
import { getTitleForMarker } from '../../AdminOrderTable/OrderTracking/helpers';
import { colorList } from '../helper';

const orderTypeToIconMap = {
  grocery: GroceryLocation,
  pharmacy: PharmacyLocation,
  food: ReturantLocation,
};

function Map({ currentLocation, getSelectedLatLng, setMapReference, zones = [], stores = [] }) {
  const { google } = window;
  const mapRef = useRef();
  const sidebar = useRef();
  const floatingPanel = useRef();
  const userLocationMarker = useRef();

  useEffect(() => {
    // initializing google map here
    let isMounted = true;
    // center points
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: currentLocation?.latitude || 0, lng: currentLocation?.longitude || 0 },
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
        lat: currentLocation?.latitude || 0,
        lng: currentLocation?.longitude || 0,
      },
      icon: userIcon,
      map,
      draggable: true,
    });

    setMapReference({ marker: userLocationMarker?.current, map });

    userLocationMarker.current.addListener('dragend', () => {
      // Handle drag end event (e.g., update the new position in your application)
      const markerPosition = userLocationMarker.current.getPosition();

      const latitude = markerPosition.lat();

      const longitude = markerPosition.lng();

      if (getSelectedLatLng) getSelectedLatLng({ latitude, longitude });
    });

    addCurrentLocationControl(map, google, smoothPanTo, getSelectedLatLng, userLocationMarker.current);

    // set marker for each stores.
    stores.forEach((store, i) => {
      const shopIcon = {
        url: orderTypeToIconMap[store?.shopType],
        scaledSize: new google.maps.Size(30, 60),
      };

      const shopLocation = new google.maps.Marker({
        position: {
          lat: store?.location?.coordinates[1] || 0,
          lng: store?.location?.coordinates[0] || 0,
        },
        icon: shopIcon,
        map,
      });

      // store Title

      const infowindowForStore = new google.maps.InfoWindow({
        content: getTitleForMarker(store?.shopName || 'Store name'),
      });

      infowindowForStore.open(map, shopLocation);

      // store.addListener('click', () => {
      //   redirectWithId(order?.deliveryBoy?._id, 'rider');
      // });
    });

    // set polygon of each zone
    zones.forEach((item, i) => {
      console.log({ color: colorList[i + (1 % 50)], i });
      const polygon = new google.maps.Polygon({
        paths: item?.zoneGeometry?.coordinates,
        strokeColor: colorList[i + (1 % 50)],
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: colorList[i + (1 % 50)],
        fillOpacity: 0.35,
      });

      polygon.setMap(map);
      // Create an InfoWindow to display the tooltip
      const infoWindow = new google.maps.InfoWindow({
        content: getTitleForMarker(item?.zoneName),
      });

      // Add a mouseover event listener to show the tooltip
      google.maps.event.addListener(polygon, 'mouseover', (event) => {
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });

      // Add a mouseout event listener to hide the tooltip
      google.maps.event.addListener(polygon, 'mouseout', () => {
        infoWindow.close();
      });
    });

    // initializing control panel
    const control = floatingPanel.current;

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

    return () => {
      isMounted = false;
    };
  }, [currentLocation?.latitude, currentLocation?.longitude, zones]);

  return <Box ref={mapRef} className="map" style={{ width: '100%', height: '100%', borderRadius: '7px' }}></Box>;
}

export default Map;
