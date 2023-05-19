import { Box, Button, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import CloseButton from '../../components/Common/CloseButton';
import TabPanel from '../../components/Common/TabPanel';
import ZoneMap2 from './ZoneMap2';

const riderStatic = [
  {
    id: 1,
    name: 'Rider A',
  },
  {
    id: 2,
    name: 'Rider B',
  },
  {
    id: 3,
    name: 'Rider C',
  },
  {
    id: 3,
    name: 'Rider C',
  },
];

// eslint-disable-next-line no-unused-vars
const orderStatic = [
  {
    id: 1,
    name: 'Rider A',
  },
  {
    id: 2,
    name: 'Rider B',
  },
  {
    id: 3,
    name: 'Rider C',
  },
  {
    id: 4,
    name: 'Rider C',
  },
];

// eslint-disable-next-line no-unused-vars
const store = [
  {
    id: 1,
    name: 'Rider A',
  },
  {
    id: 2,
    name: 'Rider B',
  },
  {
    id: 3,
    name: 'Rider C',
  },
  {
    id: 4,
    name: 'Rider C',
  },
];

function ZoneInfo({ theme, setIsSideBarOpen }) {
  const zoneConsumerSx = {
    backgroundColor: theme.palette.primary.contrastText,
    padding: '14px',
    borderRadius: '7px',
    border: `1px solid ${theme.palette.custom.border}`,
    width: '31%',
    cursor: 'default',
    '&:hover': {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  };
  return (
    <Stack justifyContent="space-between" gap="40px" height="100%">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box sx={{ width: '100%', height: '400px' }}>
          <ZoneMap2 />
        </Box>
        <Stack flexDirection="row" flexWrap="wrap" gap="14px">
          {riderStatic.map((rider, i) => (
            <Box sx={zoneConsumerSx} key={i}>
              <Typography sx={{ textAlign: 'center', fontWeight: '600', fontSize: '16px' }}>{rider?.name}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
      <Button
        onClick={() => {
          setIsSideBarOpen(false);
        }}
        variant="contained"
        color="primary"
        fullWidth
      >
        Close
      </Button>
    </Stack>
  );
}
function SidebarZone({ setIsSideBarOpen, title }) {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <Stack
      justifyContent="space-between"
      sx={{
        // minWidth: '400px',
        // maxWidth: '400px',
        // paddingLeft: '20px',
        // paddingRight: '20px',
        paddingTop: '20px',
        top: '0px',
        position: 'relative',
        // height: '100vh',
      }}
    >
      <Stack
        flexDirection="row"
        alignItems="center"
        sx={{ position: 'sticky', top: '0px', backgroundColor: theme.palette.primary.contrastText, zIndex: '9' }}
      >
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: '600',
            color: theme.palette.text.main,
          }}
          flex={1}
        >
          {title}
        </Typography>
        <CloseButton
          onClick={() => {
            setIsSideBarOpen(false);
          }}
        />
      </Stack>

      <Box>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
          }}
          sx={{
            '& .MuiTab-root': {
              padding: '8px 12px',
              textTransform: 'none',
            },
          }}
        >
          <Tab label="Customers" />
          <Tab label="Riders" />
          <Tab label="Orders" />
          <Tab label="Stores" />
        </Tabs>

        <TabPanel index={currentTab} value={currentTab}>
          <ZoneInfo theme={theme} setIsSideBarOpen={setIsSideBarOpen} />
        </TabPanel>
      </Box>
    </Stack>
  );
}

export default SidebarZone;
