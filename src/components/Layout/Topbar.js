import { Avatar, Button, Stack, Typography } from '@mui/material';
import { ReactComponent as NotificationIcon } from '../../assets/icons/t-notification.svg';
import { ReactComponent as SupportIcon } from '../../assets/icons/t-support.svg';

export default function Topbar() {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      sx={{
        borderBottom: '1px solid #F8F8F8',
      }}
    >
      <Stack direction="row" alignItems="center" gap="25px" pt="15px" pb="15px" pl="30px" pr="30px">
        <Typography variant="body2">
          <SupportIcon /> Get Support
        </Typography>
        <Button variant="text" disableRipple sx={{ minWidth: 0 }}>
          <NotificationIcon />
        </Button>
        {/* eslint-disable-next-line react/no-children-prop */}
        <Avatar src={undefined} alt="U" children="U" sx={{ width: 36, height: 36 }} />
      </Stack>
    </Stack>
  );
}
