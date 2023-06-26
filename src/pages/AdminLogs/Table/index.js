import { Box, Stack, Typography, useTheme } from '@mui/material';
import { isNaN } from 'lodash';
import React from 'react';
import TablePagination from '../../../components/Common/TablePagination';
import StyledTable from '../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../context';
import { allColumns } from './helpers';

function AdminLogsTable({ data, loading, queryParams, setQueryParams, totalPage }) {
  const theme = useTheme();

  const { general } = useGlobalContext();

  const { currency } = general;

  const getValue = (type, value) => {
    let newValue = null;
    if (!value || value.length <= 0) {
      newValue = 0;
    } else if (type === 'currency') {
      newValue = `${value?.code} (${value?.symbol})`;
    } else if (type === 'adminCutForReward') {
      newValue = value;
    } else if (type === 'minSpendLimit') {
      newValue = value;
    } else if (type === 'expiration_period') {
      newValue = value;
    } else if (type === 'rewardCategory') {
      newValue = (
        <Stack gap="4px" padding="8px 0px">
          {value.map((item) => (
            <Typography variant="body4" key={item}>
              {item.name}
            </Typography>
          ))}
        </Stack>
      );
    } else if (type === 'redeemReward') {
      newValue = (
        <Stack gap="4px" padding="16px 0px">
          <Typography variant="body4">
            amount: {currency?.symbol}
            {value.amount}
          </Typography>
          <Typography variant="body4">points: {value.points}</Typography>
        </Stack>
      );
    } else if (type === 'getReward') {
      newValue = (
        <Stack gap="4px" padding="16px 0px">
          <Typography variant="body4">
            amount: {currency?.symbol}
            {value.amount}
          </Typography>
          <Typography variant="body4">points: {value.points}</Typography>
        </Stack>
      );
    } else if (type === 'maxCustomerServiceValue' || type === 'maxTotalEstItemsPriceForButler') {
      newValue = `${currency?.symbol}${value}`;
    } else if (type === 'nearByShopKm' || type === 'nearByShopKmForUserHomeScreen' || type === 'maxDistanceForButler') {
      newValue = `${value}km`;
    } else if (type === 'rewardBundle') {
      newValue = (
        <Stack gap="4px" padding="8px 0px">
          {value.map((item) => (
            <Typography variant="body4" key={item}>
              {item}
            </Typography>
          ))}
        </Stack>
      );
    } else if (type === 'maxDiscount') {
      newValue = (
        <Stack gap="4px" padding="16px 0px">
          {value.map((item) => (
            <Typography variant="body4" key={item}>
              {item}%
            </Typography>
          ))}
        </Stack>
      );
    } else if (type === 'searchDeliveryBoyKm') {
      newValue = (
        <Stack gap="4px" padding="16px 0px">
          {value.map((item) => (
            <Typography variant="body4" key={item}>
              {item} km
            </Typography>
          ))}
        </Stack>
      );
    } else if (type === 'specificSellerDropCharge') {
      newValue = (
        <Typography variant="body4">{`${value?.value?.dropPercentage ?? 0}${'%'} ${
          value?.seller?.company_name ? `(${value?.seller?.company_name})` : ''
        }`}</Typography>
      );
    } else if (type === 'globalDropCharge' || type === 'sellerDropChargeReset') {
      newValue = (
        <Typography variant="body4">{`${value?.dropPercentage ?? 0}${
          '%'
          // value?.dropPercentageType === 'parcentage' ? '%' : currency?.symbol
        }`}</Typography>
      );
    } else if (
      type === 'globalDeliveryCut' ||
      type === 'specificSellerDeliveryCut' ||
      type === 'globalDeliveryCutForButler'
    ) {
      newValue = (
        <Stack gap="4px" padding="16px 0px">
          {value.map((item) => (
            <Typography
              key={`${item?.from}_${item?.to}`}
              variant="body4"
              // eslint-disable-next-line max-len
            >{`(${item?.from} - ${item?.to} km) - charge: ${currency?.symbol}${item?.charge} rider: ${currency?.symbol}${item?.deliveryPersonCut}`}</Typography>
          ))}
        </Stack>
      );
    } else if (
      (typeof value === 'string' || typeof value === 'number') &&
      value !== undefined &&
      !isNaN(value) &&
      value !== null &&
      value !== 'undefined' &&
      value !== 'null'
    ) {
      console.log('value:', value, ' type: ', typeof value);
      if (value) {
        newValue = value;
      } else newValue = 0;
    } else {
      newValue = 0;
    }
    return newValue;
  };

  return (
    <>
      <Box
        sx={{
          maxHeight: '480px',
          overflow: 'auto',
          position: 'relative',
          border: `1px solid ${theme.palette.custom.border}`,
          borderRadius: '7px',
          top: 0,
        }}
      >
        <Box
          sx={{
            padding: '7.5px 16px  2px',
          }}
        >
          <StyledTable
            columns={allColumns(getValue)}
            rows={data || []}
            getRowId={(row) => row?._id}
            getRowHeight={() => 'auto'}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                position: 'sticky',
                top: '-2px',
                backgroundColor: theme?.palette?.primary?.contrastText,
                zIndex: theme.zIndex.mobileStepper - 1,
              },
              '& .MuiDataGrid-virtualScroller': {
                marginTop: '0 !important',
              },
              '& .MuiDataGrid-main': {
                overflow: 'visible',
              },
              '& .MuiDataGrid-cell': {
                cursor: 'default',
              },
            }}
            components={{
              NoRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  {loading ? 'Loading...' : 'No Logs Found'}
                </Stack>
              ),
            }}
          />
        </Box>
      </Box>
      <TablePagination
        currentPage={queryParams?.page}
        lisener={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={totalPage}
      />
    </>
  );
}

export default AdminLogsTable;
