import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';
import { ReactComponent as CartIcon } from '../../assets/icons/cart.svg';
import { ReactComponent as BikeIcon } from '../../assets/icons/delivery2.svg';
import { ReactComponent as HeartIcon } from '../../assets/icons/heart.svg';
import { ReactComponent as RewardIcon } from '../../assets/icons/reward-icon.svg';

const shop = {
  banner: 'https://xxx.mock',
  name: 'Chipotle Mexican Grill',
  isReward: true,
  priceRange: 1,
};

function Info({ Icon, title, dot }) {
  return (
    <Typography
      sx={{
        fontSize: '10px!important',
        lineHeight: '20px!important',
        color: '#737373',
      }}
    >
      <Icon
        sx={{
          fontSize: '12px',
        }}
      />
      {` ${title} ${dot || ''}`}
    </Typography>
  );
}

export default function ShopPreview() {
  const theme = useTheme();

  // resturants

  return (
    <Stack direction="row" gap={3}>
      {/* image */}
      <Box
        position="relative"
        sx={{
          flexShrink: 0,
        }}
      >
        <Avatar src={shop.banner} alt={shop.name} variant="rounded" sx={{ width: 74, height: 74 }} />
        <span
          style={{
            position: 'absolute',
            right: '6px',
            top: '1px',
            color: '#fff',
          }}
        >
          <HeartIcon />
        </span>
      </Box>
      {/* details */}
      <Box
        sx={{
          flex: 1,
        }}
      >
        {/* title */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center">
            <Typography variant="body2" display="inline-block" pr={1.5}>
              {shop.name}
            </Typography>
            <RewardIcon color="#15BFCA" />
          </Stack>
          <Stack direction="row" alignItems="center" gap="2px">
            <StarIcon
              sx={{
                fontSize: '12px',
                color: '#4F4F4F',
              }}
            />
            <Typography
              variant="body1"
              sx={{
                fontWeight: '500',
                fontSize: '10px!important',
                lineHeight: '12px!important',
              }}
            >
              4.2
            </Typography>
          </Stack>
        </Stack>
        {/* price-range */}
        <Box>
          <Typography
            variant="body1"
            sx={{
              fontSize: '10px!important',
              lineHeight: '12px!important',
              display: 'inline-block',
              paddingRight: '5px',
            }}
          >
            Lunch, Dinner .
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '10px!important',
              lineHeight: '12px!important',
              display: 'inline-block',
            }}
          >
            {new Array(4).fill(0).map((item, index) => (
              <span
                style={{
                  color: index < shop.priceRange ? undefined : '#D4D4D4',
                }}
              >
                $
              </span>
            ))}
          </Typography>
        </Box>
        {/* Info */}
        <Stack direction="row" alignItems="center" gap="7px">
          <Info Icon={AccessTimeIcon} title="30-40 min" dot="." />
          <Info Icon={BikeIcon} title="Free" dot="." />
          <Info Icon={CartIcon} title="Min. $3" />
        </Stack>
        <Typography
          color={theme.palette.primary.main}
          sx={{
            fontSize: '10px!important',
            lineHeight: '14px!important',
          }}
        >
          X2 Deals, 20% off selected items
        </Typography>
      </Box>
    </Stack>
  );
}
