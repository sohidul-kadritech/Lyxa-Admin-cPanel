import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledInput from '../../components/Styled/StyledInput';
import { statusTypeOptions } from '../Faq2/helpers';
import { createSellerData, sellerTypeOption, validateSellersData } from './helpers';

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

function EditShop({ onClose, isEdit, sellerData: shopData = {}, addSellerQuery, loading, setLoading }) {
  const [newShopData, setNewShopData] = useState(shopData);

  console.log('=========>', shopData);

  const [selectedAddress, setSelectedAddress] = useState(shopData?.addressSeller?.address);
  const [render, setRender] = useState(false);

  const changeHandler = (e) => {
    if (e.target.name === 'pin') {
      setNewShopData((prev) => {
        console.log('seller data: ', { ...prev, [e.target.name]: e.target.value });
        return { ...prev, sellerAddress: { ...newShopData?.sellerAddress, [e.target.name]: e.target.value } };
      });
    } else {
      setNewShopData((prev) => {
        console.log('seller data: ', { ...prev, [e.target.name]: e.target.value });
        return { ...prev, [e.target.name]: e.target.value };
      });
    }
  };

  const onDrop = (acceptedFiles, photoType) => {
    console.log(acceptedFiles);
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        // eslint-disable-next-line prettier/prettier
      }),
    );
    setNewShopData((prev) => ({
      ...prev,
      [photoType]: newFiles?.length > 0 ? newFiles : prev[photoType],
    }));
  };

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

    newShopData.sellerAddress = newAddress;
    setRender(!render);
  };

  const handleAddressSelect = (address, placeId) => {
    setSelectedAddress(address);
    geocodeByAddress(address);
    geocodeByPlaceId(placeId)
      .then((results) => generateShopAddress(results[0], placeId))
      .catch((error) => console.error('Error', error));
  };

  const onSubmitSeller = async () => {
    const isValid = validateSellersData(newShopData, isEdit);
    console.log(isValid);
    if (isValid) {
      const generatedData = await createSellerData(newShopData, isEdit);

      if (generatedData?.status !== false) {
        console.log('generatedData: ', generatedData);
        addSellerQuery.mutate(generatedData);
      }
    } else {
      console.log('not valid');
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  return (
    <SidebarContainer title="Edit Shop" onClose={onClose}>
      <StyledFormField
        label="Shop Name *"
        intputType="text"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          value: newShopData?.shopName,
          placeholder: 'Shop name',
          type: 'text',
          name: 'shopName',
          onChange: changeHandler,
          //   readOnly: isReadOnly,
        }}
      />
      <StyledFormField
        label="Email *"
        intputType="text"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          value: newShopData?.email,
          placeholder: 'Email name',
          type: 'text',
          name: 'email',
          onChange: changeHandler,
          //   readOnly: isReadOnly,
        }}
      />
      <StyledFormField
        label="Password *"
        intputType="text"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          value: newShopData?.password,
          placeholder: 'password',
          type: 'password',
          name: 'password',
          onChange: changeHandler,
          //   readOnly: isReadOnly,
        }}
      />
      <StyledFormField
        label="Phone Number *"
        intputType="text"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          value: newShopData?.phone_number,
          placeholder: 'Phone number',
          type: 'text',
          name: 'phone_number',
          onChange: changeHandler,
          //   readOnly: isReadOnly,
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

      <StyledFormField
        label="Zip code *"
        intputType="text"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          value: newShopData?.shopAddress?.pin,
          placeholder: 'Zip code',
          type: 'text',
          name: 'pin',
          onChange: changeHandler,
          //   readOnly: isReadOnly,
        }}
      />

      <StyledFormField
        label="Seller Type *"
        intputType="select"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          name: 'sellerType',
          placeholder: 'Seller type',
          value: newShopData?.sellerType || '',
          items: sellerTypeOption,
          onChange: changeHandler,
          //   readOnly: isReadOnly,
        }}
      />
      <StyledFormField
        label="Status *"
        intputType="select"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          name: 'sellerStatus',
          placeholder: 'Status',
          value: newShopData?.sellerStatus || '',
          items: statusTypeOptions,
          onChange: changeHandler,
          //   readOnly: isReadOnly,
        }}
      />

      <StyledFormField
        label="Profile Photo *"
        intputType="file"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          onDrop: (acceptedFiles) => {
            onDrop(acceptedFiles, 'profile_photo');
          },
          name: 'profile_photo',
          maxSize: 1000 * 1000,
          text: 'Drag and drop or chose photo',
          files: newShopData?.profile_photo,
          //   files: editedData.shopLogo,
          helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
          helperText2: 'Pixels: Minimum 320 for width and height',
        }}
      />

      <StyledFormField
        label="Certificate Of Incorporation *"
        intputType="file"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          onDrop: (acceptedFiles) => {
            onDrop(acceptedFiles, 'certificate_of_incorporation');
          },
          name: 'certificate_of_incorporation',
          maxSize: 1000 * 1000,
          text: 'Drag and drop or chose photo',
          files: newShopData?.certificate_of_incorporation,
          helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
          helperText2: 'Pixels: Minimum 320 for width and height',
        }}
      />
      <StyledFormField
        label="National ID *"
        intputType="file"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          onDrop: (acceptedFiles) => {
            onDrop(acceptedFiles, 'national_id');
          },
          name: 'national_id',
          maxSize: 1000 * 1000,
          text: 'Drag and drop or chose photo',
          files: newShopData?.national_id,
          helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
          helperText2: 'Pixels: Minimum 320 for width and height',
        }}
      />

      <StyledFormField
        label="Contract Paper *"
        intputType="file"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          onDrop: (acceptedFiles) => {
            onDrop(acceptedFiles, 'sellerContractPaper');
          },
          name: 'sellerContractPaper',
          maxSize: 1000 * 1000,
          text: 'Drag and drop or chose photo',
          files: newShopData?.sellerContractPaper,
          //   files: editedData.shopLogo,
          helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
          helperText2: 'Pixels: Minimum 320 for width and height',
        }}
      />
      <Stack sx={{ padding: '30px 0px' }}>
        <Button
          disableElevation
          variant="contained"
          disabled={loading}
          onClick={() => {
            onSubmitSeller();
            setLoading(true);
          }}
          fullWidth
        >
          {isEdit ? 'SAVE' : 'ADD'}
        </Button>
      </Stack>
    </SidebarContainer>
  );
}

export default EditShop;
