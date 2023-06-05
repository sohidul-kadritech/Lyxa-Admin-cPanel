import { Typography } from '@mui/material';
import StyledBox from '../../StyledCharts/StyledBox';
import InvoiceTable from './InvoiceTable';
import { data } from './mock';

export default function Invoices() {
  return (
    <StyledBox
      padding
      sx={{
        padding: '16px 20px',
      }}
    >
      <Typography variant="body1" fontWeight={600} pb={3}>
        Invoices: Lyxa to Store
      </Typography>
      <InvoiceTable rows={data} />
    </StyledBox>
  );
}
