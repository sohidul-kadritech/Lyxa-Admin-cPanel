import { Unstable_Grid2 as Grid, Stack } from '@mui/material';
import { useState } from 'react';
import TotalOrderChart from '../CommonAreaChart';
import CustomerBreakdown from './CustomerBreakdown';
import CustomerInfoCard from './Infocard';

export default function Customers() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (index) => {
    setCurrentTab(index);
  };

  return (
    <Grid container spacing={7.5}>
      <Grid xs={12} lg={3}>
        <Stack gap={6}>
          <CustomerInfoCard
            title="Total customers"
            dotColor="#3CACDD"
            amount={2551}
            isActive={currentTab === 0}
            index={0}
            onClick={handleTabChange}
          />
          <CustomerInfoCard
            title="New customers"
            dotColor="#50CD89"
            amount={2551}
            isActive={currentTab === 1}
            index={1}
            onClick={handleTabChange}
          />
          <CustomerInfoCard
            title="Repeated customers"
            dotColor="#FF8C51"
            amount={2551}
            isActive={currentTab === 2}
            index={2}
            onClick={handleTabChange}
          />
          <CustomerInfoCard
            title="Lapsed customers"
            dotColor="#8950FC"
            amount={2551}
            index={3}
            isActive={currentTab === 3}
            onClick={handleTabChange}
          />
        </Stack>
      </Grid>
      <Grid xs={12} lg={9}>
        <CustomerBreakdown title="Total customers" />
      </Grid>
      <TotalOrderChart />
    </Grid>
  );
}
