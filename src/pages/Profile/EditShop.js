import { ArrowDownward, ArrowForward } from '@mui/icons-material';
import { Box, Button, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import TabPanel from '../../components/Common/TabPanel';
import StyledFormField from '../../components/Form/StyledFormField';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { createShopData, validateEditedData } from './helper';

function EditShop({ onClose, shopData, loading }) {
  // Style
  // const [newLoading, setNewLoading] = useState(loading);
  console.log('shopData; ', shopData);
  const fieldContainerSx = {
    padding: '14px 0',
  };

  const tabSx = {
    padding: '8px 12px',
    textTransform: 'none',
  };

  const statusOptions = [
    {
      label: 'Active',
      value: 'active',
    },
    {
      label: 'Inactive',
      value: 'inactive',
    },
    {
      label: 'Blocked',
      value: 'blocked',
    },
  ];

  //   const getShopData = useQueries(()=>)
  const queryClient = useQueryClient();
  const [editedData, setEditedData] = useState(shopData);

  // eslint-disable-next-line no-unused-vars
  const [currentTab, setCurrentTab] = useState(0);

  const editShopData = useMutation((data) => AXIOS.post(API_URL.EDIT_SHOP, data), {
    onSuccess: (data, arg) => {
      console.log(data, 'arg: ', arg, 'api: ', API_URL.EDIT_SHOP);
      if (data?.status) {
        console.log('updated or not: ', data);
        successMsg('Successfully Updated', 'success');
        queryClient.invalidateQueries('get-single-shop-data');
        onClose();
      }
    },
  });

  const editedDataOnChangeHandler = (e) => {
    if (e.target.name !== 'address') {
      setEditedData({ ...editedData, [e.target.name]: e.target.value });
    } else {
      setEditedData({ ...editedData, address: { ...editedData.address, address: e.target.value } });
    }
    console.log('edited data; ', editedData);
  };

  //   useEffect(() => {}, []);

  const onDrop = (acceptedFiles) => {
    console.log('acceptedFiles: ', acceptedFiles);
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        // eslint-disable-next-line prettier/prettier
			})
    );
    console.log(newFiles);
    setEditedData((prev) => ({
      ...prev,
      shopLogo: newFiles?.length > 0 ? newFiles : prev.images,
    }));
  };

  const onDrop2 = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        // eslint-disable-next-line prettier/prettier
			})
    );
    console.log(newFiles);
    setEditedData((prev) => ({
      ...prev,
      shopBanner: newFiles?.length > 0 ? newFiles : prev?.images,
    }));
  };

  const onSubmitShopUpdatedData = async () => {
    console.log('edted data: ', editedData);
    const isValid = validateEditedData(editedData);

    if (isValid?.status === false) {
      successMsg(isValid.msg);
      return;
    }

    const shopData = await createShopData(editedData);
    console.log('ShopData return', shopData);
    if (shopData?.status === false) {
      successMsg(shopData?.msg);
      return;
    }
    // setNewLoading(true);
    editShopData.mutate({ ...shopData });
  };
  return (
    <SidebarContainer title="Edit Shop" onClose={onClose}>
      <Box
        sx={{
          position: 'sticky',
          top: '75px',
          background: '#fff',
          zIndex: '999',
        }}
      >
        <Tabs
          value={currentTab}
          sx={{
            paddingBottom: 5,
          }}
        >
          <Tab
            label="Details"
            sx={tabSx}
            onClick={() => {
              document?.getElementById('add-product-details')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }}
          />
          <Tab
            label="Bangking"
            sx={tabSx}
            onClick={() => {
              document?.getElementById('add-product-features')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </Tabs>
      </Box>
      {!loading && (
        <>
          <Box>
            <TabPanel
              index={0}
              value={currentTab}
              sx={{
                padding: 0,
              }}
            >
              {/* shop name */}
              <StyledFormField
                label="Shop Name"
                intputType="text"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  defaultValue: editedData?.shopName,
                  type: 'text',
                  name: 'shopName',
                  onBlur: editedDataOnChangeHandler,
                }}
              />
              {/* email */}
              <StyledFormField
                label="E-mail"
                intputType="text"
                containerProps={{
                  sx: {
                    padding: '14px 0px 10px 0',
                  },
                }}
                inputProps={{
                  defaultValue: editedData?.email,
                  type: 'email',
                  name: 'email',
                  onBlur: editedDataOnChangeHandler,
                  autoComplete: 'off',
                }}
              />
              {/* password */}
              <StyledFormField
                label="Password"
                intputType="text"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  defaultValue: '',
                  type: 'password',
                  name: 'password',
                  onBlur: editedDataOnChangeHandler,
                }}
              />
              {/* password */}
              <StyledFormField
                label="Phone Number"
                intputType="text"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  defaultValue: editedData?.phone_number,
                  type: 'text',
                  name: 'phone_number',
                  onBlur: editedDataOnChangeHandler,
                }}
              />
              {/* address */}
              <StyledFormField
                label="Address"
                intputType="text"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  defaultValue: editedData?.address?.address,
                  type: 'text',
                  name: 'address',
                  onBlur: editedDataOnChangeHandler,
                }}
              />
              {/* zip code */}
              <StyledFormField
                label="Zip Code"
                intputType="text"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  defaultValue: editedData?.zip_code,
                  type: 'text',
                  name: 'zip_code',
                  onBlur: editedDataOnChangeHandler,
                }}
              />

              <StyledFormField
                label="Shop Logo"
                intputType="file"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  onDrop,
                  name: 'shopLogo',
                  accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
                  maxSize: 1000 * 1000,
                  text: 'Drag and drop or chose photo',
                  files: editedData?.shopLogo,
                  //   files: editedData.shopLogo,
                  helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
                  helperText2: 'Pixels: Minimum 320 for width and height',
                  //   onchange: editedDataOnChangeHandler,
                  // readOnly: productReadonly,
                }}
              />
              <StyledFormField
                label="Shop Banner"
                intputType="file"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  onDrop: onDrop2,
                  accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
                  maxSize: 1000 * 1000,
                  text: 'Drag and drop or chose photo',
                  files: editedData?.shopBanner,
                  helperText1: 'Allowed Type: PNG, JPG, or WEBP up to 1MB',
                  helperText2: 'Pixels: Minimum 320 for width and height',
                  // readOnly: productReadonly,
                }}
              />
              <StyledFormField
                label="Status"
                intputType="select"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  name: 'shopStatus',
                  value: editedData?.shopStatus,
                  items: statusOptions,
                  //   items: categories,
                  onChange: editedDataOnChangeHandler,
                  //   readOnly: Boolean(newProductCategory) || productReadonly,
                }}
              />
            </TabPanel>

            <TabPanel
              index={1}
              value={currentTab}
              sx={{
                padding: 0,
              }}
            >
              {/* bank name */}
              <StyledFormField
                label="Bank Name"
                intputType="text"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  defaultValue: editedData?.bank_name,
                  type: 'text',
                  name: 'bank_name',
                  onBlur: editedDataOnChangeHandler,
                }}
              />
              {/* Account Holder’s Full Name/Name of Enterprise  */}
              <StyledFormField
                label="Account Holder’s Full Name/Name of Enterprise "
                intputType="text"
                containerProps={{
                  sx: {
                    padding: '14px 0px 10px 0',
                  },
                }}
                inputProps={{
                  defaultValue: editedData?.account_name,
                  type: 'text',
                  name: 'account_name',
                  onBlur: editedDataOnChangeHandler,
                  autoComplete: 'off',
                }}
              />

              {/* password */}
              <StyledFormField
                label="Address"
                intputType="text"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  defaultValue: editedData?.bank_address,
                  type: 'text',
                  name: 'bank_address',
                  onBlur: editedDataOnChangeHandler,
                }}
              />
              {/* postal code */}
              <StyledFormField
                label="Postal Code"
                intputType="text"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  defaultValue: editedData?.bank_postal_code,
                  type: 'text',
                  name: 'bank_postal_code',
                  onBlur: editedDataOnChangeHandler,
                }}
              />
              {/* IBAN */}
              <StyledFormField
                label="Account Nr / IBAN"
                intputType="text"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  defaultValue: editedData?.account_number,
                  type: 'text',
                  name: 'account_number',
                  onBlur: editedDataOnChangeHandler,
                }}
              />
              {/* zip code */}
              <StyledFormField
                label="SWIFT"
                intputType="text"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  defaultValue: editedData?.account_swift,
                  type: 'text',
                  name: 'account_swift',
                  onBlur: editedDataOnChangeHandler,
                }}
              />
            </TabPanel>
          </Box>

          <Box>
            {currentTab === 0 ? (
              <Button
                variant="contained"
                color="primary"
                // disabled={loading}
                onClick={() => setCurrentTab(1)}
                startIcon={<ArrowForward />}
                fullWidth
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                disabled={editShopData?.isLoading}
                onClick={onSubmitShopUpdatedData}
                startIcon={<ArrowDownward />}
                fullWidth
              >
                Save Changes
              </Button>
            )}
          </Box>
        </>
      )}
    </SidebarContainer>
  );
}

export default EditShop;
