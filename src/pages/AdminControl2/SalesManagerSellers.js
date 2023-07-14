import { Box, Stack, Tab, Tabs, Typography, debounce } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import UserAvatar from '../../components/Common/UserAvatar';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import AddSellersSkeleton from './AddSellersSkeleton';

const tabValueToSellerTypeMap = { 0: 'food', 1: 'grocery', 2: 'pharmacy' };

const getQueryParams = (createdBy) => ({
  sellerType: 'food',
  searchKey: '',
  createdBy,
});

export default function SalesManagerSellers({ onClose, currentAdmin }) {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState(0);
  const [queryParams, setQueryParams] = useState(getQueryParams(currentAdmin?._id));

  const query = useQuery([API_URL.ALL_SELLER, queryParams], () =>
    AXIOS.get(API_URL.ALL_SELLER, {
      params: queryParams,
    })
  );

  return (
    <SidebarContainer title={`Sellers Added by (${currentAdmin?.name})`} onClose={onClose}>
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
              setQueryParams((prev) => ({ ...prev, sellerType: tabValueToSellerTypeMap[newValue] }));
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
            <Tab label="Restaurant" />
            <Tab label="Grocery" />
            <Tab label="Pharmacy" />
          </Tabs>
        </Box>
        {!query?.isLoading && (
          <Box pt={5}>
            {query?.data?.data?.sellers?.map((seller) => (
              <UserAvatar
                key={seller?._id}
                imgAlt="logo"
                imgFallbackCharacter={seller?.company_name?.charAt(0)}
                imgStyle="circular"
                imgUrl={seller?.profile_photo}
                name={
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{ color: '#5E97A9', cursor: 'pointer' }}
                      onClick={() => {
                        history.push(`/seller/list/${seller?._id}`);
                      }}
                    >
                      {seller?.company_name}
                    </span>
                    <span>{seller?.shops.length > 0 ? seller?.shops.length : 0}</span>
                  </span>
                }
              />
            ))}
            {query?.data?.data?.sellers?.length === 0 && (
              <Box pt={5}>
                <Typography variant="body2">No seller found</Typography>
              </Box>
            )}
          </Box>
        )}
        {query?.isLoading && <AddSellersSkeleton />}
      </Box>
    </SidebarContainer>
  );
}
