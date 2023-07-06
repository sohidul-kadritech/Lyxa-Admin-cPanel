import { Box, Button, Drawer, Stack, Typography } from '@mui/material';
import jsPDF from 'jspdf';
import moment from 'moment';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { ReactComponent as DownloadIcon } from '../../../assets/icons/download-icon-2.svg';
import PageTop from '../../../components/Common/PageTop';
import StyledFormField from '../../../components/Form/StyledFormField';
import StyledSearchBar from '../../../components/Styled/StyledSearchBar';
import DateRange from '../../../components/StyledCharts/DateRange';
import { useGlobalContext } from '../../../context';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { AddMenuButton } from '../../Faq2';
import { sortOptions } from '../../Faq2/helpers';
import TablePageSkeleton from '../../Notification2/TablePageSkeleton';
import { dateRangeInitFinancial } from '../ForSeller/helpers';
import AddRemoveCredit from './AddRemoveCredit';
import AccountTable from './Table';

const breadcrumbItems = [
  {
    label: 'Financials',
    to: '/financials',
  },
  {
    label: 'For Accounts',
    to: '#',
  },
];
function AccountFinancials() {
  const [range, setRange] = useState({ ...dateRangeInitFinancial });
  const { general } = useGlobalContext();
  // eslint-disable-next-line import/no-named-as-default

  const currency = general?.currency?.symbol;
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [searchKey, setSearchKey] = useState('');

  const [sortBy, setSortBy] = useState('desc');
  const [storeAppSettings, setStoreAppSettings] = useState({});

  const getDashboardSummary = useQuery(
    [API_URL.GET_DASHBOARD_SUMMARY, { searchKey, sortBy, startDate: range.start, endDate: range.end }],
    () =>
      AXIOS.get(API_URL.GET_DASHBOARD_SUMMARY, {
        params: { startDate: range.start, endDate: range.end },
        // eslint-disable-next-line prettier/prettier
      }),
  );

  console.log(getDashboardSummary?.data?.data?.summary);

  const getDropPayList = useQuery(
    [API_URL.DROP_PAY_LIST, { searchKey, sortBy, startDate: range.start, endDate: range.end }],
    () =>
      AXIOS.get(API_URL.DROP_PAY_LIST, {
        params: { pageSize: 50, searchKey, sortBy, startDate: range.start, endDate: range.end },
        // eslint-disable-next-line prettier/prettier
      }),
  );

  const getAppSettingsData = useQuery([API_URL.APP_SETTINGS], () => AXIOS.get(API_URL.APP_SETTINGS), {
    onSuccess: (data) => {
      if (data.status) {
        setStoreAppSettings({ ...getAppSettingsData?.data?.data?.appSetting });
      }
    },
  });

  // GENERATE PDF
  const downloadPdf = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'portrait'; // portrait or landscape

    // eslint-disable-next-line new-cap
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = `Delivery Boys Transactions`;
    const headers = [['Name', 'Amount', 'E-mail', 'Deposit by', 'Date']];
    const marginLeft = 40;

    const data = getDropPayList?.data?.data?.transactionList.map((trx) => [
      trx?.user?.name,
      trx?.amount ?? 0,
      trx?.user?.email,
      trx?.type === 'userPayAfterReceivedOrderByCard' ? 'Card' : 'Lyxa',
      `${moment(trx?.createdAt)?.format('MMM DD, YYYY')}, ${moment(trx?.createdAt)?.format('hh:mm A')}`,
      // trx?.summary?.riderEarning,
      // trx?.summary.totalCashInHand,
      // trx?.summary.settleAmount,
    ]);

    console.log('===>data', data);
    const content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(`userTransaction.pdf`);
  };
  return (
    <Box>
      <PageTop
        backButtonLabel="Back to Financials"
        breadcrumbItems={breadcrumbItems}
        backTo="/financials"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />
      <Stack direction="row" justifyContent="end" gap="17px" flexWrap="wrap" sx={{ marginBottom: '30px' }}>
        <Typography variant="h6" sx={{ fontSize: '15px', fontWeight: '600', color: 'text.secondary2' }}>
          Balance Amount: {currency}
          {getDashboardSummary?.data?.data?.summary?.totalDropEarning || 0}
        </Typography>
      </Stack>
      <Box>
        <Stack direction="row" justifyContent="start" gap="17px" flexWrap="wrap" sx={{ marginBottom: '30px' }}>
          <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />
          <DateRange range={range} setRange={setRange} />
          <StyledFormField
            intputType="select"
            containerProps={{
              sx: { padding: '0px 0px' },
            }}
            inputProps={{
              name: 'sortBy',
              placeholder: 'sortBy',
              value: sortBy,
              items: sortOptions,
              size: 'sm2',
              //   items: categories,
              onChange: (e) => setSortBy(e.target.value),
            }}
          />
          <Box flexShrink={0}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => {
                setOpen(true);
              }}
            >
              Add/Remove Credit
            </Button>
          </Box>

          <AddMenuButton
            sx={{
              flexShrink: 0,
            }}
            title="Download"
            icon={<DownloadIcon />}
            onClick={() => {
              downloadPdf();
            }}
          />
        </Stack>
      </Box>

      <Box sx={{ marginBottom: '30px' }}>
        {getDropPayList?.isLoading ? (
          <TablePageSkeleton row={8} column={5} />
        ) : (
          <AccountTable loading={getDropPayList?.isLoading} data={getDropPayList?.data?.data?.transactionList} />
        )}
      </Box>
      <Drawer open={open} anchor="right">
        <AddRemoveCredit storeAppSettings={storeAppSettings} onClose={() => setOpen(false)} />
      </Drawer>
    </Box>
  );
}

export default AccountFinancials;
