/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { ArrowDownward, ArrowForward } from '@mui/icons-material';
import { Box, Button, Skeleton, Stack, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';
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
  getShopZoneData,
  shopInit,
  updateShopData,
  validateBankDetails,
  validateShopDetails,
  validateShopFeatures,
} from './helper';

function RowSkeleton() {
  return (
    <Stack gap={2.5}>
      <Skeleton width="250px" height="16px" />
      <Skeleton width="80%" height="40px" sx={{ borderRadius: '32px' }} />
    </Stack>
  );
}

function EditShopSkeleton() {
  return (
    <Stack>
      <Stack gap={6}>
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
      </Stack>
    </Stack>
  );
}

const getTabMax = (isEditShop, shopReceivePaymentBy) => {
  if (isEditShop && shopReceivePaymentBy === 'cash') return 0;
  if (isEditShop || shopReceivePaymentBy === 'cash') return 1;
  return 2;
};

export default function AddShop({ onClose, editShop, seller: customSeller, refetch = () => {} }) {
  // console.log('shop', editShop);

  const queryClient = useQueryClient();

  const { currentUser } = useGlobalContext();

  const { seller: currentSeller, adminType } = currentUser;

  const [seller] = useState(customSeller?._id ? customSeller : currentSeller);

  const [shop, setShop] = useState(editShop?._id ? {} : shopInit(seller?._id));
  // const [shop, setShop] = useState(editShop?._id ? getShopEditData(editShop) : shopInit(seller?._id));

  const [loading, setLoading] = useState(false);

  const [render, setRender] = useState(false);

  const [currentTab, setCurrentTab] = useState(0);
  const [zones, setZones] = useState([]);

  const tabMax = getTabMax(editShop?._id, shop?.shopReceivePaymentBy);

  // const shopsQuery = useQuery(
  //   [Api.GET_SINGLE_SHOP, { shopId: editShop?._id, ...editShop }],
  //   () =>
  //     AXIOS.get(Api.GET_SINGLE_SHOP, {
  //       params: {
  //         shopId: editShop?._id,
  //       },
  //     }),
  //   {
  //     enabled: !!editShop?._id,
  //     refetchOnWindowFocus: true,
  //     onSuccess: (data) => {
  //       if (data?.status) {
  //         console.log('address', data?.data?.shop);

  //         if (data?.data?.shop?._id === editShop?._id) setShop(getShopEditData(data?.data?.shop));

  //         setRender(true);
  //       }
  //     },
  //   },
  // );

  const singleShopDataQuery = useMutation(
    () =>
      AXIOS.get(Api.GET_SINGLE_SHOP, {
        params: {
          shopId: editShop?._id,
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          console.log('address', data?.data?.shop);

          if (data?.data?.shop?._id === editShop?._id) setShop(getShopEditData(data?.data?.shop));
          else {
            setShop(shopInit(seller?._id));
          }

          setRender(true);
        }
      },
    },
  );

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
      }),
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
          if (editShop?._id) updateShopData(editShop, data?.data?.shop);
          else queryClient.invalidateQueries([Api.ALL_SHOP]);

          queryClient.invalidateQueries([Api.SHOP_BRANDS]);
          queryClient.invalidateQueries([Api.GET_ALL_SHOP]);

          onClose();
          refetch();
        }
      },

      onError: (error) => {
        console.log(error);
        setLoading(false);
      },
    },
  );

  const tagsQuery = useQuery([Api.GET_ALL_TAGS_AND_CUSINES], () =>
    AXIOS.get(Api.GET_ALL_TAGS_AND_CUSINES, {
      params: {
        page: 1,
        pageSize: 500,
        shopType: seller?.sellerType,
        status: 'active',
      },
    }),
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
      const shopZone = getShopZoneData(shop?.shopZone, zones);
      isValid = validateShopDetails(shop, editShop?._id, adminType, shopZone);
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

  useEffect(() => {
    singleShopDataQuery.mutate();
  }, [editShop]);

  console.log('address loading', { loading: singleShopDataQuery?.isLoading, editShop });

  if (singleShopDataQuery?.isLoading) {
    return (
      <SidebarContainer title={`${editShop?._id ? 'Edit' : 'Add'} Shop`} onClose={onClose}>
        <EditShopSkeleton />
      </SidebarContainer>
    );
  }

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
          {shop?.shopReceivePaymentBy !== 'cash' && <Tab label="Banking" />}
        </Tabs>
      </Box>
      <Box>
        <TabPanel index={0} value={currentTab} noPadding>
          <ShopDetails
            setShop={setShop}
            shop={shop}
            onChange={onChangeHandler}
            onDrop={onDrop}
            isEditShop={editShop?._id}
            zones={zones}
            setZones={setZones}
          />
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
        {shop?.shopReceivePaymentBy !== 'cash' && (
          <TabPanel index={tabMax} value={currentTab} noPadding>
            <ShopBanking shop={shop} onChange={onChangeHandler} />
          </TabPanel>
        )}
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
