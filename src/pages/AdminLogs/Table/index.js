import { Box, Stack, Typography, useTheme } from '@mui/material';
import { isNaN } from 'lodash';
import React from 'react';
import TablePagination from '../../../components/Common/TablePagination';
import StyledTable from '../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../context';
import { allColumns } from './helpers';

// eslint-disable-next-line no-unused-vars
function AdminLogsTable({ data, loading, queryParams, setQueryParams, totalPage }) {
  const theme = useTheme();

  const { general } = useGlobalContext();
  // eslint-disable-next-line no-unused-vars
  const { currency } = general;

  const getValue = (type, value) => {
    // const state = store.getState();

    // const currency = state.settingsReducer.appSettingsOptions.currency.code.toUpperCase();

    let newValue = null;
    if (!value || value.length <= 0) {
      newValue = 0;
    } else if (type === 'currency') {
      newValue = value?.symbol;
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
          <Typography variant="body4">amount: {value.amount}</Typography>
          <Typography variant="body4">points: {value.points}</Typography>
        </Stack>
      );
    } else if (type === 'getReward') {
      newValue = (
        <Stack gap="4px" padding="16px 0px">
          <Typography variant="body4">amount: {value.amount}</Typography>
          <Typography variant="body4">points: {value.points}</Typography>
        </Stack>
      );
    } else if (type === 'maxDiscount' || type === 'maxCustomerServiceValue' || type === 'nearByShopKm') {
      newValue = value;
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
    } else if (type === 'searchDeliveryBoyKm') {
      newValue = (
        <Stack gap="4px" padding="16px 0px">
          {value.map((item) => (
            <Typography variant="body4" key={item}>
              {item}KM
            </Typography>
          ))}
        </Stack>
      );
    } else if (type === 'globalDropCharge' || type === 'specificSellerDropCharge' || type === 'sellerDropChargeReset') {
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
            >{`(${item?.from} - ${item?.to} km)- charge:${item?.charge} rider:${item?.deliveryPersonCut}`}</Typography>
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
    <Box>
      <Box
        sx={{
          padding: '7.5px 16px  2px',
          maxHeight: '480px',
          overflow: 'auto',
          border: `1px solid ${theme.palette.custom.border}`,
          borderRadius: '7px',
        }}
      >
        <StyledTable
          columns={allColumns(getValue)}
          rows={data || []}
          getRowId={(row) => row?._id}
          //   rowHeight={72}
          getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              cursor: 'pointer',
            },
            //   '& .MuiDataGrid-row:hover': {
            //     backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
            //   },
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

      <TablePagination
        currentPage={queryParams?.page}
        lisener={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={totalPage}
      />
    </Box>
  );
}

export default AdminLogsTable;
