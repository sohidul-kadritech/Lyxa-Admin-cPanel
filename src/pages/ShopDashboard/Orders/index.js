import { Unstable_Grid2 as Grid } from '@mui/material';
import ItemRanking from './ItemRanking';
import OrderByHours from './OrderByHours';
import TotalOrdersChart from './TotalOrdersChart';

export default function Orders() {
  return (
    <Grid container spacing={6.5}>
      <TotalOrdersChart />
      <ItemRanking />
      <OrderByHours />
      <TotalOrdersChart />
    </Grid>
  );
}
