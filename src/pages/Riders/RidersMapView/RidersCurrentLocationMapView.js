/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RiderLocation from '../../../assets/icons/riderPin.png';
import { successMsg } from '../../../helpers/successMsg';
import { getTitleForMarker } from '../../AdminOrderTable/OrderTracking/helpers';

function RidersCurrentLocationMapView({ riders = [] }) {
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
    console.log('click me');
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

    const redirectWithId = (id) => {
      console.log('click me');
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
          position: { lat: rider?.location?.coordinates[1], lng: rider?.location?.coordinates[0] },
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
        bounds.extend(marker.getPosition());
      });
    } else {
      successMsg('No riders found!');
    }

    map.fitBounds(bounds);

    const control = floatingPanel.current;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
  }, [riders]);

  return <Box ref={mapRef} className="map" sx={{ width: '100%', height: '100%', borderRadius: '7px' }}></Box>;
}

export default RidersCurrentLocationMapView;
