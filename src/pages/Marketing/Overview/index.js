/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
// third party
import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';

// project import
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import { ReactComponent as BuyIcon } from '../../../assets/icons/buy-icon.svg';
import { ReactComponent as DeliveryIcon } from '../../../assets/icons/delivery-icon.svg';
import { ReactComponent as DiscountIcon } from '../../../assets/icons/discount-icon.svg';
import { ReactComponent as PromoIcon } from '../../../assets/icons/featured-icon.svg';
import { ReactComponent as LoyaltyIcon } from '../../../assets/icons/loyalty-icon.svg';
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import MSettingsModal from '../MSettingsModal';
import MarketingSettings from '../Settings';
import { getPromotionStatus } from '../helpers';
import MCard from './MarketingCard';

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
    console.log('creator: ', item?.creatorType, ' ', currentUserType);
    if (item?.creatorType !== currentUserType) {
      options[item?.type] = true;
    }
  });

  return options;
};

const getActiveDeals = (dealSetting, shopType) => {
  const deals = { ...activeDealsInit };

  console.log({ dealSetting });

  dealSetting?.forEach((item) => {
    if (item?.type === shopType || (item?.type === 'restaurant' && shopType === 'food')) {
      item?.option?.forEach((item) => {
        deals[item] = true;
      });
    }
  });

  return deals;
};

const appliedByOtherSideMap = { shop: 'Admin', admin: 'Shop' };

