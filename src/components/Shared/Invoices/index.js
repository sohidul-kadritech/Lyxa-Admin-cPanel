import { Box } from '@mui/material';
import PayoutList from '../Payout';

export default function Invoices({ params, showFor }) {
  return (
    // <StyledBox
    //   padding
    //   sx={{
    //     padding: '16px 20px',
    //   }}
    // >
    //   <Typography variant="body1" fontWeight={600} pb={3}>
    //     Payouts: Lyxa to Store
    //   </Typography>
    //   <InvoiceTable rows={data} />
    // </StyledBox>

    <Box>
      <PayoutList payaoutParams={{ ...params }} showFor={showFor} />
    </Box>
  );
}
