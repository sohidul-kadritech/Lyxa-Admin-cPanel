import { ArrowDownward } from '@mui/icons-material';
import { Box, Button, Divider, Stack, createFilterOptions, debounce } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { BannerDataValidation, clickableLinkOption, clickableOption, generateData, shopTypeOptions } from './helpers';

const initialData = {
  title: '',
  type: '',
  shopId: '',
  isClickable: '',
  clickableUrl: '',
  clickType: '',
  productId: '',
  shopIdForClickGo: '',
};
function AddBanner({ onClose, type, addQuery, isReadOnly, rowData = undefined, isEdit }) {
  console.log('rowData', rowData);

  const [shopType, setShopType] = useState('');
  const [searchKeyShop, setSearchKeyShop] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [searchKeyProduct, setSearchKeyProduct] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [newBanner, setNewBanner] = useState(rowData || { ...initialData, type });
  const [searchedShopOptions, setSearchedShopOptions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [searchedProductOptions, setSearchedProductOptions] = useState([]);

  const onChangeHandler = (e) => {
    setNewBanner((prev) => {
      console.log('=======> banner', { ...prev, [e.target.name]: e.target.value });
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  // eslint-disable-next-line no-unused-vars
  const onDrop = (acceptedFiles, feild) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        // eslint-disable-next-line prettier/prettier
      }),
    );
    console.log(newFiles);
    if (newFiles?.length) {
      setNewBanner((prev) => ({ ...prev, [feild]: newFiles }));
    }
  };

  //   filter for shop
  const filterOptions = createFilterOptions({
    stringify: ({ shopName, autoGenId, _id }) => {
      console.log(`===>: ${shopName} ${autoGenId} ${_id}`);
      return `${shopName} ${autoGenId} ${_id}`;
    },
  });

  //   filter for product
  const filterOptions2 = createFilterOptions({
    stringify: ({ name, autoGenId, _id }) => {
      console.log(`===>: ${name} ${autoGenId} ${_id}`);
      return `${name} ${autoGenId} ${_id}`;
    },
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
        setSearchedShopOptions((prev) => {
          console.log('shopData', data?.data?.shops?.length > 0 ? data?.data?.shops : prev);
          return data?.data?.shops?.length > 0 ? data?.data?.shops : prev;
        });
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  const getShops = useMemo(
    () =>
      debounce((value) => {
        console.log('value: ', value);
        setSearchKeyShop(value);
        shopsQuery.mutate();
      }, 300),
    // eslint-disable-next-line prettier/prettier
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
        setSearchedProductOptions((prev) => {
          console.log('shopData', data?.data?.products?.length > 0 ? data?.data?.products : prev);
          return data?.data?.products?.length > 0 ? data?.data?.products : prev;
        });
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  const getProduct = useMemo(
    () =>
      debounce((value) => {
        console.log('value: ', value);
        setSearchKeyProduct(value);
        productQuery.mutate();
      }, 300),
    // eslint-disable-next-line prettier/prettier
    [],
  );

  const uploadHanlder = async () => {
    const isVerified = BannerDataValidation(newBanner, type);
    if (isVerified) {
      const readyData = await generateData(newBanner, type);
      if (readyData && !isEdit) {
        addQuery.mutate(readyData);
      } else {
        addQuery.mutate({ ...readyData, id: newBanner?._id });
      }
    }
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
              items: clickableLinkOption,
              value: newBanner?.clickType || '',
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
                setNewBanner((prev) => ({ ...prev, shopIdForClickGo: v }));
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
          disabled={addQuery?.isLoading || isReadOnly}
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
