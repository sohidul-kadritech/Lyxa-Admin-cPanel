import { AccessTime } from '@mui/icons-material';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { ReactComponent as CartIcon } from '../../assets/icons/cart.svg';
import { ReactComponent as DeliveryIcon } from '../../assets/icons/delivery-icon3.svg';
import { ReactComponent as RewardIcon } from '../../assets/icons/reward-icon.svg';
import CameraIconButton from '../../components/Common/CameraIconButton';
import InfoListItem from '../../components/Common/InfoListItem';
import Rating from '../../components/Common/Rating';
import ThreeDotsMenu from '../../components/ThreeDotsMenu2';
import { useGlobalContext } from '../../context';
import { ShopDeals } from '../../helpers/ShopDeals';
import { TagsAndCuisines, menuOtions } from './helper';

export const statusColor = {
  green: '#417C45',
  black: '#363636',
  orange: '#dd5b63',
  yellow: '#FFAB09',
};

// function is used in multiple places
export const getShopStatusColor = (shop) => {
  const color = { color: statusColor?.green, status: 'online' };
  console.log('shopStatus: ', shop?.shopStatus);
  console.log('shopLiveStatus: ', shop?.liveStatus);

  if (shop?.shopStatus === 'inactive') {
    return { color: statusColor?.yellow, status: 'inactive' };
  }

  if (shop?.liveStatus === 'busy') {
    return { color: statusColor?.orange, status: 'busy' };
  }

  if (shop?.liveStatus === 'offline') {
    return { color: statusColor?.black, status: 'closed' };
  }

  // if (!shop?.isShopOpen) {
  //   return { color: statusColor?.black, status: 'closed' };
  // }

  return color;
};

export default function ShopInfo({ shop, onDrop, menuHandler }) {
  const { currentUser, general } = useGlobalContext();
  const currency = general?.currency;
  const Deals = useMemo(() => new ShopDeals(shop || {}), []);
  const routeMatch = useRouteMatch();
  const history = useHistory();

  return (
    <Stack direction="row" gap="21px" pt={4.5}>
      <Box sx={{ position: 'relative' }}>
        <Avatar src={shop?.shopLogo} alt="Shop" variant="circular" sx={{ width: 175, height: 175 }}>
          {shop?.shopName
            ?.split(' ')
            .reduce((prev, cur) => prev + cur.charAt(0), '')
            .slice(0, 3)}
        </Avatar>
        <CameraIconButton
          sx={{
            position: 'absolute',
            top: '129px',
            left: '129px',
          }}
          onFileSelect={(e) => {
            onDrop([e.target.files[0]], 'logo');
          }}
        />
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '9px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Active Badges */}
          <Box
            sx={{ background: getShopStatusColor(shop)?.color, width: '11px', height: '11px', borderRadius: '50%' }}
          />
          <Box>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: '14px', sm: '16px', md: '20px', lg: '30px' }, fontWeight: 500 }}
            >
              {shop?.shopName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flex: '5', alignItems: 'center' }}>
            <Box>
              {shop?.accountManager?.name && (
                <Typography
                  onClick={() => {
                    if (shop?.accountManager?._id) {
                      history.push({
                        pathname: `/accountManager/${shop?.accountManager._id}`,
                        state: { from: routeMatch?.path, backToLabel: 'Back to seller list' },
                      });
                    }
                  }}
                  sx={{
                    color: 'primary.main',
                    fontSize: '15px',
                    fontWeight: '600',
                    marginLeft: '8px',
                    cursor: 'pointer',
                  }}
                >
                  {shop?.accountManager?.name ? `@${shop?.accountManager?.name} (Account Manager)` : ''}
                </Typography>
              )}
            </Box>
            <Box>
              <ThreeDotsMenu
                menuItems={menuOtions(currentUser?.userType, routeMatch?.path)}
                handleMenuClick={menuHandler}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ marginLeft: '20px', marginTop: '9px' }}>
          <Stack direction="row" alignItems="center">
            <InfoListItem
              isFirst
              title={TagsAndCuisines(shop?.tags, shop?.cuisineType)}
              titleSx={{
                color: 'text.secondary2',
              }}
            />
            <InfoListItem
              title={new Array(shop?.expensive)?.fill(0)?.reduce((acc) => `${acc}$`, '')}
              dotColor="text.secondary2"
              titleSx={{
                color: 'text.secondary2',
              }}
            />
          </Stack>
          <Stack direction="row" alignItems="center" gap={1} pt={2.5}>
            <Rating
              amount={shop?.rating}
              titleSx={{
                fontSize: '18px',
                fontWeight: 500,
              }}
            />
            <Typography variant="inherit" fontSize="18px" sx={{ fontWeight: 400, color: 'text.secondary2' }}>
              ({shop?.reviews?.length > 100 ? '100+' : shop?.reviews?.length} reviews)
            </Typography>
          </Stack>
          <Stack flexDirection="row" gap="16px" sx={{ marginTop: '16px' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                alignContents: 'center',
                gap: '6px',
                backgroundColor: '#F7F9FA',
                color: '#3F3D56',
                padding: '10px 16px',
                borderRadius: '7px',
              }}
            >
              <AccessTime sx={{ width: '17px', height: '17px' }} />
              <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
                {/* ETA{' '}
                  {shop?.avgOrderDeliveryTime < 30
                    ? '30-40'
                    : `${Math.ceil(shop?.avgOrderDeliveryTime)}-${Math.ceil(shop?.avgOrderDeliveryTime) + 10}`}
                  min */}
                ETA {Math.round(shop?.avgOrderDeliveryTime)} min
              </Typography>
            </Box>
            {Deals.deals.reward.isActive && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  alignContents: 'center',
                  gap: '6px',
                  backgroundColor: '#EFF8FA',
                  color: '#15BFCA',
                  padding: '10px 16px',
                  borderRadius: '7px',
                }}
              >
                <RewardIcon style={{ width: '17px', height: '17px' }} />
                <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>Rewards</Typography>
              </Box>
            )}
            {Deals.deals.free_delivery && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  alignContents: 'center',
                  gap: '6px',
                  backgroundColor: '#5BBD4E12',
                  color: '#5BBD4E',
                  padding: '10px 16px',
                  borderRadius: '7px',
                }}
              >
                <DeliveryIcon style={{ width: '17px', height: '17px' }} />
                <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>Free</Typography>
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                alignContents: 'center',
                gap: '6px',
                backgroundColor: '#FCF9F0',
                color: '#F78C3F',
                padding: '10px 16px',
                borderRadius: '7px',
              }}
            >
              <CartIcon style={{ width: '17px', height: '17px' }} />
              <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>
                Min. {currency?.symbol}
                {shop?.minOrderAmount}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}
