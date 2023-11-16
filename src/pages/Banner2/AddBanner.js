/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { ArrowDownward } from '@mui/icons-material';
import { Box, Button, Divider, Stack, createFilterOptions, debounce } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { previewGenerator } from '../Sellers2/helpers';
import {
  BannerDataValidation,
  clickableLinkOption,
  clickableOption,
  generateData,
  getValidClickType,
  shopTypeOptions,
  viewUserTypeOption,
} from './helpers';

const initialData = {
  title: '',
  type: '',
  shopId: '',
  isClickable: '',
  clickableUrl: '',
  clickType: '',
  productId: '',
  visibleUserType: '', // "all" //'all', 'plus', 'normal'
};

const getInitialData = (rowData, isEdit, isReadOnly, type = 'home') => {
  if (isEdit || isReadOnly)
    return {
      ...rowData,
      type,
      clickType: rowData?.clickType ? rowData?.clickType : 'link',
      isClickable: rowData?.isClickable ? 'yes' : 'no',
      image: previewGenerator(rowData?.image),
    };

  return { ...initialData, type };
};

function AddBanner({ onClose, type = 'home', addQuery, isReadOnly, rowData = undefined, isEdit }) {
  const [shopType, setShopType] = useState('');

  const [searchKeyShop, setSearchKeyShop] = useState('');

  const [searchKeyProduct, setSearchKeyProduct] = useState('');

  const [newBanner, setNewBanner] = useState(getInitialData(rowData, isEdit, isReadOnly, type));

  const [searchedShopOptions, setSearchedShopOptions] = useState([]);

  const [searchedProductOptions, setSearchedProductOptions] = useState([]);

  const [loading, setLoading] = useState(false);

  const clickTypeOptions = clickableLinkOption?.filter((option) =>
    newBanner?.visibleUserType === 'normal' ? true : option?.value !== 'plus',
  );

  const onChangeHandler = (e) => {
    // visibleUserType
    setNewBanner((prev) => {
      const oldValue = { ...prev };

      if (e.target.name === 'visibleUserType') {
        oldValue.clickType = undefined;
      }
      return { ...oldValue, [e.target.name]: e.target.value };
    });
  };

  const onDrop = (acceptedFiles, feild) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );

    if (newFiles?.length) {
      setNewBanner((prev) => ({ ...prev, [feild]: newFiles }));
    }
  };

  //   filter for shop
  const filterOptions = createFilterOptions({
    stringify: ({ shopName, autoGenId, _id }) => `${shopName} ${autoGenId} ${_id}`,
  });

  //   filter for product
  const filterOptions2 = createFilterOptions({
    stringify: ({ name, autoGenId, _id }) => `${name} ${autoGenId} ${_id}`,
  });

  const shopsQuery = useMutation(
    () =>
      AXIOS.get(API_URL.ALL_SHOP, {
        params: {
          type: shopType,
          shopStatus: 'all',
          page: 1,
          pageSize: 15,
          searchKey: searchKeyShop,
        },
      }),
    {
      onSuccess: (data) => {
        setSearchedShopOptions((prev) => (data?.data?.shops?.length > 0 ? data?.data?.shops : prev));
      },
    },
  );

  const getShops = useMemo(
    () =>
      debounce((value) => {
        setSearchKeyShop(value);
        shopsQuery.mutate();
      }, 300),
    [],
  );

  const productQuery = useMutation(
    () =>
      AXIOS.get(API_URL.ALL_PRODUCT, {
        params: {
          // type: ,
          page: 1,
          pageSize: 15,
          searchKey: searchKeyProduct,
        },
      }),
    {
      onSuccess: (data) => {
        setSearchedProductOptions((prev) => (data?.data?.products?.length > 0 ? data?.data?.products : prev));
      },
    },
  );

  const getProduct = useMemo(
    () =>
      debounce((value) => {
        setSearchKeyProduct(value);
        productQuery.mutate();
      }, 300),

    [],
  );

  const uploadHanlder = async () => {
    setLoading(true);
    const isVerified = BannerDataValidation(newBanner, type || 'home');
    if (isVerified) {
      const readyData = await generateData(newBanner, type || 'home');
      if (readyData && !isEdit) {
        addQuery.mutate(readyData);
      } else {
        addQuery.mutate({ ...readyData, id: newBanner?._id });
      }
    }
    setLoading(false);
  };

  return (
    <SidebarContainer title={isEdit ? 'Edit Banner' : isReadOnly ? 'View Banner' : 'Add Banner'} onClose={onClose}>
      <Box sx={{ marginTop: '20px', paddingBottom: '20px' }}>
        <StyledFormField
          label="Name (Visible to you) *"
          intputType="text"
          inputProps={{
            type: 'text',
            name: 'title',
            readOnly: isReadOnly,
            value: newBanner?.title,
            onChange: onChangeHandler,
          }}
        />
      </Box>
      <Divider variant="middle" sx={{ background: '#000000' }} />
      <Box sx={{ marginTop: '20px', paddingBottom: '20px' }}>
        <StyledFormField
          label="Photo *"
          intputType="file"
          inputProps={{
            onDrop: (e) => {
              onDrop(e, 'image');
            },
            readOnly: isReadOnly,
            files: newBanner?.image,
          }}
        />
      </Box>
      <Divider variant="middle" sx={{ background: '#000000' }} />
      <Divider variant="middle" sx={{ background: '#000000' }} />
      {/*  view user type */}

      <Box position="relative">
        <Box sx={{ marginTop: '20px' }}>
          <StyledFormField
            label="Select User Type *"
            intputType="select"
            inputProps={{
              sx: { maxWidth: '110px !important' },
              name: 'visibleUserType',
              readOnly: isReadOnly,
              placeholder: 'Select User Type',
              items: viewUserTypeOption,
              value: newBanner?.visibleUserType,
              onChange: onChangeHandler,
            }}
          />
        </Box>
      </Box>
      <Divider variant="middle" sx={{ background: '#000000' }} />
      {type === 'home' && (
        <Box sx={{ marginTop: '20px', paddingBottom: '20px' }}>
          <StyledFormField
            label="Is Clickable *"
            intputType="select"
            inputProps={{
              name: 'isClickable',
              readOnly: isReadOnly,
              items: clickableOption,
              sx: { maxWidth: '110px !important' },
              placeholder: 'Clickable',
              value: newBanner?.isClickable,
              onChange: onChangeHandler,
            }}
          />
        </Box>
      )}
      <Divider variant="middle" sx={{ background: '#000000' }} />
      {type === 'home' && newBanner?.isClickable === 'yes' && (
        <Box sx={{ marginTop: '20px' }}>
          <StyledFormField
            label="Click Option *"
            intputType="select"
            inputProps={{
              sx: { maxWidth: '110px !important' },
              name: 'clickType',
              readOnly: isReadOnly,
              placeholder: 'Click Options',
              items: clickTypeOptions,
              value: getValidClickType(newBanner?.clickType, clickTypeOptions),
              onChange: onChangeHandler,
            }}
          />
        </Box>
      )}
      {/* For URL */}
      {newBanner?.clickType === 'link' && newBanner?.isClickable === 'yes' && (
        <Box sx={{ marginTop: '20px', paddingBottom: '20px' }}>
          <StyledFormField
            label="URL *"
            intputType="text"
            inputProps={{
              type: 'text',
              readOnly: isReadOnly,
              value: newBanner?.clickableUrl,
              name: 'clickableUrl',
              onChange: onChangeHandler,
            }}
          />
        </Box>
      )}

      {/* For Shop */}

      {newBanner?.clickType === 'shop' && newBanner?.isClickable === 'yes' && !isEdit && !isReadOnly && (
        <Box position="relative">
          <Box sx={{ marginTop: '20px' }}>
            <StyledFormField
              label="Select shop type *"
              intputType="select"
              inputProps={{
                sx: { maxWidth: '110px !important' },
                name: 'shopType',
                readOnly: isReadOnly,
                placeholder: 'Click Options',
                items: shopTypeOptions,
                value: shopType,
                onChange: (e) => setShopType(e.target.value),
              }}
            />
          </Box>
        </Box>
      )}

      {newBanner?.clickType === 'shop' && newBanner?.isClickable === 'yes' && (
        <Box position="relative">
          <StyledFormField
            label="Select Shop *"
            intputType="autocomplete"
            inputProps={{
              multiple: false,
              maxHeight: '110px',
              readOnly: isReadOnly,
              options: searchedShopOptions,
              value: newBanner?.shopId || '',
              placeholder: 'Choose',
              noOptionsText: shopsQuery?.isLoading ? 'Loading...' : 'No shops',
              filterOptions,
              getOptionLabel: (option) => option?.shopName || '',
              isOptionEqualToValue: (option, value) => option?._id === value?._id,
              onChange: (e, v) => {
                console.log('value: ', v);
                setNewBanner((prev) => ({ ...prev, shopId: v }));
              },
              onInputChange: (e) => {
                getShops(e?.target?.value);
              },
              sx: {
                '& .MuiFormControl-root': {
                  minWidth: '200px',
                },
              },
            }}
          />
        </Box>
      )}

      {/* For Product */}
      {newBanner?.clickType === 'product' && newBanner?.isClickable === 'yes' && (
        <Box position="relative">
          <StyledFormField
            label="Select Product *"
            intputType="autocomplete"
            inputProps={{
              multiple: false,
              readOnly: isReadOnly,
              maxHeight: '110px',
              options: searchedProductOptions,
              value: newBanner?.productId || '',
              placeholder: 'Choose',
              noOptionsText: productQuery?.isLoading ? 'Loading...' : 'No Products',
              filterOptions: filterOptions2,
              getOptionLabel: (option) => option?.name || '',
              isOptionEqualToValue: (option, value) => option?._id === value?._id,
              onChange: (e, v) => {
                console.log('value: ', v);
                setNewBanner((prev) => ({ ...prev, productId: v }));
              },
              onInputChange: (e) => {
                getProduct(e?.target?.value);
              },

              sx: {
                '& .MuiFormControl-root': {
                  minWidth: '200px',
                },
              },
            }}
          />
        </Box>
      )}

      <Stack direction="row" margin="30px 0px" justifyContent="center">
        <Button
          disabled={addQuery?.isLoading || isReadOnly || loading}
          fullWidth
          onClick={uploadHanlder}
          variant="contained"
          startIcon={<ArrowDownward />}
        >
          Upload
        </Button>
      </Stack>
    </SidebarContainer>
  );
}

export default AddBanner;
