/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
// third party
import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

// project import
import { ReactComponent as BuyIcon } from '../../assets/icons/buy-icon.svg';
import { ReactComponent as DeliveryIcon } from '../../assets/icons/delivery-icon.svg';
import { ReactComponent as DiscountIcon } from '../../assets/icons/discount-icon.svg';
// import { ReactComponent as PromoIcon } from '../../assets/icons/featured-icon.svg';
import { ReactComponent as LoyaltyIcon } from '../../assets/icons/loyalty-icon.svg';
import Wrapper from '../../components/Wrapper';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import MCard from './MarketingCard';
import MSettingsModal from './MSettingsModal';
import MarketingSettings from './Settings';

const activeDealsInit = {
  free_delivery: false,
  percentage: false,
  double_menu: false,
  reward: true,
};

const marketingTypesInit = {
  free_delivery: false,
  double_menu: false,
  percentage: false,
  reward: false,
};

const getApliedDeals = (marketings, currentUserType) => {
  const options = { ...marketingTypesInit };
  marketings?.forEach((item) => {
    console.log(item?.creatorType);
    if (item?.creatorType !== currentUserType) {
      options[item?.type] = true;
    }
  });

  return options;
};

const getActiveDeals = (dealSetting, shopType) => {
  const deals = { ...activeDealsInit };

  dealSetting?.forEach((item) => {
    if (item?.type === shopType || (item?.type === 'restaurant' && shopType === 'food')) {
      item?.option?.forEach((item) => {
        deals[item] = true;
      });
    }
  });

  return deals;
};

