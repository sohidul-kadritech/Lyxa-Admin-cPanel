import { Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import DateRange from '../../components/StyledCharts/DateRange';
import { useGlobalContext } from '../../context';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { AddMenuButton } from '../Faq2';
import { dateRangeInit, sortOptions, statusTypeOptions } from '../Faq2/helpers';
import VatList from './vatList';

const breadcrumbItems = [
  {
    label: 'Financials',
    to: '/financials',
  },
  {
    label: 'Vat',
    to: '#',
  },
];
function Vat2() {
  const [range, setRange] = useState({ ...dateRangeInit });
  const { currentUser } = useGlobalContext();
  console.log(currentUser);
  const [status, setStatus] = useState('active');
  const [sort, setSort] = useState('asc');
  const getCurrentCurrency = JSON.parse(localStorage.getItem('currency'));
  const theme = useTheme();
  const getAllTransaction = useQuery([API_URL.GET_ALL_ADMIN_VAT], () => AXIOS.post(API_URL.GET_ALL_ADMIN_VAT));
  console.log(getAllTransaction?.data?.data);
  return (
    <Box>
      <PageTop
        backButtonLabel="Back to Financials"
        breadcrumbItems={breadcrumbItems}
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />

      <Box marginBottom="30px">
        <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
          <DateRange range={range} setRange={setRange} />
          <StyledFormField
            intputType="select"
            containerProps={{
              sx: { padding: '0px 0px' },
            }}
            inputProps={{
              name: 'sort',
              placeholder: 'Sort',
              value: sort,
              items: sortOptions,
              size: 'sm2',
              //   items: categories,
              onChange: (e) => setSort(e.target.value),
            }}
          />
          <StyledFormField
            intputType="select"
            containerProps={{
              sx: { padding: '0px 0px' },
            }}
            inputProps={{
              name: 'status',
              placeholder: 'Status',
              value: status,
              items: statusTypeOptions,
              size: 'sm2',
              //   items: categories,
              onChange: (e) => setStatus(e.target.value),
            }}
          />
          <StyledFormField
            intputType="select"
            containerProps={{
              sx: { padding: '0px 0px' },
            }}
            inputProps={{
              name: 'status',
              placeholder: 'Status',
              value: status,
              items: statusTypeOptions,
              size: 'sm2',
              //   items: categories,
              onChange: (e) => setStatus(e.target.value),
            }}
          />
          <AddMenuButton
            title="Make Payment"
            isIcon={false}
            //   onClick={() => setOpen(true)}
          />
        </Stack>
      </Box>

      <Stack flexDirection="row" gap="26px">
        <Box
          flex="1"
          sx={{
            backgroundColor: theme.palette.primary.contrastText,
            border: `1px solid ${theme.palette.custom.border}`,
            borderRadius: '7px',
            padding: '14px 30px 23px',
          }}
        >
          <Box>
            <Typography variant="h5">Unpaid VAT</Typography>
            <Typography variant="h2">2551</Typography>
          </Box>
        </Box>
        <Box
          flex="1"
          sx={{
            backgroundColor: theme.palette.primary.contrastText,
            border: `1px solid ${theme.palette.custom.border}`,
            borderRadius: '7px',
            padding: '14px 30px 23px',
          }}
        >
          <Box>
            <Typography variant="h5">Paid VAT</Typography>
            <Typography variant="h2">2551</Typography>
          </Box>
        </Box>
        <Box
          flex="1"
          sx={{
            backgroundColor: theme.palette.primary.contrastText,
            border: `1px solid ${theme.palette.custom.border}`,
            borderRadius: '7px',
            padding: '14px 30px 23px',
          }}
        >
          <Box>
            <Typography variant="h5">Target VAT</Typography>
            <Typography variant="h2">2551</Typography>
          </Box>
        </Box>
      </Stack>

      <VatList getCurrentCurrency={getCurrentCurrency} />
    </Box>
  );
}

export default Vat2;
