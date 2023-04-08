/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { shopTypeOptions2 } from '../../assets/staticData';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';

const fieldContainerSx = {
  padding: '22px 0',
};

const productInit = {
  name: '',
  type: '',
  category: '',
  description: '',
  price: '',
  photo: [],
};

export default function AddProduct({ onClose }) {
  const [product, setProduct] = useState(productInit);

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
    </SidebarContainer>
  );
}
