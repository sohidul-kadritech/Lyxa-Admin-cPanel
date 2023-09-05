/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
import { Stack, Typography } from '@mui/material';
import { isNaN } from 'lodash';
import moment from 'moment';
import { getFirstMonday } from '../../Styled/StyledDateRangePicker/Presets';

export const marketingSpentTypeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Shop', value: 'shop' },
  { label: 'Lyxa', value: 'admin' },
];

export const dateRangeItit = {
  end: moment(),
  start: getFirstMonday('week'),
};

export function calculateDateDifference(date1, date2, unit) {
  const momentDate1 = moment(date1);
  const momentDate2 = moment(date2);
  const difference = momentDate2.diff(momentDate1, unit);

  if (isNaN(difference)) return 0;
  return difference;
}

export const getMarketingTypeValues = (marketingType, summary = {}) => {
  console.log('summary', summary);

  const all = summary;
  const admin = all?.admin;
  const shop = all?.shop;

  const marketingSpentValues = {
    all: {
      totalDiscount: all?.discount_all,
      totalDoubleMenuItemPrice: all?.buy1Get1_all,
      totalRewardAmount: all?.loyaltyPoints_all,
      freeDeliveryShopCut: all?.freeDelivery_all,
      totalFeaturedAmount: all?.featuredAmount_all,
      sum: all?.marketingSpent_all,
    },
    shop: {
      totalDiscount: shop?.discount_shop,
      totalDoubleMenuItemPrice: shop?.buy1Get1_shop,
      totalRewardAmount: shop?.loyaltyPoints_shop,
      freeDeliveryShopCut: shop?.freeDelivery_shop,
      totalFeaturedAmount: shop?.featuredAmount_shop,
      sum: shop?.marketingSpent_shop,
    },
    admin: {
      totalDiscount: admin?.discount_admin,
      totalDoubleMenuItemPrice: admin?.buy1Get1_admin,
      totalRewardAmount: admin?.loyaltyPoints_admin,
      freeDeliveryShopCut: admin?.freeDelivery_admin,
      totalFeaturedAmount: admin?.featuredAmount_admin,
      sum: admin?.marketingSpent_admin,
    },
  };

  return marketingSpentValues[marketingType];
};

export function CommonOrderAmountTooltipText({ byAdmin, byShop, currency }) {
  return (
    <ul
      style={{
        padding: '4px 16px',
        marginBottom: '0',
        minWidth: '180px',
      }}
    >
      <li>
        Applied by lyxa {currency} {byAdmin}
      </li>
      <li>
        Applied by shop {currency} {byShop}
      </li>
      <li>
        Total applied {currency} {byAdmin + byShop}
      </li>
    </ul>
  );
}
export function CommonOrderMarketingCashbackTooltipText({ title, listSx, titleSx, value = [], containerSx, typoSx }) {
  return (
    <div style={{ ...(containerSx || {}) }}>
      {title && (
        <p
          style={{
            padding: '4px 16px',
            marginBottom: '0',
            minWidth: '180px',
            ...(titleSx || {}),
          }}
        >
          {title}
        </p>
      )}
      <ul
        style={{
          padding: '4px 16px',
          marginBottom: '0',
          minWidth: '180px',
          ...(listSx || {}),
        }}
      >
        {value.map((data, i) => (
          <li key={i} style={{ ...(typoSx || {}) }}>
            {data.label} {data?.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getTotalProfit = (currency, secondaryCurrency, paymentDetails, showObject = false) => {
  const profitOutput = {};
  const secondaryCurrencyPayout = paymentDetails?.secondaryCurrency_payout;
  const baseCurrencyPayout = paymentDetails?.baseCurrency_payout;
  const totalPayout = paymentDetails?.totalPayout;

  const joinBaseAndSecondaryCurrency = `(${currency} ${(baseCurrencyPayout || 0).toFixed(2)} + 
  ${secondaryCurrency || ''} ${Math.round(secondaryCurrencyPayout || 0)})`;

  const onlyBaseCurrency = `${currency} ${(Math.abs(totalPayout) || 0)?.toFixed(2)}`;

  profitOutput.onlyBaseCurrency = onlyBaseCurrency;
  profitOutput.joinBaseAndSecondaryCurrency = joinBaseAndSecondaryCurrency;
  profitOutput.onlyBaseCurrencyComponent = (
    <Typography variant="body1" fontWeight={600}>
      {onlyBaseCurrency}
    </Typography>
  );

  profitOutput.joinBaseAndSecondaryCurrencyComponent = (
    <Typography variant="body3" fontSize="12px">
      {joinBaseAndSecondaryCurrency}
    </Typography>
  );

  profitOutput.print = secondaryCurrencyPayout ? joinBaseAndSecondaryCurrency : onlyBaseCurrency;
  profitOutput.printConditionally = secondaryCurrencyPayout ? joinBaseAndSecondaryCurrency : '';

  if (showObject) {
    return profitOutput;
  }

  if (secondaryCurrencyPayout) {
    return (
      <Stack direction="row" gap={2} alignItems="center">
        <Typography variant="body3" fontSize="12px">
          {joinBaseAndSecondaryCurrency}
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {onlyBaseCurrency}
        </Typography>
      </Stack>
    );
  }

  return (
    <Typography variant="body1" fontWeight={600}>
      {onlyBaseCurrency}
    </Typography>
  );
};

export const getTotalProfitForLyxa = (currency, secondaryCurrency, paymentDetails = {}, showObject = false) => {
  const profitOutput = {};
  const secondaryCurrencyPayout = paymentDetails?.secondaryCurrency_adminProfit;
  const baseCurrencyPayout = paymentDetails?.baseCurrency_adminProfit;
  const totalPayout = paymentDetails?.totalAdminProfit;

  const joinBaseAndSecondaryCurrency = `(${currency} ${(baseCurrencyPayout || 0).toFixed(2)} + 
  ${secondaryCurrency || ''} ${Math.round(secondaryCurrencyPayout || 0)})`;

  const onlyBaseCurrency = `${currency} ${(Math.abs(totalPayout) || 0)?.toFixed(2)}`;

  profitOutput.onlyBaseCurrency = onlyBaseCurrency;
  profitOutput.joinBaseAndSecondaryCurrency = joinBaseAndSecondaryCurrency;
  profitOutput.onlyBaseCurrencyComponent = (
    <Typography variant="body1" fontWeight={600}>
      {onlyBaseCurrency}
    </Typography>
  );

  profitOutput.joinBaseAndSecondaryCurrencyComponent = (
    <Typography variant="body3" fontSize="12px">
      {joinBaseAndSecondaryCurrency}
    </Typography>
  );

  profitOutput.print = secondaryCurrencyPayout ? joinBaseAndSecondaryCurrency : onlyBaseCurrency;
  profitOutput.printConditionally = secondaryCurrencyPayout ? joinBaseAndSecondaryCurrency : '';

  console.log('profitOutput', profitOutput);

  if (showObject) {
    return profitOutput;
  }

  if (secondaryCurrencyPayout) {
    return (
      <Stack direction="row" gap={2} alignItems="center">
        <Typography variant="body3" fontSize="12px">
          {joinBaseAndSecondaryCurrency}
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {onlyBaseCurrency}
        </Typography>
      </Stack>
    );
  }

  return (
    <Typography variant="body1" fontWeight={600}>
      {onlyBaseCurrency}
    </Typography>
  );
};
