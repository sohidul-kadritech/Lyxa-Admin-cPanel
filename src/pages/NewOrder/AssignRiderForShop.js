/* eslint-disable no-unused-vars */
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

import CloseButton from '../../components/Common/CloseButton';
import StyledFormField from '../../components/Form/StyledFormField';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

// eslint-disable-next-line no-unused-vars
function AssignRiderForShop({ currentOrder, onClose }) {
  const [deliveryBoyList, setDeliveryBoyList] = useState([]);

  const [currentOrderDelivery, setCurrentOrderDelivery] = useState('');
  // shop riders
  const shopRiderQuery = useQuery(
    [Api.SHOP_ACTIVE_DELIVERY_BOYS],
    () =>
      AXIOS.get(Api.SHOP_ACTIVE_DELIVERY_BOYS, {
        params: {
          shopId: currentOrder?.shop?._id,
          liveStatus: 'online',
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          const riders = data?.data?.deliveryBoys;

          if (riders.length > 0) {
            setDeliveryBoyList([...(data?.data?.deliveryBoys || [])]);
          } else {
            setDeliveryBoyList([{ _id: 'no-rider', name: 'No Rider' }]);
          }
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );
  return (
    <Paper
      sx={{
        minWidth: 'max(35vw, 550px)',
        zIndex: '10 !important',
        maxHeight: '80vh',
        overflow: 'auto',
        background: '#fff',
      }}
    >
      <Box sx={{ padding: 5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h3">Assign Rider</Typography>
          <CloseButton
            onClick={() => {
              onClose();
            }}
          />
        </Stack>
        <Stack>
          <Box flex={1}>
            <Typography>We'll notify the rider when order is assigned?</Typography>
            <Box mt={2}>
              <StyledFormField
                disabled={shopRiderQuery?.isLoading}
                label="Select Rider *"
                intputType="autocomplete"
                inputProps={{
                  fullWidth: true,
                  getOptionLabel: (option) => option?.name || 'Choose',
                  sx: {
                    '&:has(.MuiInputBase-input:focus)': {
                      width: '100% !important',
                    },
                    flex: 1,
                  },
                  maxHeight: '300px',
                  options: deliveryBoyList,
                  value: currentOrderDelivery,
                  isOptionEqualToValue: (option, value) => option?._id === value?._id,
                  onChange: (e, v) => {
                    setCurrentOrderDelivery(v);
                  },
                  renderOption: (props, option) => (
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: 'space-between !important',
                      }}
                      width="100%"
                      component="li"
                      {...props}
                      key={option._id}
                    >
                      <span> {option.name}</span>
                    </Stack>
                  ),
                }}
              />
            </Box>
          </Box>

          <Stack direction="row" gap={4} justifyContent="flex-end" mt={4}>
            <Button variant="outlined" color="primary">
              Cancel
            </Button>
            <Button variant="contained" color="primary">
              Accept
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}

export default AssignRiderForShop;
