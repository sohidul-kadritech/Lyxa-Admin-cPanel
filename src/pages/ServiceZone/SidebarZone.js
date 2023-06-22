import { Box, Button, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import CloseButton from '../../components/Common/CloseButton';
import TabPanel from '../../components/Common/TabPanel';
import ZoneMap2 from './ZoneMap2';
import { createZoneInfoData } from './helper';

function ZoneInfo({ theme, setIsSideBarOpen, infoData = [], polygon, zoneName }) {
  console.log('infoData', infoData, polygon);
  console.log('infodata new: ', createZoneInfoData(infoData));
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
          <ZoneMap2 polygon={polygon} infoData={createZoneInfoData(infoData)} zoneName={zoneName} />
        </Box>
        <Stack
          flexDirection="row"
          flexWrap="wrap"
          alignItems="center"
          // justifyContent="center"
          alignContent="center"
          gap="14px"
        >
          <>
            {createZoneInfoData(infoData).map((data, i) => (
              <Box sx={zoneConsumerSx} key={i}>
                <Typography
                  sx={{
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    fontWeight: '600',
                    fontSize: '16px',
                  }}
                >
                  {data?.name}
                </Typography>
              </Box>
            ))}

            {createZoneInfoData(infoData).length === 0 && (
              <Box sx={zoneConsumerSx}>
                <Typography sx={{ textAlign: 'center', fontWeight: '600', fontSize: '16px' }}>No Data</Typography>
              </Box>
            )}
          </>
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
function SidebarZone({ setIsSideBarOpen, currentRowData }) {
  const statsTracker = {
    0: 'riders',
    1: 'shops',
  };
  console.log('currentRowdata', currentRowData);
  console.log('polygon currenr zone', currentRowData?.zoneGeometry?.coordinates);
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(3);
  return (
    <Stack
      justifyContent="space-between"
      sx={{
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
            textTransform: 'capitalize',
          }}
          flex={1}
        >
          {`${currentRowData?.zoneName} Zone` || ''}
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
          <Tab label="Riders" />
          <Tab label="Stores" />
        </Tabs>

        <TabPanel index={currentTab} value={currentTab}>
          <ZoneInfo
            zoneName={currentRowData?.zoneName}
            theme={theme}
            setIsSideBarOpen={setIsSideBarOpen}
            infoData={currentRowData.stats[statsTracker[currentTab]]}
            polygon={currentRowData?.zoneGeometry?.coordinates}
          />
        </TabPanel>
      </Box>
    </Stack>
  );
}

export default SidebarZone;
