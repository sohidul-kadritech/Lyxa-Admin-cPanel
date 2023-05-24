import { Email } from '@mui/icons-material';
import { Avatar, Stack, Typography } from '@mui/material';
import { ReactComponent as Loacation } from '../../assets/icons/location.svg';
import { ReactComponent as Phone } from '../../assets/icons/phone.svg';
import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';

export function InfoItem({ icon: Icon, title, isFirst }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="start"
      className={isFirst ? 'first-info' : ''}
      gap="6px"
      sx={{
        position: 'relative',
        padding: '0 20px',

        '&::before': {
          content: "''",
          position: 'absolute',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: 'text.primary',
          display: 'block',
          left: '0px',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        },

        '&.first-info': {
          paddingLeft: 0,

          '&::before': {
            display: 'none',
          },
        },
      }}
    >
      <Icon />
      <Typography variant="h4" fontWeight={500}>
        {title}
      </Typography>
    </Stack>
  );
}

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
          {user.email && <InfoItem icon={Email} title={user?.email} isFirst />}
          {user.address && <InfoItem icon={Loacation} title={user?.address} />}
          {user.phone && <InfoItem icon={Phone} title={user?.phone} />}
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
