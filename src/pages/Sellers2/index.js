/* eslint-disable prettier/prettier */
import { Box, Drawer, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useLocation, useRouteMatch } from 'react-router-dom';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import StyledTabs2 from '../../components/Styled/StyledTab2';
import { useGlobalContext } from '../../context';
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
  const routeMatch = useRouteMatch();

  const location = useLocation();

  const { currentUser } = useGlobalContext();

  const { admin } = currentUser;

  const [status, setStatus] = useState('all');

  // eslint-disable-next-line no-unused-vars

  // eslint-disable-next-line no-unused-vars
  const [isAppliedSingleSellerLink, setIsAppliedSingleSellerLink] = useState(false);

  const [searchKey, setSearchKey] = useState('');

  const [open, setOpen] = useState(false);

  const [editDocumentOpen, setEditDocumentOpen] = useState(false);

  const [openLyxaChargeSidebar, setOpenLyxaChargeSidebar] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [isConfirmModal, setIsConfirmModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isSelected, setIsSelected] = useState(false);

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
        setZoneItems([...zoneItems, ...zones]);
      }
    },
  });

  const getAllSellersQuery = useQuery(
    [
      API_URL.ALL_SELLER,
      {
        sellerStatus: status,
        searchKey,
        zoneId,
        sellerType: currentTab,
        createdBy: admin?.adminType === 'sales' ? admin?._id : '',
        accountManagerId: admin?.adminType === 'accountManager' ? admin?._id : '',
      },
    ],
    () =>
      AXIOS.get(API_URL.ALL_SELLER, {
        params: {
          sellerStatus: status,
          searchKey,
          sellerType: currentTab,
          zoneId: zoneId === 'all' ? null : zoneId,
          // createdBy: admin?.adminType === 'sales' ? admin?._id : '',
          adminId: admin?.adminType === 'accountManager' || admin?.adminType === 'sales' ? admin?._id : '',
        },
      }),
    {
      onSuccess: (data) => {
        if (data.status) {
          // @check current seller is selected or not when this page is loaded first time.
          if (!isSelected) {
            // @if selected pass this block
            setIsSelected((prev) => {
              // @check here we have selller id or not, which get from route params as sellerId.
              // @If we have selller Id, then we find the this specific seller from all seller data as currentSeller.
              // @If we have not seller Id, then we stored the first seller data as current seller
              // @Stored current seller for both cases we stored current seller in seller variable.
              const seller = routeMatch?.params?.sellerId
                ? data?.data?.sellers.find((seller) => seller?._id === routeMatch?.params?.sellerId)
                : data?.data?.sellers[0];

              // @Set current seller here
              setCurrentSeller(seller);
              /*  @When we stored current seller in first loaded page, we set isSelected state as true.
              so next time it will not pass this block
              */
              return !prev;
            });
          } else {
            // @if not selected pass this block
            setCurrentSeller((prev) => {
              /*
              @For each query validation it will stored the updated seller data and stored them as current seller.
              As a result we can get updated data, when we try to update seller information.
              */

              const updatedCurrentSeller = data?.data?.sellers.find((seller) => seller?._id === prev?._id);

              // @Check current tab is 'all' or not, if it is all it stored current seller the udpated one.
              if (currentTab === 'all') {
                return updatedCurrentSeller;
              }

              /*
              @Check current tab is matched with current seller type or not.
              if it is matched then we stored udpated seller data otherwise we stored empty current seller data.
              */
              return currentSeller?.sellerType === currentTab ? updatedCurrentSeller : {};
            });
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
    console.log('currentSeller', currentSeller);
    editSellerQuery.mutate({
      id: currentSeller?._id,
      [document?.type]: document.url,
      sellerAddress: currentSeller?.sellerAddress,
    });
  };
  const removeDocument = (document) => {
    editSellerQuery.mutate({
      id: currentSeller?._id,
      [document?.type]: '',
      sellerAddress: currentSeller?.sellerAddress,
    });
  };

  return (
    <Box>
      <PageTop
        title="Seller List"
        backButtonLabel={location?.state ? location?.state?.backToLabel : undefined}
        backTo={location?.state ? location?.state?.from : undefined}
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
        {admin?.adminType !== 'customerService' && (
          <AddMenuButton
            onClick={() => {
              setOpen(() => {
                setIsEdit(false);
                return true;
              });
            }}
          />
        )}
      </Stack>
      <StyledTabs2 value={currentTab} options={tabsOptions} onChange={setCurrentTab} />
      {/* Sellers Main Section */}
      {getAllSellersQuery?.isLoading ? (
        <SellerPageSkeleton />
      ) : (
        <Box marginTop="42px" pb={12}>
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
                  loading={getAllSellersQuery.isLoading}
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
          sellerData={isEdit ? currentSeller : {}}
          sellerType={currentTab === 'all' ? '' : currentTab}
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
