/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { successMsg } from '../../../helpers/successMsg';

import locationIcon from '../../../assets/icons/currentLocation.png';

export const validateDeliveryAddress = (data) => {
  const status = {
    status: false,
  };

  if (!data?.deliveryAddress?.address) {
    successMsg('Address field is empty!');
    return status;
  }
  if (!data?.deliveryAddress?.apartment) {
    successMsg('Apartment field is empty!');
    return status;
  }

  if (!data?.deliveryAddress?.latitude || !data?.deliveryAddress?.longitude) {
    successMsg('Latitude and longitude is missing !');
    return status;
  }

  if (!data?.deliveryAddress?.addressLabel) {
    successMsg('Address label is missing !');
    return status;
  }

  return { status: true };
};

export function addCurrentLocationControl(map, google, smoothPanTo, getSelectedLatLng) {
  const controlDiv = document.createElement('div');
  const controlUI = document.createElement('div');
  const controlIcon = document.createElement('img'); // Use an <img> element for the icon

  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';

  // Set the path to your PNG icon image
  controlIcon.src = locationIcon; // Replace with the actual path to your PNG icon
  controlIcon.style.width = '24px'; // Adjust the width of the icon as needed
  controlIcon.style.height = '24px'; // Adjust the height of the icon as needed

  controlUI.appendChild(controlIcon);
  controlDiv.appendChild(controlUI);

  // Set up the click event listener to get the current location
  controlUI.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          getSelectedLatLng({ latitude: pos?.lat, longitude: pos?.lng });

          smoothPanTo(map, latlng, 500);
        },
        () => {
          successMsg('Please Turn on your location');
        },
      );
    }
  });

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}
