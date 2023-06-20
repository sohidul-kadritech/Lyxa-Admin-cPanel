import moment from 'moment';

export const marketingSpentTypeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Shop', value: 'shop' },
  { label: 'Lyxa', value: 'admin' },
];

export const dateRangeItit = {
  end: moment().format('YYYY-MM-DD'),
  start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
};

export function calculateDateDifference(date1, date2, unit) {
  const momentDate1 = moment(date1);
  const momentDate2 = moment(date2);
  const difference = momentDate2.diff(momentDate1, unit);
  return difference;
}

export const getMarketingTypeValues = (marketingType, summary = {}) => {
  const marketingSpentValues = {
    totalDiscount: 0,
    totalDoubleMenuItemPrice: 0,
    totalRewardAmount: 0,
    freeDeliveryShopCut: 0,
    totalFeaturedAmount: 0,
    sum: 0,
  };

  if (marketingType === 'all') {
    marketingSpentValues.totalDiscount = summary?.orderValue?.totalDiscount;
    marketingSpentValues.totalDoubleMenuItemPrice = summary?.orderValue?.totalDoubleMenuItemPrice;
    marketingSpentValues.totalRewardAmount = summary?.orderValue?.totalRewardAmount;
    marketingSpentValues.freeDeliveryShopCut = summary?.freeDeliveryCut;
    marketingSpentValues.totalFeaturedAmount = summary?.totalFeaturedAmount;
  }

  if (marketingType === 'shop') {
    marketingSpentValues.totalDiscount = summary?.orderValue?.totalShopDiscount;
    marketingSpentValues.totalDoubleMenuItemPrice = summary?.orderValue?.totalShopDoubleMenuItemPrice;
    marketingSpentValues.totalRewardAmount = summary?.orderValue?.totalShopRewardAmount;
    marketingSpentValues.freeDeliveryShopCut = summary?.freeDeliveryShopCut;
    marketingSpentValues.totalFeaturedAmount = summary?.totalFeaturedAmount;
  }

  if (marketingType === 'admin') {
    marketingSpentValues.totalDiscount = summary?.orderValue?.totalAdminDiscount;
    marketingSpentValues.totalDoubleMenuItemPrice = summary?.orderValue?.totalAdminDoubleMenuItemPrice;
    marketingSpentValues.totalRewardAmount = summary?.orderValue?.totalAdminRewardAmount;
    marketingSpentValues.freeDeliveryShopCut = summary?.freeDeliveryDropCut;
  }

  marketingSpentValues.sum =
    marketingSpentValues.totalDiscount +
    marketingSpentValues.totalDoubleMenuItemPrice +
    marketingSpentValues.totalRewardAmount +
    marketingSpentValues.freeDeliveryShopCut +
    marketingSpentValues.totalFeaturedAmount;

  return marketingSpentValues;
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