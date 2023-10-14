import { useEffect, useState } from 'react';
import { successMsg } from '../../helpers/successMsg';

const useGeoLocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: '', lon: '' },
  });

  const onSuccess = (location) => {
    console.log('on success', location);
    setLocation({
      loaded: true,
      isCurrent: true,
      coordinates: {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      },
    });
  };

  const onError = (error) => {
    console.log('on error');
    successMsg('Please Turn on your location');
    setLocation({
      loaded: true,
      isCurrent: false,
      coordinates: {
        lat: 0,
        lon: 0,
      },
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };
  const getCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      onError({
        code: 0,
        message: 'Geolocation not supported',
      });
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  };
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return { location, getCurrentLocation };
};

export default useGeoLocation;
