import { Box } from '@mui/material';
import { useState } from 'react';
import TabPanel from '../../../components/Common/TabPanel';
import { data } from '../../../components/Shared/Invoices/mock';
import StyledTabs2 from '../../../components/Styled/StyledTab2';
import SearchBar from '../Searchbar';
import { getQueryParamsInit } from '../helper';
import InvoiceTable from './Table';

const tabsOptions = [
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'revoked', label: 'Revoked' },
  { value: 'paid', label: 'Paid' },
];

export default function Invoices() {
  const [queryParams, setQueryParams] = useState(getQueryParamsInit());
  const [currentTab, setCurrentTab] = useState('unpaid');

  return (
    <Box>
      <StyledTabs2 value={currentTab} options={tabsOptions} onChange={setCurrentTab} />
      <Box paddingTop="30px" paddingBottom="30px">
        <SearchBar queryParams={queryParams} setQueryParams={setQueryParams} />
      </Box>
      <TabPanel noPadding index="unpaid" value={currentTab}>
        <InvoiceTable rows={data} />
      </TabPanel>
      <TabPanel noPadding index="overdue" value={currentTab}>
        <InvoiceTable rows={data} />
      </TabPanel>
      <TabPanel noPadding index="revoked" value={currentTab}>
        <InvoiceTable rows={data} />
      </TabPanel>
      <TabPanel noPadding index="paid" value={currentTab}>
        <InvoiceTable rows={data} />
      </TabPanel>
    </Box>
  );
}
