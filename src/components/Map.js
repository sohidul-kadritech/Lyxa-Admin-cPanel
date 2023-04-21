import LocationOnIcon from '@mui/icons-material/LocationOn';
import GoogleMapReact from 'google-map-react';
import React from 'react';
import { GOOGLE_API_KEY } from '../assets/staticData';

// use wrapper to avoid console errors
function PointerWrapper() {
  return <LocationOnIcon />;
}

function Map({ lat = 0, lng = 0 }) {
  const defaultProps = {
    center: {
      lat,
      lng,
    },
    zoom: 12,
  };

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
      >
        <PointerWrapper lat={lat} lng={lng} />
      </GoogleMapReact>
    </div>
  );
}

export default Map;
