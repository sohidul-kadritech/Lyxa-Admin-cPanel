import { Box, Stack, Typography } from '@mui/material';
import { ReactComponent as LocationIcon } from '../../assets/icons/location.svg';
import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';
import InfoListItem from '../../components/Common/InfoListItem';
import { useGlobalContext } from '../../context';
import { getShopStatusColor } from '../ShopProfile/Info';
import { getGreeting } from './helper';

export default function Greeting() {
  const { currentUser } = useGlobalContext();
  const shop = currentUser?.shop || {};

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h3" fontSize={22} lineHeight="26px">
          {getGreeting()}, {shop?.shopName}
        </Typography>
        <Stack direction="row" alignItems="center" gap={2.5}>
          <Box
            sx={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: getShopStatusColor(shop)?.color,
            }}
          />
          <Typography variant="body1" fontWeight={500}>
            Store is {getShopStatusColor(shop)?.status}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" pt={5.5}>
        <InfoListItem
          title={shop?.rating?.toFixed(1)}
          icon={StarIcon}
          isFirst
          titleSx={{ fontSize: '16px', fontWeight: 600 }}
        />
        <InfoListItem
          title={shop?.address?.address}
          icon={LocationIcon}
          isFirst
          titleSx={{ fontSize: '16px', fontWeight: 600 }}
          linkOpenBlank
          link={`https://maps.google.com/?q=${shop?.address?.latitude},${shop?.address?.longitude}`}
        />
      </Stack>
    </Box>
  );
}
