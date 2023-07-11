import { Box, Stack, Typography } from '@mui/material';
import { StyledProfileBox } from './helpers';

function CouponItem({ coupon, isFirst, isLast }) {
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
          {coupon?.title}
        </Typography>
        <Typography variant="inherit" fontSize="12px" lineHeight="15px" fontWeight={400}>
          {coupon?.date}
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
        {coupon?.code}
      </Box>
    </Stack>
  );
}

export default function Coupons({ coupons }) {
  return (
    <StyledProfileBox title="Coupons">
      {coupons?.map((coupon, index, { length }) => (
        <CouponItem coupon={coupon} isFirst={index === 0} isLast={index === length - 1} key={index} />
      ))}
    </StyledProfileBox>
  );
}
