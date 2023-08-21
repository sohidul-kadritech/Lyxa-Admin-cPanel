/* eslint-disable prettier/prettier */
import { Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import CloseButton from '../../../components/Common/CloseButton';
import StyledFormField from '../../../components/Form/StyledFormField';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

const getMakePaymentInit = (type, id, amount) => ({
  shopId: type === 'shop' ? id : undefined,
  deliveryBoyId: type === 'rider' ? id : undefined,
  amount: amount || '0',
});

const typeToApiMap = { shop: Api.SHOP_MAKE_PAYMENT, rider: Api.RIDER_MAKE_PAYMENT };

export default function MakePayment({ onClose, type, id, amount = 0 }) {
  const queryClient = useQueryClient();
  const { general } = useGlobalContext();
  const { appSetting } = general;
  const { secondaryCurrency, adminExchangeRate } = appSetting;
  const isSecondaryCurrencyEnabled = adminExchangeRate > 0;

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
          {isSecondaryCurrencyEnabled && (
            <Typography mt="-8px" variant="body3" display="block">
              Equivalent Price: {secondaryCurrency?.code} {payment.amount * parseInt(adminExchangeRate, 10)}
            </Typography>
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
  const isSecondaryCurrencyEnabled = adminExchangeRate > 0;

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
        {isSecondaryCurrencyEnabled
          ? // with secondary currency
            `${value * adminExchangeRate < 0 ? '-' : ''} ${secondaryCurrency?.code} ${Math.abs(
              value * adminExchangeRate,
            )} ~ ${value < 0 ? '-' : ''} ${baseCurrency?.code} ${Math.abs(value)}`
          : // without secondary currency
            `${value < 0 ? '-' : ''} ${baseCurrency?.code} ${Math.abs(value)}`}
      </Typography>
    </Stack>
  );
}
