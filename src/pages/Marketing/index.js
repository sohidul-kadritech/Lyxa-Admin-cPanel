/* eslint-disable max-len */
// third party
import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';

// project import
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import { ReactComponent as BuyIcon } from '../../assets/icons/buy-icon.svg';
import { ReactComponent as DeliveryIcon } from '../../assets/icons/delivery-icon.svg';
import { ReactComponent as DiscountIcon } from '../../assets/icons/discount-icon.svg';
import { ReactComponent as PromoIcon } from '../../assets/icons/featured-icon.svg';
import { ReactComponent as LoyaltyIcon } from '../../assets/icons/loyalty-icon.svg';
import { useGlobalContext } from '../../context';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import MSettingsModal from './MSettingsModal';
import MCard from './MarketingCard';
import MarketingSettings from './Settings';
import { getPromotionStatus } from './helpers';

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
  console.log(dealSetting);
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

export default function Marketing({ viewUserType }) {
  const history = useHistory();
  const { currentUser } = useGlobalContext();
  const { shop, userType } = currentUser;

  const [currentModal, setCurrentModal] = useState(null);
  const [activeDeals, setActiveDeals] = useState(activeDealsInit);
  const params = useParams();
  const [currentShop, setCurrentShop] = useState(viewUserType === 'shop' ? shop : {});
  const [appliedDeals, setAppliedDeals] = useState(marketingTypesInit);
  const routeMatch = useRouteMatch();
  console.log(routeMatch);
  console.log({ params });

  // "/seller/dashboard/:sellerId/shop/dashboard/:shopId/marketing"

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
    }
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
      })
  );

  useEffect(() => {
    if (viewUserType === 'shop') {
      setCurrentShop(shop);

      const activeDeals = getActiveDeals(dealSettingsQuery?.data?.data?.dealSetting || [], shop?.shopType);
      setActiveDeals(activeDeals);

      const appliedDeals = getApliedDeals(shop?.marketings, 'shop');
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

  const getQueryParmas = (marketingType) => ({
    shop: currentShop?._id,
    type: marketingType,
    creatorType: viewUserType,
  });

  const rewardSettingsQuery = useQuery(
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
    }
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
    }
  );

  const discountSettingsQuery = useQuery(
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
    }
  );

  const doubleDealSettingsQuery = useQuery(
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
    }
  );

  const freeDeliverySettingsQuery = useQuery(
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
    }
  );

  const openHandler = (marketingType, marketing) => {
    if (!marketing?.status) {
      setCurrentModal(marketingType);
    } else if (viewUserType === 'shop' && userType === 'shop') {
      history.push(`/marketing/dashboard/${marketingType}/${marketing?._id}`);
    } else if (viewUserType === 'shop' && userType === 'seller') {
      history.push(`/shop/dashboard/64777aed8f332425af4f3373/marketing/dashboard/${marketingType}/${marketing?._id}`);
    } else {
      history.push(`/shops/marketing/dashboard/${currentShop?._id}/${marketingType}/${marketing?._id}`);
    }
  };

  const __loading =
    !dealSettingsQuery.isFetchedAfterMount ||
    !discountSettingsQuery.isFetchedAfterMount ||
    !doubleDealSettingsQuery.isFetchedAfterMount ||
    !freeDeliverySettingsQuery.isFetchedAfterMount ||
    !rewardSettingsQuery.isFetchedAfterMount ||
    shopQuery.isLoading;

  const __readonly = viewUserType === 'shop' && userType === 'admin';

  console.log(shopQuery?.data?.data?.shop);

  return (
    <Box sx={{ pt: 8.5 }}>
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
            readOnly={__readonly}
            loading={__loading || discountSettingsQuery?.isFetching}
            disabled={appliedDeals.percentage || !activeDeals.percentage}
            status={getPromotionStatus(discountSettingsQuery, 'percentage', activeDeals)}
            // ongoingBy={shop?.shopType ? 'admin' : 'shop'}
            ongoingBy={viewUserType === 'shop' ? 'admin' : 'shop'}
            onOpen={() => {
              if (!appliedDeals.percentage && activeDeals.percentage && !__loading) {
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
            readOnly={__readonly}
            loading={__loading || doubleDealSettingsQuery.isFetching}
            disabled={appliedDeals.double_menu || !activeDeals.double_menu}
            status={getPromotionStatus(doubleDealSettingsQuery, 'double_menu', activeDeals)}
            // ongoingBy={shop?.shopType ? 'admin' : 'shop'}
            ongoingBy={viewUserType === 'shop' ? 'admin' : 'shop'}
            onOpen={() => {
              if (!__loading && !appliedDeals.double_menu && activeDeals.double_menu) {
                openHandler('double_menu', doubleDealSettingsQuery.data?.data?.marketing);
              }
            }}
          />
        </Grid>
        <Grid md={6} lg={4}>
          <MCard
            description="Cover the entire delivery fee charged to the customer as a way to encourage customers to order from your business, and drive sales."
            title="$0 Delivery Fee"
            loading={__loading || freeDeliverySettingsQuery?.isFetching}
            readOnly={__readonly}
            disabled={appliedDeals.free_delivery || !activeDeals.free_delivery}
            status={getPromotionStatus(freeDeliverySettingsQuery, 'free_delivery', activeDeals)}
            // ongoingBy={shop?.shopType ? 'admin' : 'shop'}
            ongoingBy={viewUserType === 'shop' ? 'admin' : 'shop'}
            icon={DeliveryIcon}
            onOpen={() => {
              if (!__loading && !appliedDeals.free_delivery && activeDeals.free_delivery) {
                openHandler('free_delivery', freeDeliverySettingsQuery.data?.data?.marketing);
              }
            }}
          />
        </Grid>
        {viewUserType === 'shop' && (
          <>
            {shop?.haveOwnDeliveryBoy === false && (
              <Grid md={6} lg={4}>
                <MCard
                  description="Enable this feature and allow customers to use their points to pay for a portion or all of their purchase on an item."
                  title="Loyalty Points"
                  loading={__loading || rewardSettingsQuery.isFetching}
                  readOnly={__readonly}
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
            <Grid md={6} lg={4}>
              <MCard
                description="Feature your restaurant profile on the homepage in the 'Featured' section to increase visibility and attract more customers."
                title="Featured"
                loading={__loading || rewardSettingsQuery.isFetching}
                status={getPromotionStatus(featuredSettingsQuery)}
                readOnly={__readonly}
                icon={PromoIcon}
                onOpen={() => {
                  if (!featuredSettingsQuery.isLoading) {
                    openHandler('featured', featuredSettingsQuery.data?.data?.marketing);
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
          // readOnly={__readonly}
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