export default function Marketing() {
  const history = useHistory();
  const adminShop = useSelector((store) => store.Login.admin);

  const [currentModal, setCurrentModal] = useState(null);
  const [activeDeals, setActiveDeals] = useState(activeDealsInit);
  const { id: shopId } = useParams();
  const [currentShop, setCurrentShop] = useState(adminShop?.shopType ? adminShop : {});

  const [appliedDeals, setAppliedDeals] = useState(marketingTypesInit);

  const shopQuery = useQuery(
    [`single-shop-${shopId}`],
    () =>
      AXIOS.get(Api.SINGLE_SHOP, {
        params: {
          id: shopId,
        },
      }),
    {
      enabled: !adminShop?.shopType,
    }
  );

  const dealSettingsQuery = useQuery(['deal-settings'], () =>
    AXIOS.get(Api.GET_ADMIN_DEAL_SETTINGS, {
      params: {
        type: 'all',
      },
    })
  );

  useEffect(() => {
    if (adminShop?.shopType) {
      setCurrentShop(adminShop);

      const activeDeals = getActiveDeals(dealSettingsQuery?.data?.data?.dealSetting || [], adminShop?.shopType);
      setActiveDeals(activeDeals);

      const appliedDeals = getApliedDeals(adminShop?.marketings, 'shop');
      setAppliedDeals(appliedDeals);
    } else if (shopQuery?.data?.status) {
      setCurrentShop(shopQuery?.data?.data?.shop || {});

      const activeDeals = getActiveDeals(
        dealSettingsQuery?.data?.data?.dealSetting || [],
        shopQuery?.data?.data?.shop?.shopType
      );
      setActiveDeals(activeDeals);

      const appliedDeals = getApliedDeals(shopQuery?.data?.data?.shop?.marketings, 'admin');
      setAppliedDeals(appliedDeals);
    }
  }, [shopQuery?.data?.data?.shop, dealSettingsQuery?.data?.data?.dealSetting]);

  const rewardSettingsQuery = useQuery(
    ['marketing-reward-settings'],
    () =>
      AXIOS.get(Api.GET_MARKETING_SETTINGS, {
        params: {
          shop: currentShop?._id,
          type: 'reward',
          creatorType: adminShop?.shopType ? 'shop' : 'admin',
        },
      }),
    {
      enabled: Boolean(currentShop?._id),
    }
  );

  const discountSettingsQuery = useQuery(
    ['marketing-percentage-settings'],
    () =>
      AXIOS.get(Api.GET_MARKETING_SETTINGS, {
        params: {
          shop: currentShop?._id,
          type: 'percentage',
          creatorType: adminShop?.shopType ? 'shop' : 'admin',
        },
      }),
    {
      enabled: Boolean(currentShop?._id),
    }
  );

  const doubleDealSettingsQuery = useQuery(
    ['marketing-double_menu-settings'],
    () =>
      AXIOS.get(Api.GET_MARKETING_SETTINGS, {
        params: {
          shop: currentShop?._id,
          type: 'double_menu',
          creatorType: adminShop?.shopType ? 'shop' : 'admin',
        },
      }),
    {
      enabled: Boolean(currentShop?._id),
    }
  );

  const freeDeliverySettingsQuery = useQuery(
    ['marketing-free_delivery-settings'],
    () =>
      AXIOS.get(Api.GET_MARKETING_SETTINGS, {
        params: {
          shop: currentShop?._id,
          type: 'free_delivery',
          creatorType: adminShop?.shopType ? 'shop' : 'admin',
        },
      }),
    {
      enabled: Boolean(currentShop?._id),
    }
  );

  const openHandler = (marketingType, marketing) => {
    if (!marketing?.status) {
      setCurrentModal(marketingType);
    } else if (adminShop?.shopType) {
      history.push(`/marketing/dashboard/${marketingType}/${marketing?._id}`);
    } else {
      history.push(`/shops/marketing/dashboard/${currentShop?._id}/${marketingType}/${marketing?._id}`);
    }
  };

  const getPromotionStatus = (mQuery, type) => {
    if (type && !activeDeals[type]) {
      return 'deactivated';
    }

    if (mQuery?.data?.isNotEligible) {
      return mQuery?.data?.status;
    }

    if (mQuery.data?.data?.marketing?.isActive && mQuery.data?.data?.marketing?.status === 'active') {
      return 'ongoing';
    }

    if (!mQuery.data?.data?.marketing?.isActive && mQuery.data?.data?.marketing?.status === 'active') {
      return 'scheduled';
    }

    if (!mQuery.data?.data?.marketing?.isActive && mQuery.data?.data?.marketing?.status === 'inactive') {
      return 'paused';
    }

    return '';
  };

  const G_LOADING =
    // dealSettingsQuery.isLoading ||
    !dealSettingsQuery.isFetchedAfterMount ||
    // discountSettingsQuery.isLoading ||
    !discountSettingsQuery.isFetchedAfterMount ||
    // doubleDealSettingsQuery.isLoading ||
    !doubleDealSettingsQuery.isFetchedAfterMount ||
    // freeDeliverySettingsQuery.isLoading ||
    !freeDeliverySettingsQuery.isFetchedAfterMount ||
    // rewardSettingsQuery.isLoading ||
    !rewardSettingsQuery.isFetchedAfterMount ||
    shopQuery.isLoading;

  console.log(G_LOADING);

  return (
    <Wrapper
      sx={{
        paddingTop: '70px',
        paddingBottom: '60px',
      }}
    >
      <Box sx={{ height: '100%', overflowY: 'scroll', pt: 20, pb: 16 }}>
        <Grid
          container
          spacing={8}
          flexWrap="wrap"
          sx={{
            marginRight: '0px',
          }}
        >
          <Grid md={6} lg={4}>
            <MCard
              description="Provide a percentage discount for specific menu items or categories, allowing customers to save money while ordering their favorite dishes"
              title="Discounted Items"
              icon={DiscountIcon}
              loading={G_LOADING || discountSettingsQuery?.isFetching}
              disabled={appliedDeals.percentage || !activeDeals.percentage}
              status={getPromotionStatus(discountSettingsQuery, 'percentage')}
              ongoingBy={adminShop?.shopType ? 'admin' : 'shop'}
              onOpen={() => {
                if (!appliedDeals.percentage && activeDeals.percentage && !G_LOADING) {
                  openHandler('percentage', discountSettingsQuery.data?.data?.marketing);
                }
              }}
            />
          </Grid>
          <Grid md={6} lg={4}>
            <MCard
              description="Offer a 'buy one, get one free' promotion for up to 10 items, giving customers a chance to try new items without extra cost."
              title="Buy 1, Get 1 Free"
              icon={BuyIcon}
              loading={G_LOADING || doubleDealSettingsQuery.isFetching}
              disabled={appliedDeals.double_menu || !activeDeals.double_menu}
              status={getPromotionStatus(doubleDealSettingsQuery, 'double_menu')}
              ongoingBy={adminShop?.shopType ? 'admin' : 'shop'}
              onOpen={() => {
                if (!G_LOADING && !appliedDeals.double_menu && activeDeals.double_menu) {
                  openHandler('double_menu', doubleDealSettingsQuery.data?.data?.marketing);
                }
              }}
            />
          </Grid>
          <Grid md={6} lg={4}>
            <MCard
              description="Cover the entire delivery fee charged to the customer as a way to encourage customers to order from your business, and drive sales."
              title="$0 Delivery Fee"
              loading={G_LOADING || freeDeliverySettingsQuery?.isFetching}
              disabled={appliedDeals.free_delivery || !activeDeals.free_delivery}
              status={getPromotionStatus(freeDeliverySettingsQuery, 'free_delivery')}
              ongoingBy={adminShop?.shopType ? 'admin' : 'shop'}
              icon={DeliveryIcon}
              onOpen={() => {
                if (!G_LOADING && !appliedDeals.free_delivery && activeDeals.free_delivery) {
                  openHandler('free_delivery', freeDeliverySettingsQuery.data?.data?.marketing);
                }
              }}
            />
          </Grid>
          {adminShop?.shopType && (
            <Grid md={6} lg={4}>
              <MCard
                description="Enable this feature and allow customers to use their points to pay for a portion or all of their purchase on an item."
                title="Loyalty Points"
                loading={G_LOADING || rewardSettingsQuery.isFetching}
                status={getPromotionStatus(rewardSettingsQuery)}
                icon={LoyaltyIcon}
                onOpen={() => {
                  if (!rewardSettingsQuery.isLoading) {
                    openHandler('reward', rewardSettingsQuery.data?.data?.marketing);
                  }
                }}
              />
            </Grid>
          )}
          {/* <Grid md={6} lg={4}>
            <MCard
              description="Feature your restaurant profile on the homepage in the 'Featured' section to increase visibility and attract more customers."
              title="Promotions"
              icon={PromoIcon}
              onOpen={() => {
                console.log('opened');
              }}
            />
          </Grid> */}
        </Grid>
        {/* settings modal */}
        <MSettingsModal open={Boolean(currentModal)}>
          <MarketingSettings
            shop={currentShop}
            creatorType={adminShop?.shopType ? 'shop' : 'admin'}
            marketingType={currentModal}
            onDelete={() => {
              setCurrentModal(null);
            }}
            onClose={() => {
              setCurrentModal(null);
            }}
          />
        </MSettingsModal>
      </Box>
    </Wrapper>
  );
}
