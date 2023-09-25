export class ShopDeals {
  constructor(shop) {
    this.deals = this.get_shop_deals(shop);
  }

  get_shop_deals(shop) {
    console.log('shop', shop);
    const deals = {
      free_delivery: false,
      free_deliveryCreator: '',
      reward: {
        isEntireMenu: false,
        isActive: false,
      },
      double_menu: {
        isActive: false,
        isEntireMenu: false,
        createdBy: '',
      },
      percentage: {
        discountPercentages: [],
        isEntireMenu: false,
        isActive: false,
        createdBy: '',
      },
      featured: false,
      hasActiveDeal: false,
    };

    shop?.marketings?.forEach((obj) => {
      if (obj?.type === 'free_delivery') {
        deals.free_delivery = obj?.isActive;
        deals.free_deliveryCreator = obj?.creatorType;
        deals.hasActiveDeal = obj?.isActive || deals.hasActiveDeal;
      } else if (obj?.type === 'featured') {
        deals.featured = obj?.isActive;
        deals.hasActiveDeal = obj?.isActive || obj?.isActive;
      } else {
        deals[obj?.type].isActive = obj?.isActive;
        deals[obj?.type].createdBy = obj?.creatorType;
        deals[obj?.type].isEntireMenu = obj?.itemSelectionType === 'multiple';

        if (obj?.type === 'percentage') {
          deals.percentage.discountPercentages = [...(obj?.discountPercentages || [])];
        }

        if (deals[obj?.type].isActive) {
          deals.hasActiveDeal = true;
        }
      }
    });

    return deals;
  }

  get_double_percentage_str() {
    let str = '';

    if (this.deals.double_menu.isActive) {
      if (this.deals.double_menu.isEntireMenu) {
        return '2x deals on entrie menus';
      }
      str += '2x deals';
    }

    if (this.deals.percentage.isActive) {
      let temp = '';

      this.deals.percentage?.discountPercentages?.forEach((e, i, { length }) => {
        temp += `${e}%${i === length - 1 ? '' : ','} `;
      });

      if (this.deals.percentage.isEntireMenu) {
        return `${temp}on entire menu`;
      }

      str += str ? ', ' : '';
      str += `${temp}off`;
    }

    return `${str}${str ? ' on selected items' : ''} `;
  }

  get_double_percentage_reward_str() {
    let str = '';

    if (this.deals.reward.isActive) {
      if (this.deals.reward.isEntireMenu) {
        return 'Reward on entire menu';
      }
      str += 'Reward';
    }

    const tmp = this.get_double_percentage_str();

    return `${str}${tmp ? `, ${tmp}` : ' on selected items'}`;
  }

  get_promotion_str() {
    let str = '';

    if (this.deals.reward.isActive) {
      if (this.deals.reward.isEntireMenu) {
        return 'Ongoing Reawrd Promotion';
      }
      str += 'Reward';
    }

    if (this.deals.double_menu.isActive) {
      const { createdBy } = this.deals.double_menu;
      if (this.deals.double_menu.isEntireMenu) {
        return `Ongoing 2x Promotion (${createdBy})`;
      }
      str += str ? ', ' : '';
      str += `2x Deals (${createdBy})`;
    }

    if (this.deals.percentage.isActive) {
      let temp = '';

      this.deals.percentage?.discountPercentages?.forEach((e, i, { length }) => {
        temp += `${e}%${i === length - 1 ? '' : ', '}`;
      });

      if (this.deals.percentage.isEntireMenu) {
        return `Ongoing ${temp} off Promotion`;
      }

      str += str ? ', ' : '';
      str += `${temp} off`;
    }

    if (this.deals.free_delivery) {
      const { free_deliveryCreator } = this.deals;
      if (!str) {
        return `Ongoing Free Delivery Promotion (${free_deliveryCreator})`;
      }
      str += `, Free Delivery (${free_deliveryCreator})`;
    }

    if (this.deals.featured) {
      if (!str) {
        return `Ongoing Featured Promotion`;
      }
      str += ', Featured';
    }

    return `Ongoing ${str} Promotion`;
  }

  // get_promotion_str() {
  //   const freeDelivery = this.deals.free_delivery;
  //   let other = false;

  //   if (this.deals.reward.isActive) {
  //     if (this.deals.reward.isEntireMenu && !freeDelivery) {
  //       return 'Ongoing Reawrd Promotion';
  //     }
  //     other = true;
  //   }

  //   if (this.deals.double_menu.isActive) {
  //     if (this.deals.double_menu.isEntireMenu && !freeDelivery) {
  //       return 'Ongoing 2x Deals Promotion';
  //     }
  //     other = true;
  //   }

  //   if (this.deals.percentage.isActive) {
  //     if (this.deals.percentage.isEntireMenu && !freeDelivery) {
  //       let temp = '';

  //       this.deals.percentage?.discountPercentages?.forEach((e, i, { length }) => {
  //         temp += `${e}%${i === length - 1 ? '' : ', '}`;
  //       });

  //       return `Ongoing ${temp} off Promotion`;
  //     }

  //     other = true;
  //   }

  //   if (freeDelivery && !other) {
  //     return `Ongoing Free Delivery Promotion`;
  //   }

  //   return other ? 'Ongoing Promotion' : '';
  // }
}
