/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import CustomerLocation from '../../assets/icons/customer-location.png';
import GroceryLocation from '../../assets/icons/grocery-location.png';
import PharmacyLocation from '../../assets/icons/pharmacy-location.png';
import ReturantLocation from '../../assets/icons/restaurant-location.png';
import RiderLocation from '../../assets/icons/riderPin.png';
import { addCurrentLocationControl, smoothPanTo } from '../../components/Shared/ChangeDeliveryAddress/helpers';
import { getTitleForMarker, getTitleForStoreMarker } from '../AdminOrderTable/OrderTracking/helpers';
import { colorList } from './helper';

const orderTypeToIconMap = {
  grocery: GroceryLocation,
  pharmacy: PharmacyLocation,
  food: ReturantLocation,
  deliveryBoy: RiderLocation, // icons --
};

function ZoneMapGoogleMap({
  currentLocation,
  getSelectedLatLng,
  setMapReference,
  polygon,
  zoneName,
  zones = [],
  infoData = [],
}) {
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
      center: { lat: infoData[0]?.location?.coordinates[1] || 0, lng: infoData[0]?.location?.coordinates[0] || 0 },
      zoom: 15,
      disableDefaultUI: true,
      fullscreenControl: true,
      scaleControl: true,
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

    if (setMapReference) setMapReference({ marker: userLocationMarker?.current, map });

    userLocationMarker.current.addListener('dragend', () => {
      // Handle drag end event (e.g., update the new position in your application)
      const markerPosition = userLocationMarker.current.getPosition();

      const latitude = markerPosition.lat();

      const longitude = markerPosition.lng();

      smoothPanTo(map, markerPosition, 300, google);

      if (getSelectedLatLng) getSelectedLatLng({ latitude, longitude });
    });

    addCurrentLocationControl(map, google, smoothPanTo, getSelectedLatLng, userLocationMarker.current);

    // set marker for each stores.
    infoData.forEach((data, i) => {
      console.log({ infoData: data });
      const shopIcon = {
        url: orderTypeToIconMap[data?.deliveryBoyType ? 'deliveryBoy' : data?.shopType],
        scaledSize: data?.deliveryBoyType ? new google.maps.Size(60, 70) : new google.maps.Size(30, 60),
      };

      const shopLocation = new google.maps.Marker({
        position: {
          lat: data?.location?.coordinates[1] || 0,
          lng: data?.location?.coordinates[0] || 0,
        },
        icon: shopIcon,
        map,
      });

      // store Title
      const infowindowForStore = new google.maps.InfoWindow({
        content: data?.deliveryBoyType
          ? getTitleForMarker(`${data?.name || 'Rider Title'} (${data?.ongoingOrders || 0})` || 'Rider Title')
          : getTitleForStoreMarker(data?.shopName || 'Store name', data?.shopLogo),
      });

      setMapReference((prev) => ({
        ...prev,
        [data?._id]: shopLocation,
        [`${data?._id}-infowindow`]: infowindowForStore,
        infoWindow: [...(prev?.infoWindow || []), { [`${data?._id}-infowindow`]: infowindowForStore }],
      }));

      shopLocation.addListener('mouseover', (e) => {
        infowindowForStore.open(map, shopLocation);
      });

      shopLocation.addListener('mouseout', (e) => {
        infowindowForStore.close();
      });
    });

    const bounds = new google.maps.LatLngBounds();

    // console.log({ polygon });

    if (polygon?.length > 0) {
      const path = polygon[0].map((coord) => new google.maps.LatLng(coord[1], coord[0]));

      const getAllLatLngCoordinates = polygon[0]?.map((latLng) => new google.maps.LatLng(latLng[1], latLng[0]));

      getAllLatLngCoordinates.forEach((coordinates) => {
        bounds.extend(coordinates);
      });

      // console.log({ path });

      const polygonView = new google.maps.Polygon({
        paths: path, // Use the transformed coordinates
        strokeColor: colorList[1], // Corrected the strokeColor index
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: colorList[1], // Corrected the fillColor index
        fillOpacity: 0.35,
      });

      polygonView.setMap(map);

      map.fitBounds(bounds);
      // Create an InfoWindow to display the tooltip
      const infoWindow = new google.maps.InfoWindow({
        content: getTitleForMarker(zoneName),
      });

      // Add a mouseover event listener to show the tooltip
      google.maps.event.addListener(polygonView, 'mouseover', (event) => {
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });

      // Add a mouseout event listener to hide the tooltip
      google.maps.event.addListener(polygonView, 'mouseout', () => {
        infoWindow.close();
      });
    }

    // initializing control panel
    const control = floatingPanel.current;

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

    return () => {
      isMounted = false;
    };
  }, [infoData]);

  return <Box ref={mapRef} className="map" style={{ width: '100%', height: '100%', borderRadius: '7px' }}></Box>;
}

export default ZoneMapGoogleMap;
