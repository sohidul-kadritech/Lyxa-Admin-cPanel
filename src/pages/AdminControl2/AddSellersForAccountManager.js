/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { EmailOutlined } from '@mui/icons-material';
import { Box, Button, Stack, Tab, Tabs, debounce } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import AddSellersSkeleton from './AddSellersSkeleton';
import SellerListForAccountManager from './SellerListForAccountManager';
import { getManagerSellerIds } from './helpers';

const getQueryParams = (adminType, adminId) => ({
  sellerStatus: 'all',
  searchKey: '',
  sellerType: 'all',
  accountManagerId: adminType === 'accountManager' ? adminId : undefined,
  salesManagerId: adminType === 'sales' ? adminId : undefined,
});

const tabOptionsIndex = {
  0: 'all',
  1: 'food',
  2: 'grocery',
  3: 'pharmacy',
};

const adminTypeToApiMap = {
  accountManager: API_URL.REMAINING_SELLER_FOR_ACCOUNT_MANAGER,
  sales: API_URL.REMAINING_SELLER_FOR_SALES_MANAGER,
};

export default function AddSellersForAccountManager({ onClose, currentAdmin, editAdminQuery }) {
  console.log({ currentAdmin });
  const [queryParams, setQueryParams] = useState(getQueryParams(currentAdmin?.adminType, currentAdmin?._id));
  const [currentTab, setCurrentTab] = useState(0);
  const [sellers, setSellers] = useState(getManagerSellerIds(currentAdmin?.sellers));

  function sortDataBasedOnId(a, b) {
    // If both items are selected, maintain their original order
    if (sellers.includes(a._id) && sellers.includes(b._id)) return 0;

    // If only the first item is selected, move it to the top
    if (sellers.includes(a._id)) return -1;

    // If only the second item is selected, move it to the top
    if (sellers.includes(b._id)) return 1;

    // If neither item is selected, sort based on _id
    return a._id.localeCompare(b._id);
  }

  const query = useQuery([adminTypeToApiMap[currentAdmin?.adminType], queryParams], () =>
    AXIOS.get(adminTypeToApiMap[currentAdmin?.adminType], {
      params: queryParams,
    }),
  );

  const updateSellers = () => {
    const data = { id: currentAdmin?._id, sellers };

    if (!data?.id) {
      successMsg(`Could not find ${currentAdmin?.adminType === 'accountManager' ? 'Account' : 'Sales'} manager!`);
      return;
    }

    if (!sellers?.length) {
      successMsg(`Sellers cannot be empty!`);
      return;
    }

    editAdminQuery.mutate(data);
  };

  return (
    <SidebarContainer title={`Assign Sellers (for ${currentAdmin?.name})`} onClose={onClose}>
      <Stack marginBottom="12px">
        <StyledSearchBar
          sx={{ flex: 1 }}
          placeholder="Search"
          onChange={debounce((e) => setQueryParams((prev) => ({ ...prev, searchKey: e.target.value })), 300)}
        />
      </Stack>
      <Box>
        <Box sx={{ margin: '0 -8px' }}>
          <Tabs
            value={currentTab}
            variant="scrollable"
            scrollButtons="auto"
            onChange={(event, newValue) => {
              setCurrentTab(newValue);
              setQueryParams((prev) => ({ ...prev, sellerType: tabOptionsIndex[newValue] }));
            }}
            sx={{
              '& .MuiTab-root': {
                padding: '8px 12px',
                textTransform: 'none',
              },
              '& .MuiTabScrollButton-root': {
                width: '15px',
              },
            }}
          >
            <Tab label="All" />
            <Tab label="Restaurant" />
            <Tab label="Grocery" />
            <Tab label="Pharmacy" />
          </Tabs>
        </Box>
        {query?.isLoading && <AddSellersSkeleton />}
        {!query?.isLoading && (
          <Box pt={4}>
            <SellerListForAccountManager
              sellers={sellers}
              setSellers={setSellers}
              data={query?.data?.data?.sellers.sort(sortDataBasedOnId)}
            />
          </Box>
        )}
        <Stack sx={{ padding: '30px 0px' }}>
          <Button
            disableElevation
            variant="contained"
            disabled={editAdminQuery?.isLoading}
            onClick={() => {
              updateSellers();
            }}
            startIcon={<EmailOutlined />}
            fullWidth
          >
            Save
          </Button>
        </Stack>
      </Box>
    </SidebarContainer>
  );
}
