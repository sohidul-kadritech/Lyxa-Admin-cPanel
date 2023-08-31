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
  amount: amount || '',
});

export default function ShopMakePayment({ onClose, type, id, amount = 0 }) {
  const queryClient = useQueryClient();

  const [payment, setPayment] = useState(getMakePaymentInit(type, id, Math.abs(amount)));

  const paymentMutation = useMutation(() => AXIOS.post(Api.SHOP_MAKE_PAYMENT, payment), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);
      if (data?.status) {
        queryClient.invalidateQueries([Api.SHOP_TRX]);
        onClose();
      }
    },
  });

  const onSubmit = () => {
    if (Number.NaN(payment?.amount)) {
      successMsg('Invalid amount', 'error');
      return;
    }

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
              value * adminExchangeRate
            )} ~ ${value < 0 ? '-' : ''} ${baseCurrency?.code} ${Math.abs(value)}`
          : // without secondary currency
            `${value < 0 ? '-' : ''} ${baseCurrency?.code} ${Math.abs(value)}`}
      </Typography>
    </Stack>
  );
}
