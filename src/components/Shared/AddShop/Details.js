/* eslint-disable no-unused-vars */
import { Box, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';
import { useQuery } from 'react-query';
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import StyledFormField from '../../Form/StyledFormField';
import StyledInput from '../../Styled/StyledInput';
import { getShopZoneData, getZoneDataFromLatLng, receivePaymentByOptions, statusOptions } from './helper';

const addressInit = {
  address: '',
  latitude: '',
  longitude: '',
  city: '',
  state: '',
  country: '',
  placeId: '',
  pin: '',
  primary: true,
  note: '',
};

export default function ShopDetails({ shop, setShop, onChange, onDrop, isEditShop }) {
  const [render, setRender] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(shop?.shopAddress?.address);

  const [latlngForZone, setLatLngForZone] = useState({
    longitude: shop?.shopAddress?.longitude || 0,
    latitude: shop?.shopAddress?.latitude || 0,
  });

  const [zones, setZones] = useState([]);

  const getZoneFromAddress = useQuery(
    [Api.GET_ZONE_FROM_LATLNG, { ...latlngForZone }],
    () =>
      AXIOS.get(Api.GET_ZONE_FROM_LATLNG, {
        params: { ...latlngForZone },
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          console.log('data zones', data?.data?.zones);

          setZones(() => {
            const zones = getZoneDataFromLatLng(data?.data?.zones);
            console.log('zones: ', zones);
            return zones;
          });
        }
      },
      // eslint-disable-next-line prettier/prettier
    }
  );

  const { currentUser } = useGlobalContext();
  const { adminType } = currentUser;

  const generateShopAddress = async (address = {}, placeId = '') => {
    const { address_components, formatted_address } = address;
    const newAddress = { ...addressInit };
    let latlng;

    try {
      latlng = await getLatLng(address);
    } catch (error) {
      console.log(error);
    }

    newAddress.address = formatted_address;
    newAddress.latitude = latlng?.lat;
    newAddress.longitude = latlng?.lng;
    newAddress.placeId = placeId;

    address_components?.forEach((address_component) => {
      if (address_component?.types?.includes('country')) {
        newAddress.country = address_component?.long_name;
      }

      if (address_component.types.includes('locality')) {
        newAddress.city = address_component?.long_name;
      }

      if (address_component.types.includes('sublocality')) {
        newAddress.state = address_component?.long_name;
      }
    });

    setLatLngForZone((prev) => ({ ...prev, latitude: newAddress.latitude, longitude: newAddress.longitude }));

    shop.shopAddress = newAddress;
    setRender(!render);
  };

  const handleAddressSelect = (address, placeId) => {
    setSelectedAddress(address);
    geocodeByAddress(address);
    geocodeByPlaceId(placeId)
      .then((results) => generateShopAddress(results[0], placeId))
      .catch((error) => console.error('Error', error));
  };

  return (
    <Box>
      {/* shop name */}
      <StyledFormField
        label="Shop Name *"
        intputType="text"
        inputProps={{
          value: shop?.shopName,
          type: 'text',
          name: 'shopName',
          onChange,
        }}
      />

      {/* shop name */}
      <StyledFormField
        label="Shop Manager Name *"
        intputType="text"
        inputProps={{
          value: shop?.name,
          type: 'text',
          name: 'name',
          onChange,
        }}
      />

      {/* email */}
      <StyledFormField
        label="E-mail *"
        intputType="text"
        containerProps={{
          sx: {
            padding: '14px 0px 10px 0',
          },
        }}
        inputProps={{
          value: shop?.email,
          type: 'email *',
          name: 'email',
          onChange,
          autoComplete: 'off',
        }}
      />

      {/* password */}
      <StyledFormField
        label="Password *"
        intputType="password"
        inputProps={{
          value: shop?.password,
          type: 'password *',
          name: 'password',
          onChange,
        }}
      />

      {/* phone  */}
      <StyledFormField
        label="Phone Number *"
        intputType="phoneNumber"
        inputProps={{
          value: shop?.phone_number,
          type: 'text',
          name: 'phone_number',
          onChange: (value) => {
            console.log('value', value);
            setShop((prev) => ({ ...prev, phone_number: value }));
          },
        }}
      />

      <Stack
        gap={2}
        sx={{
          paddingTop: '12px',
          paddingBottom: '12px',
          position: 'relative',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: '600',
            fontSize: '15px',
            lineHeight: '18px',
          }}
        >
          Address*
        </Typography>
        <PlacesAutocomplete
          value={selectedAddress}
          onChange={(address) => setSelectedAddress(address)}
          onSelect={handleAddressSelect}
          onError={(error) => {
            console.log(error);
          }}
          clearItemsOnError
          shouldFetchSuggestions={selectedAddress?.length > 3}
          googleCallbackName="myCallbackFunc"
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <StyledInput {...getInputProps()} fullWidth type="text" value={selectedAddress} />
              <Box
                sx={{
                  fontSize: '14px',
                  width: '100%',
                  position: 'absolute',
                  top: '100%',
                  backgroundColor: '#F6F8FA',
                  borderRadius: '8px',
                  zIndex: '99',
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

                      '&:hover': {
                        background: '#ecf0f5',
                      },
                    }}
                  >
                    {suggestion.description}
                  </Box>
                ))}
              </Box>
            </div>
          )}
        </PlacesAutocomplete>
      </Stack>

      {/* select zone */}

      <StyledFormField
        label="Select a Zone *"
        intputType="select"
        inputProps={{
          name: 'shopZone',
          placeholder: 'Select a zone',
          value: getShopZoneData(shop?.shopZone, zones),
          items: zones,
          onChange,
        }}
      />

      {/* zip code */}
      <StyledFormField
        label="Zip Code *"
        intputType="text"
        inputProps={{
          value: shop.shopAddress.pin,
          type: 'text',
          name: 'pin',
          onChange: (event) => {
            shop.shopAddress.pin = event.target.value;
            setRender(!render);
          },
        }}
      />

      <StyledFormField
        label="Shop Logo *"
        intputType="file"
        inputProps={{
          onDrop: (acceptedFiles) => {
            onDrop(acceptedFiles, 'shopLogo');
          },
          name: 'shopLogo',
          maxSize: 1000 * 1000,
          text: 'Drag and drop or chose photo',
          files: shop?.shopLogo,
          helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
          helperText2: 'Pixels: Minimum 320 for width and height',
        }}
      />

      <StyledFormField
        label="Shop Banner *"
        intputType="file"
        inputProps={{
          onDrop: (acceptedFiles) => {
            onDrop(acceptedFiles, 'shopBanner');
          },
          maxSize: 1000 * 1000,
          text: 'Drag and drop or chose photo',
          files: shop?.shopBanner,
          helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
          helperText2: 'Pixels: Minimum 320 for width and height',
        }}
      />

      {adminType === 'admin' && (
        <StyledFormField
          label="Status *"
          intputType="select"
          inputProps={{
            name: 'shopStatus',
            value: shop?.shopStatus,
            items: statusOptions,
            onChange,
          }}
        />
      )}
      {(adminType === 'admin' || !isEditShop) && (
        <StyledFormField
          label="Receive Payment By*"
          intputType="select"
          inputProps={{
            name: 'shopReceivePaymentBy',
            value: shop?.shopReceivePaymentBy,
            items: receivePaymentByOptions,
            onChange,
          }}
        />
      )}
    </Box>
  );
}
