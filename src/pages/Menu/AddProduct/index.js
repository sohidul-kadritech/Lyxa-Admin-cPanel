/* eslint-disable no-unused-vars */
import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import { ReactComponent as DropIcon } from '../../../assets/icons/down.svg';
import { shopTypeOptions2 } from '../../../assets/staticData';
import SidebarContainer from '../../../components/Common/SidebarContainerSm';
import StyledFormField from '../../../components/Form/StyledFormField';
import AttributeList from './AttributeList';
import { attributeInit, attributeOptions, attributeTypeAvailableOptions, dietryOptions, productInit } from './helpers';

const fieldContainerSx = {
  padding: '14px 0',
};

export default function AddProduct({ onClose }) {
  const [render, setRender] = useState(false);
  const [product, setProduct] = useState(productInit);
  const [hasAttribute, setHasAttribute] = useState('');
  const [newAttribute, setNewAttribute] = useState(attributeInit);

  // input handler
  const commonChangeHandler = (e) => {
    setProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // file handler
  const onDrop = (acceptedFiles, rejectedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setProduct((prev) => ({
      ...prev,
      photo: newFiles?.length > 0 ? newFiles : prev.photo,
    }));
  };

  return (
    <SidebarContainer title="Add Items" onClose={onClose}>
      {/* name */}
      <StyledFormField
        label="Name"
        intputType="text"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          type: 'text',
          name: 'name',
          value: product.name,
          onChange: commonChangeHandler,
        }}
      />
      {/* type */}
      <StyledFormField
        label="Type"
        intputType="select"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          name: 'type',
          value: product.type,
          items: shopTypeOptions2,
          onChange: commonChangeHandler,
        }}
      />
      {/* type */}
      <StyledFormField
        label="Category"
        intputType="select"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          name: 'category',
          value: product.category,
          items: shopTypeOptions2,
          onChange: commonChangeHandler,
        }}
      />
      {/* description */}
      <StyledFormField
        label="Description"
        intputType="textarea"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          name: 'description',
          value: product.description,
          onChange: commonChangeHandler,
          multiline: true,
        }}
      />
      {/* photo */}
      <StyledFormField
        label="Photo"
        intputType="file"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          onDrop,
          accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
          maxSize: 1000 * 1000,
          text: 'Drag and drop or chose photo',
          files: product.photo,
          helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
          helperText2: 'Pixels: Minimum 320 for width and height',
        }}
      />
      {/* price */}
      <StyledFormField
        label="Price"
        intputType="text"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          type: 'number',
          name: 'price',
          value: product.price,
          onChange: commonChangeHandler,
        }}
      />
      {/* attributes */}
      <StyledFormField
        label="Attributes"
        intputType="optionsSelect"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          value: hasAttribute,
          items: attributeOptions,
          onChange: (value) => {
            setHasAttribute(value);
          },
        }}
      />
      {hasAttribute === 'yes' && (
        // Attribute Title
        <Box>
          <StyledFormField
            label="Attribute Title"
            intputType="text"
            containerProps={{
              sx: fieldContainerSx,
            }}
            inputProps={{
              type: 'text',
              name: 'attributeTitle',
              value: product?.attributeTitle,
              onChange: commonChangeHandler,
            }}
          />
          {/* type options */}
          <StyledFormField
            intputType="checkbox"
            containerProps={{
              sx: {
                paddingBottom: '20px',
              },
            }}
            inputProps={{
              items: attributeTypeAvailableOptions,
              value: product?.attributeTypeOptions,
              onChange: (option) => {
                if (product?.attributeTypeOptions?.find((item) => item === option?.value)) {
                  product.attributeTypeOptions =
                    product?.attributeTypeOptions?.filter((item) => item !== option?.value) || [];
                  setRender((prev) => !prev);
                } else {
                  product?.attributeTypeOptions?.push(option?.value);
                  setRender((prev) => !prev);
                }
              },
            }}
          />
          {/* attribute list */}
          <AttributeList items={product?.attributes} onDelete={() => {}} />
        </Box>
      )}
      <StyledFormField
        label="Add-ons"
        intputType="autocomplete"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          multiple: true,
          getOptionLabel: (option) => option?.name || 'Choose',
          label: 'Choose',
          sx: {
            '& .MuiFormControl-root': {
              minWidth: '100px',
            },
          },
          maxHeight: '200px',
          options: [],
          value: product?.adddons,
          isOptionEqualToValue: (option, value) => option?._id === value?._id,
          onChange: (e, v) => {},
        }}
      />
      {/* dietry options */}
      <StyledFormField
        label="Dietary"
        intputType="optionsSelect"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          value: product?.dietry,
          multiple: true,
          items: dietryOptions,
          onChange: (value) => {
            setHasAttribute(value);
          },
        }}
      />
      {/* description */}
      <StyledFormField
        label={
          <span>
            Notes
            <span
              style={{
                color: '#7E8299',
              }}
            >
              {' '}
              (only visible to you)
            </span>
          </span>
        }
        intputType="textarea"
        containerProps={{
          sx: fieldContainerSx,
        }}
        inputProps={{
          name: 'description',
          value: product.description,
          onChange: commonChangeHandler,
          multiline: true,
        }}
      />
      <Box pt={6} pb={6}>
        <Button variant="contained" color="primary" startIcon={<DropIcon />} fullWidth>
          Save Item
        </Button>
      </Box>
    </SidebarContainer>
  );
}
