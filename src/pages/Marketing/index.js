/* eslint-disable max-len */
// third party
import { Box, Unstable_Grid2 as Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// project import
import { ReactComponent as BuyIcon } from '../../assets/icons/buy-icon.svg';
import { ReactComponent as DeliveryIcon } from '../../assets/icons/delivery-icon.svg';
import { ReactComponent as DiscountIcon } from '../../assets/icons/discount-icon.svg';
import { ReactComponent as PromoIcon } from '../../assets/icons/featured-icon.svg';
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

  const dealsAppliedByOther = appliedDeals.percentage || appliedDeals.double_menu || appliedDeals.reward;

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
              disabled={discountSettingsQuery.isLoading || dealsAppliedByOther || !activeDeals.percentage}
              ongoing={discountSettingsQuery.data?.data?.marketing?.isActive}
              onOpen={() => {
                if (!dealsAppliedByOther || activeDeals.percentage) {
                  setCurrentModal('percentage');
                }
              }}
            />
          </Grid>
          <Grid md={6} lg={4}>
            <MCard
              description="Offer a 'buy one, get one free' promotion for up to 10 items, giving customers a chance to try new items without extra cost."
              title="Buy 1, Get 1 Free"
              icon={BuyIcon}
              disabled={doubleDealSettingsQuery.isLoading || dealsAppliedByOther || !activeDeals.double_menu}
              ongoing={doubleDealSettingsQuery.data?.data?.marketing?.isActive}
              onOpen={() => {
                if (!dealsAppliedByOther || activeDeals.double_menu) {
                  setCurrentModal('double_menu');
                }
              }}
            />
          </Grid>
          <Grid md={6} lg={4}>
            <MCard
              description="Cover the entire delivery fee charged to the customer as a way to encourage customers to order from your business, and drive sales."
              title="$0 Delivery Fee"
              disabled={freeDeliverySettingsQuery.isLoading || appliedDeals.free_delivery || !activeDeals.free_delivery}
              ongoing={freeDeliverySettingsQuery.data?.data?.marketing?.isActive}
              icon={DeliveryIcon}
              onOpen={() => {
                if (!appliedDeals.free_delivery || activeDeals.free_delivery) {
                  setCurrentModal('free_delivery');
                }
              }}
            />
          </Grid>
          {adminShop?.shopType && (
            <Grid md={6} lg={4}>
              <MCard
                description="Enable this feature and allow customers to use their points to pay for a portion or all of their purchase on an item."
                title="Loyalty Points"
                disabled={rewardSettingsQuery.isLoading || dealsAppliedByOther}
                ongoing={rewardSettingsQuery.data?.data?.marketing?.isActive}
                icon={LoyaltyIcon}
                onOpen={() => {
                  if (!dealsAppliedByOther) {
                    setCurrentModal('reward');
                  }
                }}
              />
            </Grid>
          )}
          <Grid md={6} lg={4}>
            <MCard
              description="Feature your restaurant profile on the homepage in the 'Featured' section to increase visibility and attract more customers."
              title="Promotions"
              icon={PromoIcon}
              disabled
              onOpen={() => {
                console.log('opened');
              }}
            />
          </Grid>
        </Grid>
        {/* settings modal */}
        <MSettingsModal open={Boolean(currentModal)}>
          <MarketingSettings
            shop={currentShop}
            creatorType={adminShop?.shopType ? 'shop' : 'admin'}
            marketingType={currentModal}
            closeModal={() => {
              setCurrentModal(null);
            }}
          />
        </MSettingsModal>
      </Box>
    </Wrapper>
  );
}
