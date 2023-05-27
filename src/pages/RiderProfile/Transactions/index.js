// SINGLE_DELIVERY_TRX
import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import moment from 'moment';
import { useQuery } from 'react-query';
import InfoCard from '../../../components/StyledCharts/InfoCard';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import TransactionsTable from './Table';
import { getMockTrx } from './mock';

export const queryParamsInit = {
  page: 1,
  pageSize: 10,
  sortBy: 'DESC',
  type: 'all',
  startDate: moment().startOf('month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  searchKey: '',
};

export default function RiderTransactions({ riderId }) {
  const query = useQuery(
    [Api.SINGLE_DELIVERY_TRX, { deliveryBoyId: riderId }],
    () => AXIOS.get(Api.SINGLE_DELIVERY_TRX, { params: { deliveryBoyId: riderId } }),
    {
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  console.log(query?.data);

  return (
    <Box>
      <Grid container spacing={5} pb={7.5}>
        <InfoCard title="Lyxa Earning" value="2551" sm={6} md={4} lg={3} />
        <InfoCard title="Unsettled Amount" value="2551" sm={6} md={4} lg={3} />
        <InfoCard title="Rider Earning" value="2551" sm={6} md={4} lg={3} />
        <InfoCard title="Cash in Hand" value="2551" sm={6} md={4} lg={3} />
      </Grid>
      <TransactionsTable rows={getMockTrx(5)} />
    </Box>
  );
}
