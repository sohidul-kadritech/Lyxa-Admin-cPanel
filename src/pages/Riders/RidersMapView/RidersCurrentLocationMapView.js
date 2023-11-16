/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import CustomerLocation from '../../../assets/icons/customer-location.png';
import RiderLocation from '../../../assets/icons/riderPin.png';
import { successMsg } from '../../../helpers/successMsg';
import { getTitleForMarker } from '../../AdminOrderTable/OrderTracking/helpers';
import { formateZoneCoordinates } from '../../ServiceZone/Mapview/helpers';
import { colorList } from '../../ServiceZone/helper';

function RidersCurrentLocationMapView({ riders = [], setMapRef, zones }) {
  const { google } = window;
  const [directionsRenderer, setdirectionsRenderer] = useState(null);
  const [directionsService, setdirectionsService] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const mapRef = useRef();
  // const sidebar = useRef();
  const floatingPanel = useRef();

  const history = useHistory();

  const routeMatch = useRouteMatch();

  const redirectWithId = (id) => {
    const path = '/riders/';
    history.push({
      pathname: `${path}${id}`,
      state: {
        from: routeMatch?.path,
        backToLabel: 'Back to Order List',
      },
    });
  };

  useEffect(() => {
    const directionsRenderer_ = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    const directionsService_ = new google.maps.DirectionsService();
    setdirectionsRenderer(directionsRenderer_);
    setdirectionsService(directionsService_);

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 0, lng: 0 },
      zoom: 15,
      disableDefaultUI: true,
    });

    // icons --
    const RiderIcon = {
      url: RiderLocation,
      scaledSize: new google.maps.Size(60, 70),
    };

    // icons --
    const userIcon = {
      url: CustomerLocation,
      scaledSize: new google.maps.Size(30, 60),
    };

    const redirectWithId = (id) => {
      const path = '/riders/';

      history.push({
        pathname: `${path}${id}`,
        state: {
          from: routeMatch?.path,
          backToLabel: 'Back to Order List',
        },
      });
    };

    const bounds = new google.maps.LatLngBounds();

    if (riders?.length > 0) {
      riders?.forEach((rider) => {
        const marker = new google.maps.Marker({
          position: { lat: rider?.location?.coordinates[1] || 0, lng: rider?.location?.coordinates[0] || 0 },
          icon: RiderIcon,
          map,
        });

        const infowindow = new google.maps.InfoWindow({
          content: getTitleForMarker(`${rider?.name || 'Rider Title'} (${rider?.ongoingOrders || 0})` || 'Rider Title'),
        });

        // Add a click event listener to open the info window when marker is clicked
        infowindow.open(map, marker);

        marker.addListener('click', () => {
          redirectWithId(rider?._id);
        });
        bounds?.extend(marker.getPosition());
      });
    } else {
      successMsg('No available riders found!');
    }

    map?.fitBounds(bounds);

    const center = bounds.getCenter();

    // console.log('center', center.lat(), center.lng());

    const currentLocation = new google.maps.Marker({
      position: { lat: center.lat(), lng: center.lng() },
      icon: userIcon,
      map,
    });

    setMapRef({ map, currentLocation });

    currentLocation.setMap(null);

    // set polygon of each zone
    formateZoneCoordinates(zones).forEach((item, i) => {
      console.log({ color: colorList[i + (1 % 50)], i });
      const coordinates = item?.zoneGeometry?.coordinates;

      if (coordinates && coordinates.length > 0) {
        // Transform the coordinates into LatLng objects
        const path = coordinates.map((coord) => new google.maps.LatLng(coord.lat, coord.lng));

        const polygon = new google.maps.Polygon({
          paths: path, // Use the transformed coordinates
          strokeColor: colorList[i % 50], // Corrected the strokeColor index
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: colorList[i % 50], // Corrected the fillColor index
          fillOpacity: 0.2,
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
      }
    });

    const control = floatingPanel.current;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
  }, [riders]);

  return <Box ref={mapRef} className="map" sx={{ width: '100%', height: '100%', borderRadius: '7px' }}></Box>;
}

export default RidersCurrentLocationMapView;
