import { Box, Stack, useTheme } from '@mui/material';
import UserProfileInfo from '../../components/Common/UserProfileInfo';
import { useGlobalContext } from '../../context';

export default function Greeting() {
  // eslint-disable-next-line no-unused-vars
  const theme = useTheme();
  const { currentUser } = useGlobalContext();
  console.log('====>accountManager: ', currentUser);
  const admin = currentUser?.admin || {};
  console.log(admin);

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {/* <Typography variant="h3" fontSize={30} lineHeight="26px">
          {admin?.name}
        </Typography> */}

        <UserProfileInfo
          user={{
            name: admin?.name,
            phone: admin?.phone_number,
            email: admin?.email,
            profile: admin?.profile_photo,
            address: admin?.address,
            adminType: 'Account Manager',
            //   address: admin?.addressSeller?.address,
          }}
        />
      </Stack>
    </Box>
  );
}
