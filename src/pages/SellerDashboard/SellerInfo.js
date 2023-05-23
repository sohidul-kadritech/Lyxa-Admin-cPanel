import { Email } from '@mui/icons-material';
import { Avatar, Stack, Typography } from '@mui/material';
import { ReactComponent as Loacation } from '../../assets/icons/location.svg';
import { ReactComponent as Phone } from '../../assets/icons/phone.svg';
import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';

export function InfoItem({ icon: Icon, title, isFirst }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="start" pl={isFirst ? 0 : 9} gap="6px">
      <Icon />
      <Typography variant="h4" fontWeight={500}>
        {title}
      </Typography>
    </Stack>
  );
}

export default function SellerInfo({ seller }) {
  return (
    <Stack direction="row" alignItems="center" gap={6}>
      {/* profile */}
      <Avatar alt="logo" src={seller?.profile_photo} variant="circular" sx={{ width: 100, height: 100 }}>
        {seller?.name
          ?.split(' ')
          ?.reduce((acc, curr) => acc + curr[0], '')
          ?.substr(0, 2)}
      </Avatar>
      <Stack>
        {/* name */}
        <Typography variant="h3" color="initial" fontSize={30} lineHeight="36.31px" pb={2.5}>
          {seller?.name}
        </Typography>
        {/* info */}
        <Stack direction="row" alignItems="center" justifyContent="start">
          <InfoItem icon={Email} title={seller?.email} isFirst />
          <InfoItem icon={Loacation} title={seller?.addressSeller?.address} />
          <InfoItem icon={Phone} title={seller?.phone_number} />
        </Stack>
        {/* rating */}
        <Stack
          alignItems="center"
          direction="row"
          gap={1}
          sx={{
            color: '#417C45',
            marginTop: '12px',
            fontSize: '16px',
          }}
        >
          <StarIcon />
          <Typography variant="span" sx={{ fontWeight: 600 }}>
            4.2
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
