/* eslint-disable no-unused-vars */
import { Box, Button, Drawer, Grid, Stack, Typography } from '@mui/material';

// project import
// import Greeting from './Greeting';

import { useState } from 'react';
import { useQuery } from 'react-query';
import { useGlobalContext } from '../../context';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { dateRangeInit } from '../Faq2/helpers';
import EditAdminProfile from './EditAdminProfile';
import Greeting from './Greeting';
import Orders from './Orders';
import SellersChart from './SellersChart';
import SellersRanking from './SellersRanking';
import { staticSellersData } from './SellersRanking/helpers';
import ShopRanking from './ShopRanking';
import { staticShopRanking } from './ShopRanking/helpers';

function SalesManagerDashBoard() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useGlobalContext();
  const admin = currentUser?.admin;

  const [range, setRange] = useState({ ...dateRangeInit });

  const getSalesdashBoard = useQuery(
    [API_URL.GET_SALES_DASHBOARD_SUMMARY, [{ startData: range.start, endDate: range.end }]],
    () =>
      // eslint-disable-next-line prettier/prettier
      AXIOS.get(API_URL.GET_SALES_DASHBOARD_SUMMARY, { params: { startData: range.start, endDate: range.end } }),
  );

  console.log('dashboard data for sales: ', getSalesdashBoard?.data);
  return (
    <Box pt={9} pb={12}>
      <Typography variant="h4" pb={14}>
        Dashboard
      </Typography>
      <Stack direction="row" width="100%">
        <Box flex={1}>
          <Greeting />
        </Box>
        <Button
          disableRipple
          sx={{
            fontWeight: '500',
            fontSize: '17px',
            lineHeight: '28px',
            textDecorationLine: 'underline',
            textUnderlineOffset: '2px',
            padding: '0px',
            gap: '11px',
            '& .MuiButton-startIcon, & .MuiButton-endIcon': {
              margin: '0px',
            },
          }}
          variant="text"
          color="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          Profile Settings
        </Button>
      </Stack>
      <Grid container rowSpacing={1} pt={7.5} columnSpacing={{ xs: 2.5, sm: 5, md: 10 }}>
        <Grid item xs={12} md={6}>
          <Orders />
        </Grid>
        <Grid item xs={12} md={6}>
          <SellersChart viewUserType="sales" />
        </Grid>
      </Grid>
      <Box pt={7.5}>
        <SellersRanking data={staticSellersData} />
      </Box>
      <Box pt={7.5}>
        <ShopRanking data={staticShopRanking} />
      </Box>

      <Drawer anchor="right" open={open}>
        <EditAdminProfile
          isEdit
          currentAdmin={admin}
          onClose={() => {
            setOpen(false);
          }}
          adminType="sales"
        />
      </Drawer>
    </Box>
  );
}

export default SalesManagerDashBoard;
