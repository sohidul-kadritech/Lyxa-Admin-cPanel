import { Box, Drawer, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useLocation, useRouteMatch } from 'react-router-dom';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import StyledTabs2 from '../../components/Styled/StyledTab2';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { AddMenuButton } from '../Faq2';
import { statusTypeOptions } from '../Product1/helpers';
import AddLyxaCharge from './AddLyxaCharge';
import AddSeller from './AddSeller';
import SellerList from './SellerList';
import SellerPageSkeleton from './SellerPageSkeleton';
import SellersProfile from './SellersProfile';
import { tabsOptions } from './helpers';

function SellerList2() {
  // eslint-disable-next-line no-unused-vars
  const routeMatch = useRouteMatch();
  const location = useLocation();

  const [status, setStatus] = useState('all');

  const [searchKey, setSearchKey] = useState('');

  const [open, setOpen] = useState(false);
  const [editDocumentOpen, setEditDocumentOpen] = useState(false);

  const [openLyxaChargeSidebar, setOpenLyxaChargeSidebar] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [isConfirmModal, setIsConfirmModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [currentSeller, setCurrentSeller] = useState({});
  const [zoneId, setZoneId] = useState('all');
  const [zoneItems, setZoneItems] = useState([{ zoneName: 'All', _id: 'all' }]);
  const [currentTab, setCurrentTab] = useState('all');
  const theme = useTheme();

  const queryClient = useQueryClient();
  // eslint-disable-next-line no-unused-vars
  const zonesQuery = useQuery([API_URL.GET_ALL_ZONE], () => AXIOS.get(API_URL.GET_ALL_ZONE), {
    onSuccess: (data) => {
      if (data.status) {
        const zones = data?.data?.zones;
        console.log('zones', zones);
        setZoneItems([...zoneItems, ...zones]);
      }
    },
  });

  console.log('currentSeller:', currentSeller);

  const getAllSellersQuery = useQuery(
    [API_URL.ALL_SELLER, { sellerStatus: status, searchKey, zoneId, sellerType: currentTab }],
    () =>
      AXIOS.get(API_URL.ALL_SELLER, {
        params: {
          sellerStatus: status,
          searchKey,
          sellerType: currentTab,
          zoneId: zoneId === 'all' ? null : zoneId,
        },
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          if (!routeMatch?.params?.sellerId) {
            const updatedCurrentSeller = data?.data?.sellers.find((seller) => currentSeller?._id === seller?._id);
            if (updatedCurrentSeller) {
              setCurrentSeller(Object?.keys(currentSeller)?.length > 0 ? updatedCurrentSeller : data?.data?.sellers[0]);
            } else {
              setCurrentSeller(Object?.keys(currentSeller)?.length > 0 ? currentSeller : data?.data?.sellers[0]);
            }
          }
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  const getSingleSellersQuery = useQuery(
    [API_URL.SINGLE_SELLER, { id: routeMatch?.params?.sellerId }],
    () =>
      AXIOS.get(API_URL.SINGLE_SELLER, {
        params: {
          id: routeMatch?.params?.sellerId,
        },
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          if (routeMatch?.params?.sellerId) {
            setCurrentSeller(Object?.keys(currentSeller)?.length > 0 ? currentSeller : data?.data?.seller);
          }
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  const addSellerQuery = useMutation((data) => AXIOS.post(API_URL.ADD_SELLER, data), {
    onSuccess: (data) => {
      if (data.status) {
        setOpen(false);
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(API_URL.ALL_SELLER);
        setLoading(false);
      } else {
        successMsg(data.message);
        setLoading(false);
      }
    },
  });

  const sellerDropChargeQuery = useMutation((data) => AXIOS.post(API_URL.SELLER_DROP_CHARGE, data), {
    onSuccess: (data) => {
      if (data.status) {
        setOpen(false);
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(API_URL.ALL_SELLER);
        setOpenLyxaChargeSidebar(false);
        // setLoading(false);
      } else {
        successMsg(data.message);
        setLoading(false);
      }
    },
  });

  const editSellerQuery = useMutation((data) => AXIOS.post(API_URL.EDIT_SELLER, data), {
    onSuccess: (data) => {
      if (data.status) {
        setCurrentSeller(data?.data?.seller);
        setOpen(false);
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(API_URL.ALL_SELLER);
        setLoading(false);
        setEditDocumentOpen(false);
        setIsConfirmModal(false);
      } else {
        successMsg(data.message);
        setLoading(false);
      }
    },
  });

  const replaceDocument = (document) => {
    editSellerQuery.mutate({ id: currentSeller?._id, [document?.type]: document.url });
  };
  const removeDocument = (document) => {
    editSellerQuery.mutate({ id: currentSeller?._id, [document?.type]: '' });
  };

  return (
    <Box>
      {/* Sellers Page Top Section */}
      <PageTop
        title="Seller List"
        backButtonLabel={location?.state ? location?.state?.backToLabel : undefined}
        backTo={location?.state ? location?.state?.from : undefined}
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />
      <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
        <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />

        <StyledFormField
          intputType="select"
          tooltip="Select Status"
          containerProps={{
            sx: { padding: '0px 0px' },
          }}
          inputProps={{
            name: 'status',
            placeholder: 'Status',
            value: status,
            items: statusTypeOptions,
            size: 'sm2',
            onChange: (e) => setStatus(e.target.value),
          }}
        />
        <StyledFormField
          intputType="select"
          tooltip="Select Zone"
          containerProps={{
            sx: { padding: '0px 0px' },
          }}
          inputProps={{
            name: 'zoneId',
            size: 'sm2',
            placeholder: 'Select Zone',
            value: zoneId,
            items: zoneItems || [],
            getLabel: (option) => option?.zoneName,
            getValue: (option) => option?._id,
            getDisplayValue: (currentValue) => zoneItems?.find((zone) => zone?._id === currentValue)?.zoneName,
            onChange: (e) => setZoneId(e.target.value),
          }}
        />
        <AddMenuButton
          onClick={() => {
            setOpen(() => {
              setIsEdit(false);
              return true;
            });
          }}
        />
      </Stack>
      <StyledTabs2 value={currentTab} options={tabsOptions} onChange={setCurrentTab} />
      {/* Sellers Main Section */}

      {getAllSellersQuery?.isLoading || getSingleSellersQuery?.isLoading ? (
        <SellerPageSkeleton />
      ) : (
        <Box marginTop="42px">
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: '600 !important',
                color: theme.palette.text.secondary2,
                marginBottom: '26px',
                textTransform: 'uppercase',
              }}
            >
              Sellers
            </Typography>
            <Stack direction="row" flexWrap="wrap-reverse" gap="22px">
              {/* Sellers List --> left */}
              <Box>
                <SellerList
                  loading={getAllSellersQuery.isLoading || getSingleSellersQuery.isLoading}
                  data={getAllSellersQuery?.data?.data?.sellers}
                  currentSeller={currentSeller}
                  setCurrentSeller={setCurrentSeller}
                />
              </Box>
              {/* Seller Profile --> right */}
              <Box flex={1}>
                <SellersProfile
                  refatch={() => {
                    getAllSellersQuery.refetch();
                    console.log('re-fetched');
                  }}
                  editSellerQuery={editSellerQuery}
                  editDocumentOpen={editDocumentOpen}
                  setEditDocumentOpen={setEditDocumentOpen}
                  isConfirmModal={isConfirmModal}
                  setIsConfirmModal={setIsConfirmModal}
                  setAddSidebarOpen={setOpen}
                  setOpenLyxaChargeSidebar={setOpenLyxaChargeSidebar}
                  setIsEdit={setIsEdit}
                  currentSeller={currentSeller}
                  replaceDocument={replaceDocument}
                  removeDocument={removeDocument}
                />
              </Box>
            </Stack>
          </Box>
        </Box>
      )}

      <Drawer open={open} anchor="right">
        <AddSeller
          onClose={() => {
            setOpen(false);
            setLoading(false);
          }}
          loading={loading}
          isEdit={isEdit}
          setLoading={setLoading}
          addSellerQuery={isEdit ? editSellerQuery : addSellerQuery}
          sellerData={
            isEdit
              ? currentSeller
              : {
                  sellerStatus: '',
                  sellerType: '',
                }
          }
        />
      </Drawer>

      <Drawer open={openLyxaChargeSidebar} anchor="right">
        <AddLyxaCharge
          currentSeller={currentSeller}
          onClose={() => {
            setOpenLyxaChargeSidebar(false);
          }}
          sellerDropChargeQuery={sellerDropChargeQuery}
        />
      </Drawer>
    </Box>
  );
}

export default SellerList2;
