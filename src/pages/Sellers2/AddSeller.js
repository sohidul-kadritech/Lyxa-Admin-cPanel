import { Box, Button, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledInput from '../../components/Styled/StyledInput';
import { useGlobalContext } from '../../context';
import { statusTypeOptions } from '../Faq2/helpers';
import { createSellerData, getEditSellerData, sellerTypeOption, validateSellersData } from './helpers';

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

// eslint-disable-next-line no-unused-vars
function AddSeller({ onClose, isEdit = false, team = {}, sellerData = {}, addSellerQuery, loading, setLoading }) {
  console.log('sellerData: ', sellerData);
  const [newSellerData, setNewSellerData] = useState(getEditSellerData(sellerData, isEdit));

  const [selectedAddress, setSelectedAddress] = useState(sellerData?.addressSeller?.address);
  const [render, setRender] = useState(false);
  const { currentUser } = useGlobalContext();
  const { adminType } = currentUser;

  const changeHandler = (e) => {
    if (e.target.name === 'pin') {
      setNewSellerData((prev) => ({
        ...prev,
        sellerAddress: { ...newSellerData?.sellerAddress, [e.target.name]: e.target.value },
      }));
    } else {
      setNewSellerData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

    setNewSellerData((prev) => ({
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

    setNewSellerData((prev) => ({
      ...prev,
      sellerAddress: { ...newAddress, pin: newSellerData?.sellerAddress?.pin ? newSellerData?.sellerAddress?.pin : '' },
    }));

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
    const isValid = validateSellersData(newSellerData, adminType, isEdit);
    console.log(isValid);
    if (isValid) {
      const generatedData = await createSellerData(newSellerData, isEdit);

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
    <SidebarContainer title={`${isEdit ? 'Edit Seller' : 'Add New Seller'}`} onClose={onClose}>
      <StyledFormField
        label="Seller Name *"
        intputType="text"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          value: newSellerData?.name,
          placeholder: 'Seller name',
          type: 'text',
          name: 'name',
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
          value: newSellerData?.email,
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
          value: newSellerData?.password,
          placeholder: 'password',
          type: 'password',
          name: 'password',
          onChange: changeHandler,
          //   readOnly: isReadOnly,
        }}
      />

      <StyledFormField
        label="Phone Number *"
        intputType="phoneNumber"
        inputProps={{
          value: newSellerData?.phone_number,
          type: 'text',
          name: 'phone_number',
          onChange: (value) => {
            setNewSellerData((prev) => ({ ...prev, phone_number: value }));
          },
        }}
      />

      <StyledFormField
        label="Company Name *"
        intputType="text"
        containerProps={{
          sx: { padding: '14px 0' },
        }}
        inputProps={{
          value: newSellerData?.company_name,
          placeholder: 'Company name',
          type: 'text',
          name: 'company_name',
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
          value: newSellerData?.sellerAddress?.pin,
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
          value: newSellerData?.sellerType || '',
          items: sellerTypeOption,
          onChange: changeHandler,
          //   readOnly: isReadOnly,
        }}
      />
      {adminType === 'admin' && (
        <StyledFormField
          label="Status *"
          intputType="select"
          containerProps={{
            sx: { padding: '14px 0' },
          }}
          inputProps={{
            name: 'sellerStatus',
            placeholder: 'Status',
            value: newSellerData?.sellerStatus || '',
            items: statusTypeOptions,
            onChange: changeHandler,
            //   readOnly: isReadOnly,
          }}
        />
      )}

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
          files: newSellerData?.profile_photo,
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
          files: newSellerData?.certificate_of_incorporation,
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
          files: newSellerData?.national_id,
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
          files: newSellerData?.sellerContractPaper,
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

export default AddSeller;
