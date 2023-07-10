import { Box, Stack, Typography } from '@mui/material';
import { ReactComponent as LocationIcon } from '../../assets/icons/location.svg';
import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';
import { useGlobalContext } from '../../context';
import { getShopStatusColor } from '../ShopProfile/Info';

export default function Greeting() {
  const { currentUser } = useGlobalContext();
  const shop = currentUser?.shop || {};
  console.log(shop);

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h3" fontSize={22} lineHeight="26px">
          Good evening, {shop?.shopName}
        </Typography>
        <Stack direction="row" alignItems="center" gap={2.5}>
          <Box
            sx={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: getShopStatusColor(shop),
            }}
          />
          <Typography variant="body1" fontWeight={500}>
            Store is {shop.liveStatus}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" gap={6} pt={5.5}>
        <Typography
          variant="body1"
          fontWeight={600}
          lineHeight="20px"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
        >
          <StarIcon />
          {shop?.rating?.toFixed(1)}
        </Typography>
        <Typography
          variant="body1"
          fontWeight={600}
          lineHeight="20px"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
        >
          <LocationIcon />
          {shop?.address?.address}
        </Typography>
      </Stack>
    </Box>
  );
}
