import { Box, Stack } from '@mui/material';
import UserProfileInfo from '../../components/Common/UserProfileInfo';
import { useGlobalContext } from '../../context';

export default function UserInfo() {
  const { currentUser } = useGlobalContext();
  const admin = currentUser?.admin || {};

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <UserProfileInfo
          user={{
            name: admin?.name,
            phone: admin?.phone_number,
            email: admin?.email,
            profile: admin?.profile_photo,
            adminType: 'Account Manager',
          }}
        />
      </Stack>
    </Box>
  );
}
