/* eslint-disable no-unused-vars */
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

import CloseButton from '../../components/Common/CloseButton';
import OptionsSelect from '../../components/Filter/OptionsSelect';
import StyledFormField from '../../components/Form/StyledFormField';
import { getNextStatus } from '../../components/Shared/UpdateOrderStatus/helpers';
import { useGlobalContext } from '../../context';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { validateAndGenerateStatusData } from './helpers';

const getCurrencyOptions = (settings) => {
  const { baseCurrency, secondaryCurrency } = settings;

  if (!secondaryCurrency) {
    return [{ label: baseCurrency?.code, value: 'baseCurrency' }];
  }
  return [
    { label: baseCurrency?.code, value: 'baseCurrency' },
    { label: secondaryCurrency?.code, value: 'secondaryCurrency' },
  ];
};

// eslint-disable-next-line no-unused-vars
function AssignRiderForShop({ currentOrder, onClose, updateStatusMutation }) {
  const [deliveryBoyList, setDeliveryBoyList] = useState([]);

  const [paidCurrency, setPaidCurrency] = useState('baseCurrency');

  const { general } = useGlobalContext();
  const { appSetting } = general;

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
            setDeliveryBoyList([{ _id: 'no-rider', name: 'No Rider' }, ...(data?.data?.deliveryBoys || [])]);
          } else {
            setDeliveryBoyList([{ _id: 'no-rider', name: 'No Rider' }]);
          }
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  const assignRiderhandler = () => {
    const updatedCurrentOrder =
      getNextStatus(currentOrder) === 'delivered'
        ? { ...currentOrder }
        : { ...currentOrder, deliveryBoy: currentOrderDelivery };

    const newPaidCurrency = getNextStatus(currentOrder) !== 'delivered' ? '' : paidCurrency;

    const validated = validateAndGenerateStatusData(updatedCurrentOrder, newPaidCurrency);

    if (validated?.status === false) return;

    const payload = validated?.data;

    updateStatusMutation.mutate({ data: payload });
  };

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
          {getNextStatus(currentOrder) !== 'delivered' ? (
            <Typography variant="h3">Assign Rider</Typography>
          ) : (
            <Typography variant="h3">Select currency</Typography>
          )}
          <CloseButton
            onClick={() => {
              onClose();
            }}
          />
        </Stack>
        <Stack>
          <Box flex={1}>
            {getNextStatus(currentOrder) !== 'delivered' ? (
              <Typography>We'll notify the rider when order is assigned?</Typography>
            ) : (
              <Typography>Select which currency you received</Typography>
            )}
            <Box mt={2}>
              {getNextStatus(currentOrder) !== 'delivered' && (
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
              )}

              {getNextStatus(currentOrder) === 'delivered' && (
                <OptionsSelect
                  gapSx={{
                    sm: 3,
                    xl: 3,
                    lg: 3,
                  }}
                  items={getCurrencyOptions(appSetting)}
                  value={paidCurrency}
                  onChange={(value) => {
                    setPaidCurrency(value);
                  }}
                />
              )}
            </Box>
          </Box>

          <Stack direction="row" gap={4} justifyContent="flex-end" mt={4}>
            <Button variant="outlined" color="primary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={updateStatusMutation?.isLoading}
              onClick={assignRiderhandler}
            >
              {getNextStatus(currentOrder) === 'delivered' ? 'Delivered' : 'Accept'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}

export default AssignRiderForShop;