export default function MarketingOverview({ viewUserType }) {
  const history = useHistory();

  const { currentUser } = useGlobalContext();

  const { shop, userType } = currentUser;

  const [currentModal, setCurrentModal] = useState(null);

  const [activeDeals, setActiveDeals] = useState(activeDealsInit);

  const params = useParams();

  const [currentShop, setCurrentShop] = useState(viewUserType === 'shop' ? shop : {});

  const [appliedDeals, setAppliedDeals] = useState(marketingTypesInit);

  const routeMatch = useRouteMatch();

  console.log('params', params);

  const shopQuery = useQuery(
    [
      Api.SINGLE_SHOP,
      {
        shopId: params?.id,
      },
    ],
    () =>
      AXIOS.get(Api.SINGLE_SHOP, {
        params: {
          id: params?.id,
        },
      }),
    {
      enabled: viewUserType !== 'shop',
    },
  );

  const dealSettingsQuery = useQuery(
    [
      'deal-settings',
      {
        id: params?.id,
      },
    ],
    () =>
      AXIOS.get(Api.GET_ADMIN_DEAL_SETTINGS, {
        params: {
          type: 'all',
        },
      }),
  );

  useEffect(() => {
    if (viewUserType === 'shop') {
      setCurrentShop(shop);

      const activeDeals = getActiveDeals(dealSettingsQuery?.data?.data?.dealSetting || [], shop?.shopType);

      console.log('shopDeals', activeDeals, dealSettingsQuery?.data?.data?.dealSetting);

      setActiveDeals(activeDeals);

      const appliedDeals = getApliedDeals(shop?.marketings, 'shop');

      setAppliedDeals(appliedDeals);
    } else if (shopQuery?.data?.status) {
      setCurrentShop(shopQuery?.data?.data?.shop || {});
      const activeDeals = getActiveDeals(
        dealSettingsQuery?.data?.data?.dealSetting || [],
        shopQuery?.data?.data?.shop?.shopType,
      );
      console.log('shopQuery?.data?.status');
      setActiveDeals(activeDeals);

      const appliedDeals = getApliedDeals(shopQuery?.data?.data?.shop?.marketings, 'admin');
      setAppliedDeals(appliedDeals);
    }
  }, [shopQuery?.data?.data?.shop, dealSettingsQuery?.data?.data?.dealSetting]);

  const getQueryParmas = (marketingType) => ({
    shop: currentShop?._id,
    type: marketingType,
    creatorType: viewUserType,
  });

  const rewardQuery = useQuery(
    [
      'marketing-reward-settings',
      {
        id: params?.shopId,
      },
    ],
    () =>
      AXIOS.get(Api.GET_MARKETING_SETTINGS, {
        params: getQueryParmas('reward'),
      }),
    {
      enabled: Boolean(currentShop?._id),
    },
  );

  const featuredSettingsQuery = useQuery(
    [
      'marketing-featured-settings',
      {
        id: params?.shopId,
      },
    ],
    () =>
      AXIOS.get(Api.GET_MARKETING_SETTINGS, {
        params: getQueryParmas('featured'),
      }),
    {
      enabled: Boolean(currentShop?._id),
    },
  );

  const discountQuery = useQuery(
    [
      'marketing-percentage-settings',
      {
        id: params?.shopId,
      },
    ],
    () =>
      AXIOS.get(Api.GET_MARKETING_SETTINGS, {
        params: getQueryParmas('percentage'),
      }),
    {
      enabled: Boolean(currentShop?._id),
    },
  );

  const doubleDealQuery = useQuery(
    [
      'marketing-double_menu-settings',
      {
        id: params?.shopId,
      },
    ],
    () =>
      AXIOS.get(Api.GET_MARKETING_SETTINGS, {
        params: getQueryParmas('double_menu'),
      }),
    {
      enabled: Boolean(currentShop?._id),
    },
  );

  const freeDeliveryQuery = useQuery(
    [
      'marketing-free_delivery-settings',
      {
        id: params?.shopId,
      },
    ],
    () =>
      AXIOS.get(Api.GET_MARKETING_SETTINGS, {
        params: getQueryParmas('free_delivery'),
      }),
    {
      enabled: Boolean(currentShop?._id),
    },
  );

  const openHandler = (marketingType, mData = {}) => {
    const marketing = mData?.data?.marketing;

    if (marketingType === 'percentage') {
      const marketingData = mData?.isMarketing ? mData?.data?.marketings : mData?.marketings;

      const existingMarketing = marketingData?.find(
        (mrkting) => mrkting?.creatorType === 'admin' || mrkting?.creatorType === 'shop',
      );

      if (!existingMarketing) {
        setCurrentModal(marketingType);
        return;
      }

      const marketingForAdmin = marketingData?.find((mrkting) => mrkting?.creatorType === 'admin');
      const marketingForShop = marketingData?.find((mrkting) => mrkting?.creatorType === 'shop');

      let marketing = {};

      if (viewUserType === 'admin' && marketingForAdmin) {
        marketing = marketingForAdmin;
      } else if (viewUserType === 'shop' && marketingForShop) {
        marketing = marketingForShop;
      }

      console.log({ existingMarketing, viewUserType, marketingForAdmin, marketingForShop }, 'marketing data');

      if (viewUserType === 'shop' && userType === 'shop') {
        history.push(
          `/marketing/dashboard/${marketingType}/${marketing?._id}?user=${viewUserType}&tab=${viewUserType}`,
        );
      } else if (viewUserType === 'shop' && userType === 'seller') {
        history.push(
          `/shop/dashboard/${currentShop?._id}/marketing/dashboard/${marketingType}/${marketing?._id}?user=${viewUserType}&tab=${viewUserType}`,
        );
      } else if (viewUserType === 'shop' && userType === 'admin') {
        history.push(
          `${routeMatch?.url}/dashboard/${marketingType}/${marketing?._id}?user=${viewUserType}&tab=${viewUserType}`,
        );
      } else {
        history.push(
          `/shops/${currentShop?._id}/marketing/dashboard/${marketingType}/${marketing?._id}?user=${viewUserType}&tab=${viewUserType}`,
        );
      }
      return;
    }

    if (!mData?.isMarketing) {
      if (viewUserType === 'shop' && userType === 'admin' && mData?.isNotEligible) {
        history.push(`${routeMatch?.url}/dashboard/${marketingType}/${mData?.marketing?._id}`);
      } else if (viewUserType === 'shop' && userType === 'shop' && mData?.isNotEligible) {
        history.push(
          `${routeMatch?.url}/dashboard/${marketingType}/${mData?.marketing?._id}?&shopId=${currentShop?._id}`,
        );
      } else {
        setCurrentModal(marketingType);
      }
    } else if (viewUserType === 'shop' && userType === 'shop') {
      history.push(`/marketing/dashboard/${marketingType}/${marketing?._id}`);
    } else if (viewUserType === 'shop' && userType === 'seller') {
      history.push(`/shop/dashboard/${currentShop?._id}/marketing/dashboard/${marketingType}/${marketing?._id}`);
    } else if (viewUserType === 'shop' && userType === 'admin') {
      history.push(`${routeMatch?.url}/dashboard/${marketingType}/${marketing?._id}`);
    } else {
      history.push(`/shops/${currentShop?._id}/marketing/dashboard/${marketingType}/${marketing?._id}`);
    }
  };

  const __loading =
    !dealSettingsQuery.isFetchedAfterMount ||
    !discountQuery.isFetchedAfterMount ||
    !doubleDealQuery.isFetchedAfterMount ||
    !freeDeliveryQuery.isFetchedAfterMount ||
    !rewardQuery.isFetchedAfterMount ||
    shopQuery.isLoading;

  const isReadonly = (mData = {}) => {
    if (viewUserType === 'shop' && userType === 'admin') {
      return mData?.isMarketing === false;
    }
    return false;
  };

  const getOngoingBy = (mData = {}) => {
    if (mData?.data?.marketings[0]?.type === 'percentage') {
      const shopMarketing = mData?.data?.marketings?.find((itm) => itm?.creatorType === 'shop');
      const adminMarketing = mData?.data?.marketings?.find((itm) => itm?.creatorType === 'admin');

      if (shopMarketing && adminMarketing) {
        return 'Dual Marketing';
      }

      return shopMarketing ? 'Shop' : adminMarketing ? 'Admin' : '';
    }

    return mData?.data?.marketing?.status ? viewUserType : appliedByOtherSideMap[viewUserType];
  };

  const isAdminViewAsShop = viewUserType === 'shop' && userType === 'admin';

  return (
    <Box>
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
            isAdminViewAsShop={viewUserType === 'shop' && userType === 'admin'}
            readOnly={isReadonly(discountQuery?.data)}
            loading={__loading || discountQuery?.isFetching}
            // disabled={
            //   discountQuery?.data?.marketings?.creatorType === 'admin' && viewUserType === 'shop'
            //     ? false
            //     : appliedDeals.percentage || !activeDeals.percentage
            // }
            // disabled={appliedDeals.percentage || !activeDeals.percentage}
            status={getPromotionStatus(discountQuery, 'percentage', activeDeals)}
            ongoingBy={getOngoingBy(discountQuery?.data, 'percentage')}
            onOpen={() => {
              if (activeDeals.percentage && !__loading) {
                openHandler('percentage', discountQuery?.data);
                // if (!appliedDeals.percentage || isAdminViewAsShop) openHandler('percentage', discountQuery?.data);
              }
            }}
          />
        </Grid>
        <Grid md={6} lg={4}>
          <MCard
            description="Offer a 'buy one, get one free' promotion for up to 10 items, giving customers a chance to try new items without extra cost."
            title="Buy 1, Get 1 Free"
            icon={BuyIcon}
            isAdminViewAsShop={viewUserType === 'shop' && userType === 'admin'}
            readOnly={isReadonly(doubleDealQuery.data)}
            loading={__loading || doubleDealQuery.isFetching}
            // disabled={appliedDeals.double_menu || !activeDeals.double_menu}
            disabled={
              doubleDealQuery?.data?.marketing?.creatorType === 'admin' && viewUserType === 'shop'
                ? false
                : appliedDeals.double_menu || !activeDeals.double_menu
            }
            status={getPromotionStatus(doubleDealQuery, 'double_menu', activeDeals)}
            ongoingBy={getOngoingBy(doubleDealQuery.data)}
            onOpen={() => {
              if (!__loading && activeDeals.double_menu) {
                openHandler('double_menu', doubleDealQuery.data);
                // if (!appliedDeals.double_menu || isAdminViewAsShop) openHandler('double_menu', doubleDealQuery.data);
              }
            }}
          />
        </Grid>
        {!(currentShop?.haveOwnDeliveryBoy && viewUserType === 'admin') && (
          <Grid md={6} lg={4}>
            <MCard
              description="Cover the entire delivery fee charged to the customer as a way to encourage customers to order from your business, and drive sales."
              title="$0 Delivery Fee"
              isAdminViewAsShop={viewUserType === 'shop' && userType === 'admin'}
              loading={__loading || freeDeliveryQuery?.isFetching}
              readOnly={isReadonly(freeDeliveryQuery.data)}
              // disabled={appliedDeals.free_delivery || !activeDeals.free_delivery}
              disabled={
                freeDeliveryQuery?.data?.marketing?.creatorType === 'admin' && viewUserType === 'shop'
                  ? false
                  : appliedDeals.free_delivery || !activeDeals.free_delivery
              }
              status={getPromotionStatus(freeDeliveryQuery, 'free_delivery', activeDeals)}
              ongoingBy={getOngoingBy(freeDeliveryQuery.data)}
              icon={DeliveryIcon}
              onOpen={() => {
                if (!__loading && activeDeals.free_delivery) {
                  openHandler('free_delivery', freeDeliveryQuery.data);
                  // if (!appliedDeals.free_delivery || isAdminViewAsShop)
                }
              }}
            />
          </Grid>
        )}
        {viewUserType === 'shop' && (
          <>
            <Grid md={6} lg={4}>
              <MCard
                description="Enable this feature and allow customers to use their points to pay for a portion or all of their purchase on an item."
                title="Loyalty Points"
                loading={__loading || rewardQuery.isFetching}
                status={getPromotionStatus(rewardQuery)}
                ongoingBy={getOngoingBy(rewardQuery.data)}
                readOnly={isReadonly(rewardQuery.data)}
                icon={LoyaltyIcon}
                onOpen={() => {
                  if (!rewardQuery.isLoading) {
                    openHandler('reward', rewardQuery.data);
                  }
                }}
              />
            </Grid>
            <Grid md={6} lg={4}>
              <MCard
                description="Feature your restaurant profile on the homepage in the 'Featured' section to increase visibility and attract more customers."
                title="Featured"
                loading={__loading || featuredSettingsQuery.isFetching}
                status={getPromotionStatus(featuredSettingsQuery)}
                ongoingBy={getOngoingBy(featuredSettingsQuery?.data)}
                readOnly={isReadonly(featuredSettingsQuery.data)}
                icon={PromoIcon}
                onOpen={() => {
                  if (!featuredSettingsQuery.isLoading) {
                    openHandler('featured', featuredSettingsQuery.data);
                  }
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
      {/* settings modal */}
      <MSettingsModal open={Boolean(currentModal)}>
        <MarketingSettings
          shop={currentShop}
          creatorType={viewUserType}
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
  );
}
