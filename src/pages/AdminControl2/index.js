import { Box, Stack, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import PageTop from '../../components/Common/PageTop';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { AddMenuButton } from '../Faq2';

function AdminControl() {
  const [currentTab, setCurrentTab] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [searchKey, setSearchKey] = useState('');
  //   const [status, setStatus] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <PageTop
        title="Users"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />
      <Box marginBottom="30px">
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            //   setTabName(sellerShopTabType[newValue]);
            setCurrentTab(newValue);
          }}
        >
          <Tab label="Admin" />
          <Tab label="Customer Support" />
          <Tab label="Sales Manger" />
          <Tab label="Account Manager" />
        </Tabs>
      </Box>

      <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
        <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />

        <AddMenuButton
          onClick={() => {
            setOpen(true);
          }}
        />
      </Stack>
    </Box>
  );
}

export default AdminControl;
