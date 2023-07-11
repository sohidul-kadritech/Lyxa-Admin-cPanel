/* eslint-disable no-unused-vars */
import { EmailOutlined } from '@mui/icons-material';
import { Box, Button, Stack, Tab, Tabs, debounce } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import AddSellersSkeleton from './AddSellersSkeleton';
import SellerListForAccountManager from './SellerListForAccountManager';
import { generateAsignData, getSellersForAccountManager, tabOptionsIndex } from './helpers';

function AddSellersForAccountManager({ onClose, currentAdmin, editAdminQuery }) {
  console.log('currentAdmin', currentAdmin);
  console.log('currentAdmin?.sellers', currentAdmin?.sellers);

  const [status, setStatus] = useState('all');
  const [searchKey, setSearchKey] = useState('');
  const [zoneItems, setZoneItems] = useState([{ zoneName: 'All', _id: 'all' }]);
  const [currentTab, setCurrentTab] = useState(0);
  const [sellers, setSellers] = useState(getSellersForAccountManager(currentAdmin?.sellers));

  function sortDataBasedOnId(a, b) {
    // Check if both items are selected
    if (sellers.includes(a._id) && sellers.includes(b._id)) {
      // If both items are selected, maintain their original order
      return 0;
    }
    if (sellers.includes(a._id)) {
      // If only the first item is selected, move it to the top
      return -1;
    }
    if (sellers.includes(b._id)) {
      // If only the second item is selected, move it to the top
      return 1;
    }
    // If neither item is selected, sort based on _id
    return a._id.localeCompare(b._id);
  }

  const getAllSellersQuery = useQuery(
    [
      API_URL.REMAINING_SELLER_FOR_ACCOUNT_MANAGER,
      { sellerStatus: status, searchKey, sellerType: tabOptionsIndex[currentTab], accountManagerId: currentAdmin?._id },
    ],
    () =>
      AXIOS.get(API_URL.REMAINING_SELLER_FOR_ACCOUNT_MANAGER, {
        params: {
          sellerStatus: status,
          searchKey,
          //   page: 1,
          //   pageSize: 20,
          sellerType: tabOptionsIndex[currentTab],
          accountManagerId: currentAdmin?._id,
        },
        // eslint-disable-next-line prettier/prettier
      }),
  );

  const asignSeller = () => {
    const data = { currentAdmin, sellers };
    generateAsignData(data);
    if (generateAsignData(data)) {
      editAdminQuery.mutate(generateAsignData(data));
    }
  };

  return (
    <SidebarContainer title={`Assign Sellers (for ${currentAdmin?.name})`} onClose={onClose}>
      <Stack marginBottom="12px">
        <StyledSearchBar
          sx={{ flex: 1 }}
          placeholder="Search"
          onChange={debounce((e) => setSearchKey(e.target.value), 300)}
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
            <Tab label="All Categories" />
            <Tab label="Restaurant" />
            <Tab label="Grocery" />
            <Tab label="Pharmacy" />
          </Tabs>
        </Box>
        {!getAllSellersQuery?.isLoading ? (
          <Box pt={4}>
            <SellerListForAccountManager
              sellers={sellers}
              setSellers={setSellers}
              data={getAllSellersQuery?.data?.data?.sellers.sort(sortDataBasedOnId) || []}
            />
          </Box>
        ) : (
          <AddSellersSkeleton />
        )}

        <Stack sx={{ padding: '30px 0px' }}>
          <Button
            disableElevation
            variant="contained"
            disabled={editAdminQuery?.isLoading}
            onClick={() => {
              // onSubmitSeller();
              // setLoading(true);
              asignSeller();
            }}
            startIcon={<EmailOutlined />}
            fullWidth
          >
            SAVE
          </Button>
        </Stack>
      </Box>
    </SidebarContainer>
  );
}

export default AddSellersForAccountManager;
