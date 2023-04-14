export class ShopDeals {
  constructor(shop) {
    this.deals = this.get_shop_deals(shop);
  }

  get_shop_deals(shop) {
    const deals = {
      free_delivery: false,
      reward: {
        isEntireMenu: false,
        isActive: false,
      },
      double_menu: {
        isActive: false,
        isEntireMenu: false,
      },
      percentage: {
        discountPercentages: [],
        isEntireMenu: false,
        isActive: false,
      },
      hasActiveDeal: false,
    };

    shop?.marketings.forEach((obj) => {
      if (obj?.type === 'free_delivery' && obj?.isActive) {
        deals.free_delivery = true;
        deals.hasActiveDeal = true;
      } else {
        deals[obj?.type].isActive = obj?.isActive;
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
        return `${temp}on entrie menu`;
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

  // get_promotion_str() {
  //   let str = '';

  //   if (this.deals.reward.isActive) {
  //     if (this.deals.reward.isEntireMenu) {
  //       return 'Ongoing Reawrd Promotion';
  //     }
  //     str += 'Reward';
  //   }

  //   if (this.deals.double_menu.isActive) {
  //     if (this.deals.double_menu.isEntireMenu) {
  //       return 'Ongoing 2x Promotion';
  //     }
  //     str += str ? ', ' : '';
  //     str += '2x Deals';
  //   }

  //   if (this.deals.percentage.isActive) {
  //     let temp = '';

  //     this.deals.percentage?.discountPercentages?.forEach((e, i, { length }) => {
  //       temp += `${e}%${i === length - 1 ? '' : ', '}`;
  //     });

  //     if (this.deals.percentage.isEntireMenu) {
  //       return `Ongoing ${temp} off Promotion`;
  //     }

  //     str += str ? ', ' : '';
  //     str += `${temp} off`;
  //   }

  //   if (this.deals.free_delivery) {
  //     if (!str) {
  //       return `Ongoing Free Delivery Promotion`;
  //     }
  //     str += ', Free Delivery';
  //   }

  //   return `Ongoing ${str} Promotion`;
  // }

  get_promotion_str() {
    const freeDelivery = this.deals.free_delivery;
    let other = false;

    if (this.deals.reward.isActive) {
      if (this.deals.reward.isEntireMenu && !freeDelivery) {
        return 'Ongoing Reawrd Promotion';
      }
      other = true;
    }

    if (this.deals.double_menu.isActive) {
      if (this.deals.double_menu.isEntireMenu && !freeDelivery) {
        return 'Ongoing 2x Deals Promotion';
      }
      other = true;
    }

    if (this.deals.percentage.isActive) {
      if (this.deals.percentage.isEntireMenu && !freeDelivery) {
        let temp = '';

        this.deals.percentage?.discountPercentages?.forEach((e, i, { length }) => {
          temp += `${e}%${i === length - 1 ? '' : ', '}`;
        });

        return `Ongoing ${temp} off Promotion`;
      }

      other = true;
    }

    if (freeDelivery && !other) {
      return `Ongoing Free Delivery Promotion`;
    }

    return other ? 'Ongoing Promotion' : '';
  }
}
