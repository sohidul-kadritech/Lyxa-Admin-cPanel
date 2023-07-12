import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ReactComponent as CreditCard } from '../../../../assets/icons/credit-cart-colored.svg';
import { StyledProfileBox } from './helpers';

// "2950"
export default function CreditCards({ cards = [] }) {
  return (
    <StyledProfileBox title="Credit Cards">
      <Stack gap={2}>
        {cards?.map((card) => (
          <Stack direction="row" gap={3} alignItems="center" key={card?._id}>
            <CreditCard />
            <Stack>
              <Typography variant="inherit" fontWeight={500} fontSize="14px" lineHeight="16.94px">
                {card?.nameOfCard}
              </Typography>
              <Typography variant="inherit" fontWeight={400} fontSize="14px" lineHeight="16.94px">
                {new Array(12).fill('*').concat(card?.card_number?.slice(-4)).join('')}
              </Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </StyledProfileBox>
  );
}
