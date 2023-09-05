/* eslint-disable prettier/prettier */
import { Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import CloseButton from '../../../components/Common/CloseButton';
import OptionsSelect from '../../../components/Filter/OptionsSelect';
import StyledFormField from '../../../components/Form/StyledFormField';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { currencyOptions } from '../../ShopProfile/Transactions/AddRemoveCredit';
import { calculateSecondaryCurrency } from './helpers';

const getMakePaymentInit = (type, id, amount) => ({
  shopId: type === 'shop' ? id : undefined,
  deliveryBoyId: type === 'rider' ? id : undefined,
  amount: amount || '0',
});

const typeToApiMap = { shop: Api.SHOP_MAKE_PAYMENT, rider: Api.RIDER_MAKE_PAYMENT };

export default function MakePayment({ onClose, type, id, amount = 0 }) {
  const queryClient = useQueryClient();
  const { general } = useGlobalContext();
  const appSetting = general?.appSetting;

  const [selectedCurrency, setSelectedCurrency] = useState('baseCurrency');

  const secondaryCurrency = appSetting?.secondaryCurrency;
  const baseCurrency = appSetting?.baseCurrency;
  const adminExchangeRate = appSetting?.adminExchangeRate;
  const secondaryEnabled = adminExchangeRate > 0;

  const [payment, setPayment] = useState(getMakePaymentInit(type, id, Math.abs(amount)));

  const paymentMutation = useMutation(() => AXIOS.post(typeToApiMap[type], payment), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);
      if (data?.status) {
        queryClient.invalidateQueries([Api.SHOP_TRX]);
        queryClient.invalidateQueries([Api.DELIVERY_TRX]);
        queryClient.invalidateQueries([Api.SINGLE_DELIVERY_WALLET_CASH_ORDER_LIST]);
        queryClient.invalidateQueries([Api.SINGLE_DELIVERY_WALLET_TRANSACTIONS]);
        onClose();
      }
    },
  });

  const onSubmit = () => {
    if (payment?.amount > amount) {
      successMsg('Amount is greater than remaining amount', 'error');
      return;
    }

    if (type === 'rider' && payment?.amount <= 0) {
      successMsg('Amount should be greater than zero!', 'error');
      return;
    }

    paymentMutation.mutate();
  };

  return (
    <Box
      sx={{
        background: '#fff',
        padding: '15px 20px 20px 20px',
        borderRadius: '7px',
        minWidth: '700px',
      }}
    >
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" pb={3}>
          <Typography fontSize="18px" variant="h4">
            Make Payment
          </Typography>
          <CloseButton onClick={onClose} size="sm" />
        </Stack>
        <Box>
          <Box py={3}>
            <OptionsSelect
              value={selectedCurrency}
              gapSx={3}
              sx={{ padding: '8px 10px' }}
              items={currencyOptions(baseCurrency, secondaryCurrency, secondaryEnabled)}
              onChange={(value) => setSelectedCurrency(value)}
            />
          </Box>

          {selectedCurrency === 'baseCurrency' && (
            <StyledFormField
              label="Settle Amount *"
              intputType="text"
              inputProps={{
                type: 'number',
                name: 'name',
                value: payment.amount,
                onChange: (e) => setPayment({ ...payment, amount: e.target.value }),
              }}
            />
          )}

          {selectedCurrency === 'secondaryCurrency' && (
            <StyledFormField
              label="Secondary Amount *"
              intputType="text"
              inputProps={{
                type: 'number',
                // value: data.secondaryCurrency_amount,
                onChange: () => {
                  // if (e.target.value > 0) setData({ ...data, secondaryCurrency_amount: e.target.value });
                  // else setData({ ...data, secondaryCurrency_amount: 1 });
                },
              }}
            />
          )}

          <Stack pt={5}>
            <ListItem label="Total Unsettled Amount" value={amount} />
            <ListItem label="Settle Amount" value={payment.amount} />
            <ListItem label="Remaining Unsettled Amount" value={amount - payment.amount} isTotal />
          </Stack>
        </Box>
        <Stack direction="row" alignItems="center" justifyContent="flex-end" pt={6.5}>
          <Button
            color="primary"
            variant="contained"
            sx={{ width: '200px' }}
            onClick={onSubmit}
            disabled={paymentMutation.isLoading}
          >
            Pay
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

function ListItem({ label, value, isTotal }) {
  const { general } = useGlobalContext();
  const { appSetting } = general;
  const { baseCurrency, secondaryCurrency, adminExchangeRate } = appSetting;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        paddingBottom: '12px',
        paddingTop: isTotal ? '12px' : 0,
        borderTop: isTotal ? '1px solid #E5E5E5' : 'none',
      }}
    >
      <Typography variant="body4" color="initial">
        {label}
      </Typography>
      <Typography variant="body4" color="initial">
        {calculateSecondaryCurrency(baseCurrency, secondaryCurrency, value, adminExchangeRate).print}
      </Typography>
    </Stack>
  );
}
