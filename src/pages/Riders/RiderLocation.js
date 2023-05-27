import { Box, Stack, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import CloseButton from '../../components/Common/CloseButton';
import Map from '../../components/Map';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

export default function RiderLocation({ riderId, onClose }) {
  const query = useQuery([Api.DELIVERY_BOY_CURRENT_LOCATION], () =>
    AXIOS.get(Api.DELIVERY_BOY_CURRENT_LOCATION, {
      params: {
        deliveryBoyId: riderId,
      },
    })
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Box
        sx={{
          padding: '20px',
          background: '#fff',
          borderRadius: '8px',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" pb={8}>
          <Typography variant="h4">Rider Current Location</Typography>
          <CloseButton onClick={onClose} />
        </Stack>
        <Box
          sx={{
            background: '#fff',
            width: 'min(600px, 60vw)',
            height: 'min(600px, 60vh',
          }}
        >
          <Map
            lat={query?.data?.data?.location?.coordinates && query?.data?.data?.location?.coordinates[1]}
            lng={query?.data?.data?.location?.coordinates && query?.data?.data?.location?.coordinates[0]}
          />
        </Box>
      </Box>
    </Box>
  );
}
