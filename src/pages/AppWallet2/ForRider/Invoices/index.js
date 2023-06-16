import { Box, Stack } from '@mui/material';
import React, { useState } from 'react';
import { ReactComponent as DownloadIcon } from '../../../../assets/icons/download-icon-2.svg';
import StyledSearchBar from '../../../../components/Styled/StyledSearchBar';
import StyledTabs2 from '../../../../components/Styled/StyledTab2';
import DateRange from '../../../../components/StyledCharts/DateRange';
import { AddMenuButton } from '../../../Faq2';
import { dateRangeInit } from '../../../Faq2/helpers';
import InvoiceTable from './InvoiceTable';
import { staticData } from './helpers';
// eslint-disable-next-line no-unused-vars
const tabsOptions = [
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'revoked', label: 'Revoked' },
  { value: 'paid', label: 'Paid' },
];
function RiderInvoice() {
  const [currentTab, setCurrentTab] = useState('unpaid');
  const [range, setRange] = useState({ ...dateRangeInit });
  // eslint-disable-next-line no-unused-vars
  const [searchKey, setSearchKey] = useState('');
  return (
    <Box>
      <StyledTabs2 value={currentTab} options={tabsOptions} onChange={setCurrentTab} />
      <Box sx={{ marginTop: '30px' }}>
        <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }}>
          <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />
          <DateRange range={range} setRange={setRange} />
          <AddMenuButton
            title="Download"
            icon={<DownloadIcon />}
            // onClick={() => {
            //   downloadPdf();
            // }}
          />
        </Stack>
      </Box>
      <InvoiceTable data={staticData} />
    </Box>
  );
}

export default RiderInvoice;
