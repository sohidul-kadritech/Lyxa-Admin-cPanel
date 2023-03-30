/* eslint-disable max-len */
// third party
import { Box, Modal, Paper, Unstable_Grid2 as Grid } from '@mui/material';
import { useState } from 'react';

// project import
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { ReactComponent as BuyIcon } from '../../assets/icons/buy-icon.svg';
import { ReactComponent as DeliveryIcon } from '../../assets/icons/delivery-icon.svg';
import { ReactComponent as DiscountIcon } from '../../assets/icons/discount-icon.svg';
import { ReactComponent as PromoIcon } from '../../assets/icons/featured-icon.svg';
import { ReactComponent as LoyaltyIcon } from '../../assets/icons/loyalty-icon.svg';
import Wrapper from '../../components/Wrapper';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import MCard from './MarketingCard';
import MarketingSettings from './Settings';

const enabledDealsInit = {
  free_delivery: false,
  percentage: false,
  double_menu: false,
};

export default function Marketing() {
  const [currentModal, setCurrentModal] = useState(null);
  const [enabledDeals, setEnabledDeals] = useState(enabledDealsInit);
  const { shopType, _id } = useSelector((store) => store.Login.admin);

  // deal settings
  const dealSettingsQuery = useQuery(
    ['deal-settings'],
    () =>
      AXIOS.get(Api.GET_ADMIN_DEAL_SETTINGS, {
        params: {
          type: 'all',
        },
      }),
    {
      onSuccess: (data) => {
        data?.data?.dealSetting?.forEach((item) => {
          if (item?.type === shopType || (item?.type === 'restaurant' && shopType === 'food')) {
            const deals = { ...enabledDealsInit };

            item?.option?.forEach((item) => {
              deals[item] = true;
            });
            setEnabledDeals(deals);
          }
        });
      },
    }
  );

  const rewardSettingsQuery = useQuery(['marketing-reward-settings'], () =>
    AXIOS.get(Api.GET_MARKETING_SETTINGS, {
      params: {
        shop: _id,
        type: 'reward',
      },
    })
  );

  const discountSettingsQuery = useQuery(['marketing-percentage-settings'], () =>
    AXIOS.get(Api.GET_MARKETING_SETTINGS, {
      params: {
        shop: _id,
        type: 'percentage',
      },
    })
  );

  const doubleDealSettingsQuery = useQuery(['marketing-double_menu-settings'], () =>
    AXIOS.get(Api.GET_MARKETING_SETTINGS, {
      params: {
        shop: _id,
        type: 'double_menu',
      },
    })
  );

  const freeDeliverySettingsQuery = useQuery(['marketing-free_delivery-settings'], () =>
    AXIOS.get(Api.GET_MARKETING_SETTINGS, {
      params: {
        shop: _id,
        type: 'free_delivery',
      },
    })
  );

  return (
    <Wrapper
      sx={{
        paddingTop: '70px',
        paddingBottom: '60px',
      }}
    >
      <Box sx={{ height: '100%', overflowY: 'scroll', pt: 20, pb: 16 }}>
        <Grid container spacing={8} flexWrap="wrap">
          <Grid xs={6} md={4}>
            <MCard
              description="Provide a percentage discount for specific menu items or categories, allowing customers to save money while ordering their favorite dishes"
              title="Discounted Items"
              icon={DiscountIcon}
              disabled={dealSettingsQuery.isLoading || !enabledDeals.percentage}
              ongoing={discountSettingsQuery.data?.data?.marketing?.isActive}
              onOpen={() => {
                if (enabledDeals.percentage) {
                  setCurrentModal('percentage');
                }
              }}
            />
          </Grid>
          <Grid xs={6} md={4}>
            <MCard
              description="Offer a 'buy one, get one free' promotion for up to 10 items, giving customers a chance to try new items without extra cost."
              title="Buy 1, Get 1 Free"
              icon={BuyIcon}
              disabled={dealSettingsQuery.isLoading || !enabledDeals.double_menu}
              ongoing={doubleDealSettingsQuery.data?.data?.marketing?.isActive}
              onOpen={() => {
                if (enabledDeals.double_menu) {
                  setCurrentModal('double_menu');
                }
              }}
            />
          </Grid>
          <Grid xs={6} md={4}>
            <MCard
              description="Cover the entire delivery fee charged to the customer as a way to encourage customers to order from your business, and drive sales."
              title="$0 Delivery Fee"
              disabled={dealSettingsQuery.isLoading || !enabledDeals.free_delivery}
              ongoing={freeDeliverySettingsQuery.data?.data?.marketing?.isActive}
              icon={DeliveryIcon}
              onOpen={() => {
                if (enabledDeals.free_delivery) {
                  setCurrentModal('free_delivery');
                }
              }}
            />
          </Grid>
          <Grid xs={6} md={4}>
            <MCard
              description="Enable this feature and allow customers to use their points to pay for a portion or all of their purchase on an item."
              title="Loyalty Points"
              ongoing={rewardSettingsQuery?.data?.isLoyaltyProgram}
              icon={LoyaltyIcon}
              onOpen={() => {
                setCurrentModal('reward');
              }}
            />
          </Grid>
          <Grid xs={6} md={4}>
            <MCard
              description="Feature your restaurant profile on the homepage in the 'Featured' section to increase visibility and attract more customers."
              title="Promotions"
              icon={PromoIcon}
              onOpen={() => {
                console.log('opened');
              }}
            />
          </Grid>
        </Grid>
        {/* settings modal */}
        <Modal
          open={Boolean(currentModal)}
          sx={{
            minHeight: '0',
            maxHeight: '90%',
            top: '5%',
          }}
        >
          <Paper
            sx={{
              maxWidth: 'calc(100vw - 100px)',
              width: 'min(calc(100vw - 100px), 1500px)',
              position: 'relative',
              borderRadius: '10px',
              height: '100%',
            }}
          >
            {currentModal === 'reward' && (
              <MarketingSettings
                marketingType="reward"
                closeModal={() => {
                  setCurrentModal(null);
                }}
              />
            )}
            {currentModal === 'percentage' && (
              <MarketingSettings
                marketingType="percentage"
                closeModal={() => {
                  setCurrentModal(null);
                }}
              />
            )}
            {currentModal === 'double_menu' && (
              <MarketingSettings
                marketingType="double_menu"
                closeModal={() => {
                  setCurrentModal(null);
                }}
              />
            )}
            {currentModal === 'free_delivery' && (
              <MarketingSettings
                marketingType="free_delivery"
                closeModal={() => {
                  setCurrentModal(null);
                }}
              />
            )}
          </Paper>
        </Modal>
      </Box>
    </Wrapper>
  );
}
