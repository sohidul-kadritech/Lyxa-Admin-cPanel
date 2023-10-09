import { Stack, Typography } from '@mui/material';
import { isNaN } from 'lodash';
import moment from 'moment';
import { getTypeName } from '../helpers';

export const getValue = (type, value, currency) => {
  let newValue = null;
  if (!value || value.length <= 0) {
    newValue = 0;
  } else if (type === 'currency' || type === 'secondaryCurrency') {
    newValue = value?.code ? `${value?.code} (${value?.symbol})` : 0;
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
  } else if (type === 'rewardBundle' || type === 'units') {
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
    console.log('maxDiscount', value);
    newValue = <Typography variant="body4">{value}</Typography>;
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

export const allColumns = (getValue, currency, secondaryCurrency) => [
  {
    id: 1,
    headerName: `TYPE`,
    field: 'type',
    sortable: false,
    flex: 1,
    renderCell: ({ row }) => (
      <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
        <Typography
          variant="body4"
          sx={{
            fontSize: '15px',
            fontWeight: '500',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {getTypeName(row?.type, secondaryCurrency)}
        </Typography>
      </Stack>
    ),
  },
  {
    id: 2,
    headerName: `OLD VALUE`,
    field: 'old_value',
    sortable: false,
    flex: 1.5,
    renderCell: ({ row }) => (
      <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
        <Typography
          variant="body4"
          sx={{
            fontSize: '15px',
            fontWeight: '500',
            textTransform: 'capitalize',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row?.type === 'specificSellerDropCharge'
            ? getValue(row?.type, { ...row, value: row?.oldValue, seller: undefined }, currency)
            : getValue(row?.type, row?.oldValue, currency)}
        </Typography>
      </Stack>
    ),
  },
  {
    id: 3,
    headerName: `NEW VALUE`,
    field: 'new_value',
    sortable: false,
    flex: 1.5,
    renderCell: ({ row }) => (
      <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
        <Typography
          variant="body4"
          sx={{
            fontSize: '15px',
            fontWeight: '500',
            textTransform: 'capitalize',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row?.type === 'specificSellerDropCharge'
            ? getValue(row?.type, { ...row, value: row?.newValue }, currency)
            : getValue(row?.type, row?.newValue, currency)}
        </Typography>
      </Stack>
    ),
  },
  {
    id: 3,
    headerName: `ADMIN`,
    field: 'admin_name',
    sortable: false,
    flex: 1,
    renderCell: ({ row }) => (
      <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
        <Typography
          variant="body4"
          sx={{
            fontSize: '15px',
            fontWeight: '500',
            textTransform: 'capitalize',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row?.admin?.name}
        </Typography>
      </Stack>
    ),
  },
  {
    id: 4,
    headerName: `CREATION DATE`,
    field: 'date',
    sortable: false,
    headerAlign: 'right',
    align: 'right',
    flex: 1,
    renderCell: ({ row }) => (
      <Stack gap={1.5} sx={{ padding: '16px 0px' }}>
        <Typography variant="body4">{moment(row?.createdAt)?.format('MMM DD, YYYY')}</Typography>
        <Typography variant="inherit" fontSize={12} lineHeight="15px" fontWeight={500} color="#737373">
          {moment(row?.createdAt)?.format('hh:mm A')}
        </Typography>
      </Stack>
    ),
  },
];
