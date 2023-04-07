export const getShopDeals = (categoryItems, details, symble = '$') => {
  const result = [];
  let double_deal_Count = 0;
  let total_Product_Count = 0;
  let percentage_Count = 0;
  const percentageHolder = [];

  categoryItems?.forEach((item) => {
    item?.data?.forEach((child) => {
      total_Product_Count++;
      if (child?.marketing?.isActive) {
        if (child?.marketing?.type === 'double_menu') {
          double_deal_Count++;
        } else if (child?.marketing?.type === 'percentage') {
          percentage_Count++;
          const checkDuplicate = percentageHolder.includes(child?.discountPercentage);
          if (!checkDuplicate) {
            percentageHolder.push(child?.discountPercentage);
          }
        }
      }
    });
  });
  if (double_deal_Count) {
    if (double_deal_Count === total_Product_Count) {
      result.push({
        first: `Buy 1 Get 1`,
        second: details?.maxDiscount > 0 ? ` up to ${symble}${details?.maxDiscount}` : '',
      });
    } else {
      result.push({
        first: 'Buy 1 Get 1',
        second: details?.maxDiscount > 0 ? ` up to ${symble}${details?.maxDiscount}` : undefined,
        third: ` on selected items`,
      });
    }
  }
  if (percentage_Count) {
    percentageHolder?.forEach((item) => {
      if (percentageHolder?.length === 1 && percentage_Count === total_Product_Count) {
        result.push({
          first: `${item}% off`,
          second: details?.maxDiscount > 0 ? ` up to ${symble}${details?.maxDiscount}` : undefined,
        });
      } else {
        result.push({
          first: `${item}% off`,
          second: details?.maxDiscount > 0 ? ` up to ${symble}${details?.maxDiscount}` : undefined,
          third: ` on selected items`,
        });
      }
    });
  }
  return result;
};
