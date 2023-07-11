/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';

import StyledFormField from '../../../components/Form/StyledFormField';
import { staticSellers } from '../helpers';
import ShopRankingTable from './Table';

function ShopRanking({ data, padding = true }) {
  const theme = useTheme();
  const [queryParams, setQueryParams] = useState({ page: 1 });
  const [selller, setSeller] = useState('1');
  return (
    <Box
      sx={{
        background: '#fff',
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '7px',
        position: 'relative',
        overflow: 'hidden',
        padding: padding ? '16px 18px' : '0px',
      }}
    >
      <Typography variant="body1" fontWeight={600}>
        Shop Ranking
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="end" pt={6}>
        {/* <Stack direction="row" alignItems="center">
          <Typography variant="body1" sx={{ fontWeight: '700', fontSize: '16px' }}>
            120
          </Typography>
          <IncreaseDecreaseTag status="increase" amount="4%" />
        </Stack> */}

        <Box>
          <StyledFormField
            intputType="select"
            tooltip="Select Zone"
            containerProps={{
              sx: { padding: '0px 0px' },
            }}
            inputProps={{
              name: 'sellerName',
              size: 'sm',
              placeholder: 'Select Seller',
              value: selller,
              items: staticSellers || [],
              getLabel: (option) => option?.name,
              getValue: (option) => option?._id,
              getDisplayValue: (currentValue) => staticSellers?.find((seller) => seller?._id === currentValue)?.name,
              onChange: (e) => setSeller(e.target.value),
            }}
          />
        </Box>
      </Stack>
      <Box>
        <ShopRankingTable queryParams={queryParams} setQueryParams={setQueryParams} data={data} />
      </Box>
    </Box>
  );
}

export default ShopRanking;
