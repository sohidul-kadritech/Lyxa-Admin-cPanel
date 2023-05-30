import { Box, Stack } from '@mui/material';
import React, { useState } from 'react';
import { dateRangeInit, statusTypeOptions } from '../Faq2/helpers';

import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import DateRange from '../../components/StyledCharts/DateRange';

function ReferFriendList() {
  const [range, setRange] = useState({ ...dateRangeInit });
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState('active');
  // eslint-disable-next-line no-unused-vars
  const [searchKey, setSearchKey] = useState('');
  return (
    <Box>
      <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
        <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />
        <DateRange range={range} setRange={setRange} />
        <StyledFormField
          intputType="select"
          containerProps={{
            sx: { padding: '0px 0px' },
          }}
          inputProps={{
            name: 'status',
            placeholder: 'Status',
            value: '',
            items: statusTypeOptions,
            size: 'sm2',
            //   items: categories,
            //   onChange: (e) => setStatus(e.target.value),
          }}
        />
      </Stack>
    </Box>
  );
}

export default ReferFriendList;
