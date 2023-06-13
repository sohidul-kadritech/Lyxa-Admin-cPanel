import { Typography } from '@mui/material';
import { ReactComponent as CashIcon } from '../../../../assets/icons/cash.svg';
import { ReactComponent as CreditIcon } from '../../../../assets/icons/credit-card.svg';
import { ReactComponent as LyaxPayIcon } from '../../../../assets/icons/lyxa-pay.svg';
import { StyledOrderDetailBox } from '../helpers';

const paymentMethodLabelMap = {
  cash: {
    label: 'Cash on Delivery',
    icon: <CashIcon />,
  },

  wallet: {
    label: 'Lyxa pay',
    icon: <LyaxPayIcon />,
  },

  card: {
    label: 'Credit Card',
    icon: <CreditIcon />,
  },
};

export default function PaymentMethod({ method = '' }) {
  return (
    <StyledOrderDetailBox title="Payment Method">
      <Typography variant="body2" color="textPrimary" lineHeight="22px" display="flex" gap={1.5} alignItems="center">
        {paymentMethodLabelMap[method]?.icon}
        {paymentMethodLabelMap[method]?.label}
      </Typography>
    </StyledOrderDetailBox>
  );
}
