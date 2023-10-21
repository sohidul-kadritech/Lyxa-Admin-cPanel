/* eslint-disable no-unused-vars */
import { LocationOnOutlined } from '@mui/icons-material';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';
import StyledInput from '../../Styled/StyledInput';
import { smoothPanTo } from './helpers';

function StyledSearchAddress({
  deliveryAddress = {},
  setDeliveryAddress,
  onChangeAddressHandler,
  getZoneServiceQuery,
  mapReference,
  setMapReference,
  isNotMarker = true,
  label = 'Location *',
}) {
  const theme = useTheme();

  const generateAddress = async (address = {}) => {
    let latlng;

    try {
      latlng = await getLatLng(address);
    } catch (error) {
      console.log(error);
    }

    if (getZoneServiceQuery) getZoneServiceQuery.mutate({ latitude: latlng?.lat, longitude: latlng?.lng });
    const { google } = window;
    const center = new google.maps.LatLng(latlng?.lat, latlng?.lng);
    // mapReference.setCenter(center);

    if (mapReference && isNotMarker) {
      mapReference.setZoom(24);
      smoothPanTo(mapReference, center, 300, google);
    } else if (mapReference && !isNotMarker) {
      mapReference?.marker.setPosition(center);
      smoothPanTo(mapReference?.map, center, 300, google);
    }

    // newAddress.placeId = placeId;
    setDeliveryAddress((prev) => ({
      ...prev,
      deliveryAddress: { ...prev?.deliveryAddress, latitude: latlng?.lat, longitude: latlng?.lng },
    }));
  };

  // select address here
  const handleAddressSelect = (address, placeId) => {
    setDeliveryAddress((prev) => ({
      ...prev,
      deliveryAddress: { ...prev?.deliveryAddress, address },
    }));
    geocodeByAddress(address);
    geocodeByPlaceId(placeId)
      .then((results) => generateAddress(results[0], placeId))
      .catch((error) => console.error('Error', error));
  };
  return (
    <Stack mt={2.5} sx={{ position: 'relative' }}>
      <Typography sx={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px', pb: '8px' }} variant="h4">
        {label}
      </Typography>

      <PlacesAutocomplete
        value={deliveryAddress?.deliveryAddress?.address}
        onChange={(address) => {
          if (onChangeAddressHandler) onChangeAddressHandler(address);
        }}
        onSelect={handleAddressSelect}
        onError={(error) => {
          console.log(error);
        }}
        clearItemsOnError
        shouldFetchSuggestions={deliveryAddress?.deliveryAddress?.address?.length > 3}
        googleCallbackName="myCallbackFunc"
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <StyledInput
              sx={{
                '& input': {
                  paddingLeft: '18px',
                  paddingRight: '18px',
                  fontWeight: '500',
                  fontSize: '15px',
                  color: theme.palette.text.primary,
                },
              }}
              {...getInputProps()}
              fullWidth
              type="text"
              value={deliveryAddress?.deliveryAddress?.address}
            />
            <Box
              sx={{
                fontSize: '14px',
                width: '100%',
                position: 'absolute',
                top: '65px',
                backgroundColor: '#F6F8FA',
                borderRadius: '8px',
                zIndex: '99999',
                overflow: 'hidden',
              }}
            >
              {loading && <Box sx={{ padding: '6px 16px' }}>Loading...</Box>}
              {suggestions.map((suggestion) => (
                <Box
                  {...getSuggestionItemProps(suggestion)}
                  key={Math.random()}
                  sx={{
                    padding: '6px 16px',
                    fontSize: '14px',
                    fontWeight: '400',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                    alignItems: 'center',

                    '&:hover': {
                      background: '#ecf0f5',
                    },
                  }}
                >
                  <LocationOnOutlined /> <Typography variant="body2"> {suggestion.description}</Typography>
                  {/* {suggestion.description} */}
                </Box>
              ))}
            </Box>
          </div>
        )}
      </PlacesAutocomplete>
    </Stack>
  );
}

export default StyledSearchAddress;
