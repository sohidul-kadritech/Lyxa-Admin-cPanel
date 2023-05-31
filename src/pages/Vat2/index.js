import { Box, Button, Modal, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import StyledFormField from '../../components/Form/StyledFormField';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import DateRange from '../../components/StyledCharts/DateRange';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { AddMenuButton } from '../Faq2';
import { dateRangeInit, sortOptions } from '../Faq2/helpers';
import ModalContainer from '../ServiceZone/ModalContainer';
import { calculatePaidVat, getAllAdminOptions, vatTrxsAmountFilterOptions } from './helpers';
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
  const [range2, setRange2] = useState({ ...dateRangeInit });
  const { currentUser } = useGlobalContext();
  console.log(currentUser);
  const [sort, setSort] = useState('asc');
  // eslint-disable-next-line no-unused-vars
  const [amountRange, setAmountRange] = useState(0);

  const [amountRangeType, setAmountRangeType] = useState('');
  const [searchKey, setSearchKey] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [settleAmount, setSettleAmount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [adminId, setAdminId] = useState();
  const [open, setOpen] = useState(false);
  const getCurrentCurrency = JSON.parse(localStorage.getItem('currency'));
  const theme = useTheme();
  // get all admins here
  const getAllAdminQuery = useQuery([API_URL.GET_ALL_ADMIN], () => AXIOS.get(API_URL.GET_ALL_ADMIN));

  const getAllTransaction = useQuery(
    [
      API_URL.GET_ALL_ADMIN_VAT,
      {
        searchKey,
        startDate: range.start,
        endDate: range.end,
        sort,
        adminId,
        amountRange,
        amountRangeType,
      },
    ],
    () =>
      AXIOS.post(API_URL.GET_ALL_ADMIN_VAT, {
        tnxFilter: {
          adminBy: adminId,
          type: ['VatAmountSettleByAdmin'],
          searchKey,
          amountBy: sort,
          amountRange: amountRange || 0,
          amountRangeType,
          startDate: range.start,
          endDate: range.end,
        },
        // eslint-disable-next-line prettier/prettier
      }),
  );

  // pay vat
  // eslint-disable-next-line no-unused-vars
  const payVatQuery = useMutation((data) => AXIOS.post(API_URL.SETTLE_ADMIN_VAT, data));

  console.log(getAllTransaction?.data?.data?.summary);
  console.log(getAllTransaction?.data?.data?.transactions);
  console.log(getAllAdminQuery?.data?.data);

  // eslint-disable-next-line no-unused-vars
  const payVat = () => {
    if (new Date(range.start).getTime() > new Date(range.end).getTime()) {
      successMsg('Start date cannot be greater than end date', 'error');
      return;
    }
    if (settleAmount < 1) {
      successMsg('Please enter valid amount', 'error');
      return;
    }
    if (settleAmount > getAllTransaction?.data?.data?.summary?.totalUnsettleVat) {
      successMsg('Can not pay more than unpaid amount', 'error');
      return;
    }

    const reqBody = {
      amount: settleAmount,
      startDate: range.start,
      endDate: range.end,
    };

    payVatQuery.mutate(reqBody);
  };
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
        <Stack
          direction="row"
          justifyContent="start"
          flexWrap="wrap"
          alignItems="center"
          gap="17px"
          sx={{ marginBottom: '30px' }}
        >
          <StyledSearchBar
            sx={{ flex: '1' }}
            placeholder="Search by ID"
            onChange={(e) => setSearchKey(e.target.value)}
          />
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
            intputType="text"
            containerProps={{
              sx: {
                padding: '0px 0px',
                '& .MuiInputBase-root': {
                  height: '20px',
                  width: '150px',
                  background: theme.palette.background.secondary,
                },
                '& input': {
                  paddingTop: '7.5px',
                  paddingBottom: '7.5px',
                  fontWeight: '500',
                  borderRadius: '30px',
                  background: theme.palette.background.secondary,
                },
              },
            }}
            inputProps={{
              name: 'amount_range',
              type: 'number',
              placeholder: 'Amount Range',
              value: amountRange,
              size: 'sm2',
              //   items: categories,
              onChange: (e) => setAmountRange(e.target.value),
            }}
          />
          <StyledFormField
            intputType="select"
            containerProps={{
              sx: { padding: '0px 0px' },
            }}
            inputProps={{
              name: 'amountType',
              placeholder: 'Ampunt Filter Type',
              value: amountRangeType,
              items: vatTrxsAmountFilterOptions,
              size: 'sm2',
              //   items: categories,
              onChange: (e) => setAmountRangeType(e.target.value),
            }}
          />
          <StyledFormField
            intputType="select"
            containerProps={{
              sx: { padding: '0px 0px' },
            }}
            inputProps={{
              name: 'admin',
              placeholder: 'Admin By',
              value: adminId,
              items: getAllAdminOptions(getAllAdminQuery?.data?.data?.Admins || []),
              size: 'sm2',
              //   items: categories,
              onChange: (e) => setAdminId(e.target.value),
            }}
          />
          <AddMenuButton title="Make Payment" isIcon={false} onClick={() => setOpen(true)} />
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
            <Typography variant="h2">
              {getAllTransaction?.data?.data?.summary?.totalUnsettleVat.toFixed(2) || 0}
            </Typography>
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
            <Typography variant="h2">
              {calculatePaidVat(
                getAllTransaction?.data?.data?.summary?.totalVat,
                // eslint-disable-next-line prettier/prettier
                getAllTransaction?.data?.data?.summary?.totalUnsettleVat,
              ) || 0}
            </Typography>
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
            <Typography variant="h2">{getAllTransaction?.data?.data?.summary?.totalVat}</Typography>
          </Box>
        </Box>
      </Stack>

      <VatList
        data={getAllTransaction?.data?.data?.transactions}
        loading={getAllTransaction?.isLoading}
        getCurrentCurrency={getCurrentCurrency}
      />

      <Modal open={open} centered>
        <ModalContainer
          onClose={() => setOpen(false)}
          title="Pay Vat"
          sx={{
            width: '600px',
            height: 'auto',
            margin: '2vh 2vw',
            padding: '36px',
            overflow: 'auto',
            backgroundColor: theme.palette.primary.contrastText,
            borderRadius: '10px',
          }}
        >
          <Box marginTop="30px">
            <Stack gap="10px">
              <Typography sx={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }} variant="h4">
                Date
              </Typography>
              <DateRange size="md" range={range2} setRange={setRange2} />
            </Stack>
          </Box>
          <Box marginTop="10px">
            <Stack gap="10px">
              <StyledFormField
                label={
                  <Typography sx={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }} variant="h4">
                    Amount
                  </Typography>
                }
                intputType="text"
                containerProps={{
                  sx: {
                    padding: '14px 0px 23px 0',
                    flex: '1',
                  },
                }}
                inputProps={{
                  defaultValue: settleAmount,
                  type: 'number',
                  name: 'zoneName',
                  onChange: (e) => setSettleAmount(e.target.value),
                }}
              />
            </Stack>
          </Box>
          <Box
            marginTop="10px"
            sx={{ paddingBottom: '10px', borderBottom: `1px solid ${theme.palette.custom.border}` }}
          >
            <Stack gap="10px" flexDirection="row" justifyContent="space-between">
              <Typography>Unpaid VAT</Typography>{' '}
              <Typography>
                {getAllTransaction?.data?.data?.summary?.totalUnsettleVat.toFixed(2)} {getCurrentCurrency?.symbol}
              </Typography>
            </Stack>
            <Stack gap="10px" flexDirection="row" justifyContent="space-between">
              <Typography>Amount to pay</Typography>{' '}
              <Typography>
                {-settleAmount} {getCurrentCurrency?.symbol}
              </Typography>
            </Stack>
          </Box>
          <Box marginTop="30px">
            <Stack gap="10px" flexDirection="row" justifyContent="space-between">
              <Typography>Unpaid VAT</Typography>{' '}
              <Typography>
                {calculatePaidVat(getAllTransaction?.data?.data?.summary?.totalUnsettleVat, settleAmount).toFixed(2)}
                {getCurrentCurrency?.symbol}
              </Typography>
            </Stack>
          </Box>

          <Stack flexDirection="row" justifyContent="flex-end" marginTop="30px">
            <Button variant="contained" color="primary" size="small" onClick={payVat}>
              Pay
            </Button>
          </Stack>
        </ModalContainer>
      </Modal>
    </Box>
  );
}

export default Vat2;
