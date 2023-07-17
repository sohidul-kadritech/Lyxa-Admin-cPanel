import { Email } from '@mui/icons-material';
import { Avatar, Stack, Typography } from '@mui/material';
import { ReactComponent as Loacation } from '../../assets/icons/location.svg';
import { ReactComponent as Phone } from '../../assets/icons/phone.svg';
import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';
import { ReactComponent as UserIcon } from '../../assets/icons/user_outline.svg';
import InfoListItem from './InfoListItem';

export default function UserProfileInfo({ user, avatarProps, containerProps }) {
  return (
    <Stack direction="row" alignItems="center" gap={6} {...containerProps}>
      {/* profile */}
      <Avatar alt="logo" src={user?.profile} variant="circular" sx={{ width: 100, height: 100 }} {...avatarProps}>
        {user?.name
          ?.split(' ')
          ?.reduce((acc, curr) => acc + curr[0], '')
          ?.substr(0, 2)}
      </Avatar>
      <Stack>
        {/* name */}
        <Typography variant="h3" color="initial" fontSize={30} lineHeight="36.31px" pb={2.5}>
          {user?.name}
        </Typography>
        {/* info */}
        <Stack direction="row" alignItems="center" justifyContent="start">
          {user.adminType && <InfoListItem icon={UserIcon} title={user?.adminType} isFirst />}
          {user.email && <InfoListItem icon={Email} title={user?.email} isFirst link={`mailto:${user?.email}`} />}
          {user.address && (
            <InfoListItem icon={Loacation} title={user?.address} isFirst link={user.addressLink} linkOpenBlank />
          )}
          {user.phone && <InfoListItem icon={Phone} title={user?.phone} isFirst link={`tel:${user?.phone}`} />}
        </Stack>
        {/* rating */}
        {user?.rating && (
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
              {user?.rating}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
