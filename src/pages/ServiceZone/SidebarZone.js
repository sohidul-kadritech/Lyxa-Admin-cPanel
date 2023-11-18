/* eslint-disable no-unused-vars */
import { Box, Button, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import CloseButton from '../../components/Common/CloseButton';
import TabPanel from '../../components/Common/TabPanel';
import { smoothPanTo } from '../../components/Shared/ChangeDeliveryAddress/helpers';
import { getTitleForMarker, getTitleForStoreMarker } from '../AdminOrderTable/OrderTracking/helpers';
import ZoneMapGoogleMap from './ZoneMapGoogleMap';
import { createZoneInfoData, getMarkerLabel } from './helper';

function ZoneInfo({ theme, setIsSideBarOpen, infoData = [], polygon, zoneName }) {
  console.log('infoData', infoData, polygon);
  console.log('infodata new: ', createZoneInfoData(infoData));

  const [mapRef, setMapRef] = useState(null);

  const zoneConsumerSx = {
    backgroundColor: theme.palette.primary.contrastText,
    padding: '14px',
    borderRadius: '7px',
    border: `1px solid ${theme.palette.custom.border}`,
    width: '31%',
    cursor: 'pointer',
    '&:hover': {
      border: `1px solid ${theme.palette.primary.main}`,
    },
  };

  const onClickInfoData = (data) => {
    console.log({ data });

    const { google } = window;
    const bounds = new google.maps.LatLngBounds();

    const center = new google.maps.LatLng(data?.location?.coordinates[1], data?.location?.coordinates[0]);
    bounds.extend(center);

    if (mapRef?.map && mapRef?.marker) {
      smoothPanTo(mapRef?.map, center, 400, google);
      mapRef?.marker?.setPosition(center);
      if (!mapRef?.marker?.getAnimation()) {
        mapRef?.marker?.setAnimation(google.maps.Animation.BOUNCE);
      }
      setTimeout(() => {
        mapRef?.marker?.setAnimation(null);
      }, 400);

      mapRef?.map.fitBounds(bounds);

      // store Title
      const infowindowForStore = new google.maps.InfoWindow({
        content: data?.deliveryBoyType
          ? getTitleForMarker(`${data?.name || 'Rider Title'} (${data?.ongoingOrders || 0})` || 'Rider Title')
          : getTitleForStoreMarker(data?.shopName || 'Store name', data?.shopLogo),
      });

      const infoWindows = [];

      // Closing all InfoWindows

      const closeAll = () => {
        mapRef?.infoWindow?.forEach((info) => {
          const entry = Object.keys(info)[0];
          console.log({ entry });

          if (entry) info[entry].close();
        });
      };

      closeAll();

      // infoWindows?.push(infowindowForStore);

      mapRef[`${data?._id}-infowindow`].open(mapRef?.map, mapRef[data?._id]);

      google.maps.event.addListener(mapRef?.map, 'mouseout', () => {
        closeAll();
      });
    }
  };

  return (
    <Stack justifyContent="space-between" gap="40px" height="100%">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box sx={{ width: '100%', height: '400px' }}>
          {/* <ZoneMap2 polygon={polygon} infoData={createZoneInfoData(infoData)} zoneName={zoneName} /> */}
          <ZoneMapGoogleMap infoData={infoData} polygon={polygon} zoneName={zoneName} setMapReference={setMapRef} />
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
              <Box sx={zoneConsumerSx} key={i} onClick={() => onClickInfoData(data)}>
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
                  {getMarkerLabel(data)}
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
  const [currentTab, setCurrentTab] = useState(0);
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
            infoData={currentRowData[statsTracker[currentTab]]}
            polygon={currentRowData?.zoneGeometry?.coordinates}
          />
        </TabPanel>
      </Box>
    </Stack>
  );
}

export default SidebarZone;
