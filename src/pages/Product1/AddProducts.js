import { Add, ArrowForward } from '@mui/icons-material';
import { Button, Stack, Tab, Tabs, Typography, debounce } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledCheckbox from '../../components/Styled/StyledCheckbox';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { shopTypeOption } from './helpers';

function AddProducts({ isEdit, onClose }) {
  const [searchKeyShop, setSearchKeyShop] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [searchedShopOptions, setSearchedShopOptions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedShopOption, setSelectedShopOptions] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [currentProdcut, setCurrentProduct] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [currentTab, setCurrentTab] = useState(0);
  const shopsQuery = useMutation(
    () =>
      AXIOS.get(API_URL.ALL_SHOP, {
        params: {
          type: 'all',
          shopStatus: 'all',
          page: 1,
          pageSize: 15,
          searchKey: searchKeyShop,
        },
      }),
    {
      onSuccess: (data) => {
        setSearchedShopOptions((prev) => data?.data?.shops || prev);
      },
      // eslint-disable-next-line prettier/prettier
    }
  );

  const getShops = useMemo(
    () =>
      debounce((value) => {
        setSearchKeyShop(value);
        shopsQuery.mutate();
      }, 300),
    // eslint-disable-next-line prettier/prettier
    []
  );

  const changeHandler = (event) => {
    setCurrentProduct((prev) => {
      console.log('notification update: ', { ...prev, [event.target.name]: event.target.value });
      return { ...prev, [event.target.name]: event.target.value };
    });
  };
  return (
    <SidebarContainer title={`${isEdit ? 'Edit Product' : 'Add New Product'}`} onClose={onClose}>
      {currentProdcut.type === 'food' && (
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(
              () =>
                // setType(shopType[newValue]);
                // eslint-disable-next-line prettier/prettier
                newValue
            );
            // setIsSideBarOpen(false);
          }}
        >
          <Tab label="Product"></Tab>
          <Tab label="Others"></Tab>
        </Tabs>
      )}
      {currentTab === 0 ? (
        <>
          <StyledFormField
            label="Name *"
            intputType="text"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              //   value: ,
              placeholder: 'Product name',
              type: 'text',
              name: 'name',
              onChange: changeHandler,
              //   readOnly: isReadOnly,
            }}
          />
          <StyledFormField
            label="Type *"
            intputType="select"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              name: 'type',
              placeholder: 'Shop type',
              value: '',
              items: shopTypeOption,
              onChange: changeHandler,
              //   readOnly: isReadOnly,
            }}
          />

          <StyledFormField
            label="Select Unit *"
            intputType="select"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              name: 'type',
              placeholder: 'Shop type',
              value: '',
              items: shopTypeOption,
              onChange: changeHandler,
              //   readOnly: isReadOnly,
            }}
          />

          <StyledFormField
            label="Quantity *"
            intputType="text"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              //   value: ,
              placeholder: 'Product Quentity',
              type: 'number',
              name: 'question',
              onChange: changeHandler,
              //   readOnly: isReadOnly,
            }}
          />

          <StyledFormField
            label="Select Shop"
            intputType="autocomplete"
            inputProps={{
              multiple: false,
              maxHeight: '110px',
              options: searchedShopOptions,
              value: selectedShopOption,
              placeholder: 'Choose',
              noOptionsText: shopsQuery?.isLoading ? 'Loading...' : 'No shops',
              getOptionLabel: (option) => option?.shopName,
              isOptionEqualToValue: (option, value) => option?._id === value?._id,
              onChange: (e, v) => {
                console.log('value: ', v);
                setSelectedShopOptions(v);
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
          <StyledFormField
            label="Product Image *"
            intputType="file"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              //   onDrop,
              name: 'shopLogo',
              maxSize: 1000 * 1000,
              text: 'Drag and drop or chose photo',
              //   files: editedData?.shopLogo,
              //   files: editedData.shopLogo,
              helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
              helperText2: 'Pixels: Minimum 320 for width and height',
              //   onchange: editedDataOnChangeHandler,
              // readOnly: productReadonly,
            }}
          />

          <StyledFormField
            label="Description *"
            intputType="text"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              //   value: ,
              placeholder: 'Description here..',
              type: 'textarea',
              multiline: true,
              name: 'question',
              //   onChange: changeHandler,
              //   readOnly: isReadOnly,
            }}
          />
          <StyledFormField
            label="Price *"
            intputType="text"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              //   value: ,
              placeholder: 'Product Quentity',
              type: 'price',
              name: 'question',
              onChange: changeHandler,
              //   readOnly: isReadOnly,
            }}
          />
        </>
      ) : (
        <>
          <Stack flexDirection="row" gap="6px" alignItems="center">
            <StyledCheckbox />{' '}
            <Typography
              variant="h5"
              sx={{
                fontWeight: '600',
                fontSize: '15px',
                lineHeight: '18px',
              }}
            >
              Attributes
            </Typography>
          </Stack>

          <StyledFormField
            label="Attribute Name *"
            intputType="text"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              //   value: ,
              placeholder: 'Attribute name',
              type: 'text',
              name: 'name',
              onChange: changeHandler,
              //   readOnly: isReadOnly,
            }}
          />

          <Stack>
            <Stack flexDirection="row" gap="6px" alignItems="center">
              <StyledCheckbox />{' '}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: '600',
                  fontSize: '15px',
                  lineHeight: '18px',
                }}
              >
                Required
              </Typography>
            </Stack>
            <Stack flexDirection="row" gap="6px" alignItems="center">
              <StyledCheckbox />{' '}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: '600',
                  fontSize: '15px',
                  lineHeight: '18px',
                }}
              >
                Multiple
              </Typography>
            </Stack>
          </Stack>

          <StyledFormField
            label="Name *"
            intputType="text"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              //   value: ,
              placeholder: 'name',
              type: 'text',
              name: 'name',
              onChange: changeHandler,
              //   readOnly: isReadOnly,
            }}
          />
          <StyledFormField
            label="Price *"
            intputType="text"
            containerProps={{
              sx: { padding: '14px 0' },
            }}
            inputProps={{
              //   value: ,
              placeholder: 'Price',
              type: 'number',
              name: 'name',
              onChange: changeHandler,
              //   readOnly: isReadOnly,
            }}
          />
          <Button
            disableElevation
            variant="contained"
            startIcon={<Add />}
            //   disabled={sendNotificationQuery.isLoading}
            onClick={() => {
              // sendNotificationHandler();
            }}
          >
            Add
          </Button>

          <Stack flexDirection="row" gap="6px" alignItems="center">
            <StyledCheckbox />{' '}
            <Typography
              variant="h5"
              sx={{
                fontWeight: '600',
                fontSize: '15px',
                lineHeight: '18px',
              }}
            >
              Addons
            </Typography>
          </Stack>
          <StyledFormField
            label="Select Shop"
            intputType="autocomplete"
            inputProps={{
              multiple: false,
              maxHeight: '110px',
              options: searchedShopOptions,
              value: selectedShopOption,
              placeholder: 'Choose',
              noOptionsText: shopsQuery?.isLoading ? 'Loading...' : 'No shops',
              getOptionLabel: (option) => option?.shopName,
              isOptionEqualToValue: (option, value) => option?._id === value?._id,
              onChange: (e, v) => {
                console.log('value: ', v);
                setSelectedShopOptions(v);
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
        </>
      )}

      <Stack sx={{ padding: '30px 0px' }}>
        <Button
          disableElevation
          variant="contained"
          startIcon={<ArrowForward />}
          //   disabled={sendNotificationQuery.isLoading}
          onClick={() => {
            // sendNotificationHandler();
          }}
          fullWidth
        >
          Next
        </Button>
      </Stack>
    </SidebarContainer>
  );
}

// export default AddProducts;
