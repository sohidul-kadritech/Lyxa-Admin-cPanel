import { Box, Stack } from '@mui/material';
import React, { useState } from 'react';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import DateRange from '../../components/StyledCharts/DateRange';
import { dateRangeInit, sortOptions, statusTypeOptions } from '../Faq2/helpers';

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
  const [status, setStatus] = useState('active');
  const [sort, setSort] = useState('asc');
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
          {/* <AddMenuButton onClick={() => setOpen(true)} /> */}
        </Stack>
      </Box>
    </Box>
  );
}

export default Vat2;
