import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useGlobalContext } from '../../../../../context';

export default function CouponItem({ coupon, isFirst, isLast }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  return (
    <Stack
      className={`${isFirst ? 'first' : ''} ${isLast ? 'last' : ''}`}
      sx={{
        padding: '20px 0',
        borderBottom: '1px solid',
        borderBottomColor: 'custom.border',

        '&.first': {
          paddingTop: '4px',
        },

        '&.last': {
          paddingBottom: '0px',
          borderBottom: 'none',
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" pb={4}>
        <Typography variant="inherit" fontSize="13px" lineHeight="15px" fontWeight={600}>
          Get {coupon?.couponDiscountType === 'fixed' ? currency : ''}
          {coupon?.couponValue}
          {coupon?.couponDiscountType === 'percentage' ? '%' : ''} off your order {coupon?.couponCondition}
        </Typography>
        <Typography variant="inherit" fontSize="12px" lineHeight="15px" fontWeight={400}>
          {moment(coupon?.couponDuration?.end).format('ddd DD, MMM, YYYY')}
        </Typography>
      </Stack>
      <Box
        sx={{
          fontSize: '14px',
          lineHeight: '17px',
          fontWeight: '400',
          color: 'text.secondary2',
          padding: '12px 15px',
          borderRadius: '10px',
          background: '#F5F5F5',
        }}
      >
        {coupon?.couponName}
      </Box>
    </Stack>
  );
}
