/* eslint-disable no-unused-vars */
import { ArrowDownward, ArrowForward } from '@mui/icons-material';
import { Box, Button, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import SidebarContainer from '../../Common/SidebarContainerSm';
import TabPanel from '../../Common/TabPanel';
import ShopBanking from './Banking';
import ShopDetails from './Details';
import ShopFeatures from './Features';
import {
  createAddShopData,
  createEditShopData,
  getShopEditData,
  shopInit,
  updateShopData,
  validateBankDetails,
  validateShopDetails,
  validateShopFeatures,
} from './helper';

export default function AddShop({ onClose, editShop }) {
  const { currentUser } = useGlobalContext();
  const { seller } = currentUser;
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [shop, setShop] = useState(editShop?._id ? getShopEditData(editShop) : shopInit(seller?._id));
  const [currentTab, setCurrentTab] = useState(0);
  const tabMax = editShop?._id ? 1 : 2;

  const onChangeHandler = (e) => {
    if (e.target.name === 'pin') {
      setShop({ ...shop, address: { ...shop.address, pin: e.target.value } });
    } else if (e.target.name === 'address') {
      setShop({ ...shop, address: { ...shop.address, address: e.target.value } });
    } else {
      setShop({ ...shop, [e.target.name]: e.target.value });
    }
  };

  const onDrop = (acceptedFiles, filesFor) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setShop((prev) => ({
      ...prev,
      [filesFor]: newFiles?.length ? newFiles : prev[filesFor],
    }));
  };

  const shopMutation = useMutation(
    (data) => {
      const api = editShop?._id ? Api.EDIT_SHOP : Api.ADD_SHOP;
      return AXIOS.post(api, data);
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        successMsg(data?.message, data?.status ? 'success' : undefined);
        if (data?.status) {
          if (editShop?._id) {
            updateShopData(editShop, data?.data?.shop);
          } else {
            queryClient.invalidateQueries([Api.ALL_SHOP]);
          }
          onClose();
        }
      },

      onError: (error) => {
        console.log(error);
        setLoading(false);
      },
    }
  );

  const tagsQuery = useQuery([Api.GET_ALL_TAGS_AND_CUSINES], () =>
    AXIOS.get(Api.GET_ALL_TAGS_AND_CUSINES, {
      params: {
        page: 1,
        pageSize: 500,
        shopType: seller?.sellerType,
      },
    })
  );

  const onSubmitShop = async () => {
    const createShopData = editShop?._id ? createEditShopData : createAddShopData;

    setLoading(true);
    const shopData = await createShopData(shop);
    if (shopData?.status === false) {
      successMsg(shopData?.msg);
      setLoading(false);
      return;
    }

    shopMutation.mutate(shopData);
  };

  const buttonHandler = () => {
    let isValid = { status: true };

    if (currentTab === 0) {
      isValid = validateShopDetails(shop, editShop?._id);
    }

    if (currentTab === 1 && !editShop?._id) {
      isValid = validateShopFeatures(shop, seller?.sellerType);
    }

    if ((currentTab === 1 && editShop?._id) || (currentTab === 2 && !editShop?._id)) {
      isValid = validateBankDetails(shop);
    }

    if (!isValid.status) {
      successMsg(isValid.msg);
      return;
    }

    if (currentTab === tabMax) {
      onSubmitShop();
      return;
    }

    setCurrentTab((prev) => prev + 1);
  };

  return (
    <SidebarContainer title={`${editShop?._id ? 'Edit' : 'Add'} Shop`} onClose={onClose}>
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

            '& .MuiTab-root': {
              padding: '8px 12px',
              textTransform: 'none',
            },
          }}
        >
          <Tab
            label="Details"
            onClick={() => {
              setCurrentTab(0);
            }}
          />
          {!editShop?._id && (
            <Tab
              label="Features"
              onClick={() => {
                if (currentTab > 1) {
                  setCurrentTab(1);
                }
              }}
            />
          )}
          <Tab label="Banking" />
        </Tabs>
      </Box>
      <Box>
        <TabPanel index={0} value={currentTab} noPadding>
          <ShopDetails shop={shop} onChange={onChangeHandler} onDrop={onDrop} />
        </TabPanel>
        {!editShop?._id && (
          <TabPanel index={1} value={currentTab} noPadding>
            <ShopFeatures
              shop={shop}
              tagsCuisine={tagsQuery?.data?.data?.tags}
              onChange={onChangeHandler}
              sellerType={seller?.sellerType}
              console={console.log(seller)}
            />
          </TabPanel>
        )}
        <TabPanel index={tabMax} value={currentTab} noPadding>
          <ShopBanking shop={shop} onChange={onChangeHandler} />
        </TabPanel>
      </Box>
      <Box sx={{ pt: 7, pb: 5 }}>
        <Button
          variant="contained"
          disabled={loading}
          color="primary"
          onClick={buttonHandler}
          startIcon={currentTab === tabMax ? <ArrowDownward /> : <ArrowForward />}
          fullWidth
        >
          {currentTab === tabMax ? 'Save Changes' : 'Next'}
        </Button>
      </Box>
    </SidebarContainer>
  );
}
