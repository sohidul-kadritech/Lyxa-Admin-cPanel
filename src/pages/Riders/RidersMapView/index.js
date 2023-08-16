/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line no-unused-vars
import { Box, useTheme } from '@mui/material';
import React from 'react';
import { useQuery } from 'react-query';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import ModalContainer from '../../ServiceZone/ModalContainer';
import MapSkeleton from './MapSkeleton';
import RidersCurrentLocationMapView from './RidersCurrentLocationMapView';

function RidersMapView({ onClose, currentOrder }) {
  const theme = useTheme();
  console.log('currentOrder', currentOrder);

  const getAllRiders = useQuery([API_URL.RIDER_CURRENT_LOCATION], () =>
    AXIOS.get(API_URL.RIDER_CURRENT_LOCATION, {
      params: {
        status: 'active',
        liveStatus: 'online',
        type: 'available',

        // deliveryBoyType: 'dropRider',
      },
    }),
  );

  console.log('getAllRiders', getAllRiders?.data?.data?.deliveryBoys);

  return (
    <ModalContainer
      title="Riders"
      onClose={onClose}
      sx={{
        width: 'calc(100vw - 40px)',
        height: 'calc(100vh - 40px)',
        padding: '24px',
        overflow: 'hidden',
        backgroundColor: theme.palette.primary.contrastText,
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          height: '100%',
        }}
      >
        {getAllRiders?.isLoading ? (
          <MapSkeleton />
        ) : (
          <RidersCurrentLocationMapView riders={getAllRiders?.data?.data?.deliveryBoys} />
        )}
      </Box>
    </ModalContainer>
  );
}

export default RidersMapView;
