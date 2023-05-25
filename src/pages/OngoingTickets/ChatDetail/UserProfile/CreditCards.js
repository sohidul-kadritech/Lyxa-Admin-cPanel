import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ReactComponent as CreditCard } from '../../../../assets/icons/credit-cart-colored.svg';
import { StyledProfileBox } from './helpers';

export default function CreditCards({ user }) {
  return (
    <StyledProfileBox title="Credit Cards">
      <Stack direction="row" gap={3} alignItems="center">
        <CreditCard />
        <Stack>
          <Typography variant="inherit" fontWeight={500} fontSize="14px" lineHeight="16.94px">
            {user?.name}
          </Typography>
          <Typography variant="inherit" fontWeight={400} fontSize="14px" lineHeight="16.94px">
            ***7896
          </Typography>
        </Stack>
      </Stack>
    </StyledProfileBox>
  );
}
