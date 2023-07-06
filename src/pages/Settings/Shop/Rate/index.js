import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import AcceptedCurrency from './AcceptedCurrency';
import Rate from './Rate';

const TypoSx = {
  fontSize: '16px',
  fontWeight: 600,
};

function RateContainer({ boxSx, title, rateofShop, setRateofShop, setHasChanged }) {
  return (
    <Box sx={boxSx}>
      <Typography sx={TypoSx}>{title}</Typography>
      <Stack gap="12px">
        <Rate setHasChanged={setHasChanged} shopSettings={rateofShop} setShopSettings={setRateofShop} />
        <AcceptedCurrency setHasChanged={setHasChanged} shopSettings={rateofShop} setShopSettings={setRateofShop} />
      </Stack>
    </Box>
  );
}

export default RateContainer;
