import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box } from '@mui/material';
import GoogleMapReact from 'google-map-react';
import React, { useEffect } from 'react';
import { GOOGLE_API_KEY } from '../assets/staticData';

// use wrapper to avoid console errors
function PointerWrapper() {
  return (
    <Box
      sx={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <LocationOnIcon />
    </Box>
  );
}

function Map({ lat = 0, lng = 0, isGotLocation }) {
  const defaultProps = {
    center: {
      lat,
      lng,
    },
    zoom: 12,
  };
  console.log('lat long for riders: ', lat, lng);

  useEffect(() => {
    isGotLocation();
  }, []);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: GOOGLE_API_KEY,
          language: 'en',
          region: 'US',
          libraries: ['places'],
        }}
        yesIWantToUseGoogleMapApiInternals
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        center={{ lat, lng }}
      >
        <PointerWrapper lat={lat} lng={lng} />
      </GoogleMapReact>
    </div>
  );
}

export default Map;
