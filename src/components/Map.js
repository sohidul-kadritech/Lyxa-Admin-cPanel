import LocationOnIcon from '@mui/icons-material/LocationOn';
import GoogleMapReact from 'google-map-react';
import React from 'react';
import { GOOGLE_API_KEY } from '../assets/staticData';

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
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <LocationOnIcon className="text-danger fs-2" />
      </GoogleMapReact>
    </div>
  );
}

export default Map;
