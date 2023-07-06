/* eslint-disable no-unused-vars */
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
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
    [API_URL.ALL_SELLER, { sellerStatus: status, searchKey, sellerType: tabOptionsIndex[currentTab] }],
    () =>
      AXIOS.get(API_URL.ALL_SELLER, {
        params: {
          sellerStatus: status,
          searchKey,
          //   page: 1,
          //   pageSize: 20,
          sellerType: tabOptionsIndex[currentTab],
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
    <SidebarContainer title="Assign Sellers" onClose={onClose}>
      <Stack marginBottom="12px">
        <StyledSearchBar sx={{ flex: 1 }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />
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
          <Box pt={4}>
            <Typography>Loading...</Typography>
          </Box>
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
            fullWidth
          >
            ADD
          </Button>
        </Stack>
      </Box>
    </SidebarContainer>
  );
}

export default AddSellersForAccountManager;
