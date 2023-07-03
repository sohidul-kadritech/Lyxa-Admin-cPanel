import { Typography } from '@mui/material';
import { ReactComponent as CouponIcon } from '../../../../assets/icons/coupon.svg';
import { useGlobalContext } from '../../../../context';
import { StyledOrderDetailBox } from '../helpers';

export default function CouponDetails({ coupon }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  return (
    <StyledOrderDetailBox
      title={
        <span>
          <CouponIcon /> Coupon Details
        </span>
      }
    >
      <Typography variant="body2" color="textPrimary" lineHeight="22px" display="flex" gap={1.5} alignItems="center">
        <span style={{ fontWeight: 600 }}>Code</span> - {coupon?.couponName}
      </Typography>
      <Typography variant="body2" color="textPrimary" lineHeight="22px" display="flex" gap={1.5} alignItems="center">
        <span style={{ fontWeight: 600 }}>Value</span> - {coupon?.couponValue}
        {coupon?.couponType === 'fixed' ? currency : '%'}
      </Typography>
      <Typography variant="body2" color="textPrimary" lineHeight="22px" display="flex" gap={1.5} alignItems="center">
        <span style={{ fontWeight: 600 }}>Type</span> -{' '}
        <span style={{ textTransform: 'capitalize' }}>{coupon?.couponType}</span>
      </Typography>
    </StyledOrderDetailBox>
  );
}
