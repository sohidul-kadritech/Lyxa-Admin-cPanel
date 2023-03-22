/* eslint-disable max-len */
// third party
import { Box, Modal, Paper, Unstable_Grid2 as Grid } from '@mui/material';
import { useState } from 'react';

// project import
import { useQuery } from 'react-query';
import { ReactComponent as BuyIcon } from '../../assets/icons/buy-icon.svg';
import { ReactComponent as DeliveryIcon } from '../../assets/icons/delivery-icon.svg';
import { ReactComponent as DiscountIcon } from '../../assets/icons/discount-icon.svg';
import { ReactComponent as PromoIcon } from '../../assets/icons/featured-icon.svg';
import { ReactComponent as LoyaltyIcon } from '../../assets/icons/loyalty-icon.svg';
import Wrapper from '../../components/Wrapper';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import LoyaltySettings from './Loyalty/Settings';
import MCard from './MarketingCard';

export default function Marketing() {
  const [currentModal, setCurrentModal] = useState(null);

  const loyaltySettingsQuery = useQuery(['loyalty'], () => AXIOS.get(Api.GET_LOYALTY_SETTINGS), {
    staleTime: 0,
  });

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
              onOpen={() => {
                console.log('opened');
              }}
            />
          </Grid>
          <Grid xs={6} md={4}>
            <MCard
              description="Offer a 'buy one, get one free' promotion for up to 10 items, giving customers a chance to try new items without extra cost."
              title="Buy 1, Get 1 Free"
              icon={BuyIcon}
              onOpen={() => {
                console.log('opened');
              }}
            />
          </Grid>
          <Grid xs={6} md={4}>
            <MCard
              description="Cover the entire delivery fee charged to the customer as a way to encourage customers to order from your business, and drive sales."
              title="$0 Delivery Fee"
              icon={DeliveryIcon}
              onOpen={() => {
                console.log('opened');
              }}
            />
          </Grid>
          <Grid xs={6} md={4}>
            <MCard
              description="Enable this feature and allow customers to use their points to pay for a portion or all of their purchase on an item."
              title="Loyalty Points"
              ongoing={loyaltySettingsQuery?.data?.isLoyaltyProgram}
              icon={LoyaltyIcon}
              onOpen={() => {
                setCurrentModal('loyalty');
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
              position: 'relative',
              borderRadius: '10px',
              height: '100%',
            }}
          >
            {currentModal === 'loyalty' && (
              <LoyaltySettings
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
