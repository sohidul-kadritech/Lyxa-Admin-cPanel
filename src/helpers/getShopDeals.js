export const getShopDeals = (shop) => {
  const deals = {
    free_delivery: false,
    reward: false,
    double_menu: {
      products_count: 0,
      isEntireMenu: false,
    },
    percentage: {
      values: [],
      isEntireMenu: false,
    },
  };

  shop?.marketings.forEach((obj) => {
    if (obj?.type === 'reward' && obj?.isActive) deals.reward = true;
    if (obj?.type === 'free_delivery' && obj?.isActive) deals.free_delivery = true;

    if (obj?.type === 'double_menu' && obj?.isActive) {
      if (shop?.products?.length === obj?.products?.length) deals.double_menu.isEntireMenu = true;
      deals.double_menu.products_count = obj?.products?.length;
    }

    if (obj?.type === 'percentage' && obj?.isActive) {
      if (shop?.products?.length === obj?.products?.length) deals.percentage.isEntireMenu = true;
      deals.percentage.values = [...(obj?.discountPercentages || [])];
    }
  });

  const get_Doubble_Menu_Percentage_Str = (deals) => {
    let str = '';
    console.log(deals);

    if (deals?.double_menu?.products_count > 0) {
      if (deals?.double_menu?.isEntireMenu) {
        return '2x deals on entrie menus';
      }
      str += '2x deals';
    }

    if (deals?.percentage?.values?.length) {
      if (deals?.percentage?.isEntireMenu) {
        return `${deals?.percentage?.values?.map(
          (item, index, array) => `${item}% ${index === array.length - 1 ? '' : ','}`
        )} off on entire menu`;
      }

      str += `${str ? ', ' : ''} ${deals?.percentage?.values
        ?.map((item, index, array) => `${item}%${index === array.length - 1 ? '' : ','} `)
        .join('')} off`;
    }

    if (str) {
      str += ' on selected items';
    }

    return str;
  };

  deals.doubbleMenuPercentageStr = get_Doubble_Menu_Percentage_Str(deals);

  return deals;
};
