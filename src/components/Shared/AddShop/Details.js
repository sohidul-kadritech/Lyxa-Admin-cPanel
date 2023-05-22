import { Box } from '@mui/material';
import React from 'react';
import StyledFormField from '../../Form/StyledFormField';
import { statusOptions } from './helper';

export default function ShopDetails({ shop, onChange, onDrop }) {
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
        intputType="text"
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
        intputType="text"
        inputProps={{
          value: shop?.phone_number,
          type: 'text',
          name: 'phone_number',
          onChange,
        }}
      />

      {/* address */}
      <StyledFormField
        label="Address *"
        intputType="text"
        inputProps={{
          value: shop?.address?.address,
          type: 'text',
          name: 'address',
          onChange,
        }}
      />

      {/* zip code */}
      <StyledFormField
        label="Zip Code *"
        intputType="text"
        inputProps={{
          value: shop?.address?.pin,
          type: 'text',
          name: 'pin',
          onChange,
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
          accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
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
          accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
          maxSize: 1000 * 1000,
          text: 'Drag and drop or chose photo',
          files: shop?.shopBanner,
          helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
          helperText2: 'Pixels: Minimum 320 for width and height',
        }}
      />

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
    </Box>
  );
}
