/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { successMsg } from '../../../helpers/successMsg';

import locationIcon from '../../../assets/icons/currentLocation.png';
import CustomerLocation from '../../../assets/icons/customer-location.png';

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
  controlUI.style.marginRight = '10px';
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

          smoothPanTo(map, latlng, 500, google);
        },
        () => {
          successMsg('Please Turn on your location');
        }
      );
    }
  });

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}

export const markerBounce = (marker, google) => {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
};

// custom marker
export function customMarker(map, google) {
  const controlDiv = document.createElement('div');
  const controlUI = document.createElement('div');
  const controlIcon = document.createElement('img'); // Use an <img> element for the icon
  const shadowDiv = document.createElement('div');

  // Set the path to your PNG icon image
  controlIcon.src = CustomerLocation; // Replace with the actual path to your PNG icon
  controlIcon.style.width = '30px'; // Adjust the width of the icon as needed
  controlIcon.style.height = '60px'; // Adjust the height of the icon as needed

  // Center the marker image within the controlDiv
  controlDiv.style.position = 'absolute';
  controlDiv.style.display = 'flex';
  controlDiv.style.justifyContent = 'center'; // Center horizontally
  controlDiv.style.alignItems = 'center'; // Center vertically
  controlDiv.style.bottom = '10px'; // Adjust the bottom positioning as needed
  controlDiv.style.top = '-5%'; // Center horizontally on the map
  controlDiv.style.left = '50%'; // Center horizontally on the map
  controlDiv.style.transform = 'translateX(-50%,-50%)'; // Center horizontally on the map
  controlDiv.style.transition = 'all 0.3s ease-in-out';

  // Add styling to the controlUI if needed
  controlUI.style.backgroundColor = 'transparent';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';

  // Apply shadow style
  shadowDiv.style.width = '30px'; // Adjust the shadow width
  shadowDiv.style.height = '5px'; // Adjust the shadow height
  shadowDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'; // Adjust shadow color and opacity
  shadowDiv.style.borderRadius = '50%'; // Make the shadow rounded
  shadowDiv.style.marginTop = '1px';
  shadowDiv.style.marginLeft = '0px';
  // shadowDiv.style.backdropFilter = 'blur(20px)';
  shadowDiv.style.transition = 'all 0.3s ease-in-out';

  controlUI.appendChild(controlIcon);
  controlUI.appendChild(shadowDiv);
  controlDiv.appendChild(controlUI);

  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(controlDiv); // Adjust the position as needed

  // Add event listeners for map drag and dragend events
  map.addListener('drag', () => {
    // Animate the marker image to the top
    controlDiv.style.top = '-8%'; // Adjust the top positioning as needed
    shadowDiv.style.width = '20px'; // Adjust the shadow width
    shadowDiv.style.height = '10px';
    shadowDiv.style.marginTop = '16px';
    shadowDiv.style.marginLeft = '5px';
    shadowDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
  });

  map.addListener('dragend', () => {
    // Return the marker image to its initial position
    controlDiv.style.top = '-5%';
    shadowDiv.style.width = '30px'; // Adjust the shadow width
    shadowDiv.style.height = '5px';
    shadowDiv.style.marginTop = '1px';
    shadowDiv.style.marginLeft = '0px';
    shadowDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
  });
}

// smooth pan to
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

// Function to smoothly pan the map to a new location with easing
export function smoothPanTo(map, finalPosition, duration, google) {
  const initialPosition = map.getCenter();
  const startTime = Date.now();

  function animateStep() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const percentage = Math.min(1, elapsedTime / duration);
    const easedPercentage = easeInOutCubic(percentage);

    const newLat = initialPosition.lat() + (finalPosition.lat() - initialPosition.lat()) * easedPercentage;
    const newLng = initialPosition.lng() + (finalPosition.lng() - initialPosition.lng()) * easedPercentage;

    const newPosition = new google.maps.LatLng(newLat, newLng);
    map.setCenter(newPosition);
    map.setZoom(13);

    if (percentage < 1) {
      requestAnimationFrame(animateStep);
    }
  }

  requestAnimationFrame(animateStep);
}
