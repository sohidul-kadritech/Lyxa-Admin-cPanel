import { Box, Button, Drawer, Stack } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import PageTop from '../../components/Common/PageTop';
import EditUser from '../../components/Shared/EditUser/index ';
import ProfileSkeleton from '../../components/Skeleton/ProfileSkeleton';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import TopInfo from './TopInfo';
import UserDetails from './UserDetails';
import UserTabs from './UserTabs';

export default function UserProfile() {
  const location = useLocation();
  const [user, setUser] = useState(location?.state?.user);
  const [open, setOpen] = useState(false);
  const params = useParams();

  const query = useQuery(
    [Api.SINGLE_USER, { id: params?.userId }],
    () =>
      AXIOS.get(Api.SINGLE_USER, {
        params: { id: params?.userId },
      }),
    {
      enabled: location?.state?.user?._id !== params?.userId,
      onSuccess: (data) => {
        if (data?.status) {
          setUser(data?.data?.user);
        }
      },
    }
  );

  return (
    <Box>
      <PageTop title="User Profile" backButtonLabel="Back to Accounts" backTo="/accounts" />
      {query?.isLoading && <ProfileSkeleton />}
      {!query?.isLoading && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { lg: '1fr 300px', md: '1fr' },
            paddingTop: '15px',
          }}
        >
          <Box
            sx={{
              paddingRight: { md: '50px', sm: '0px' },
              borderRight: { md: '1px solid #EEEEEE', sm: 'none' },
              height: '100%',
              overflow: 'auto',
            }}
          >
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" pb={12}>
              <TopInfo user={user} />
              <Button
                disableRipple
                variant="text"
                color="primary"
                onClick={() => {
                  setOpen(true);
                }}
                sx={{
                  textDecoration: 'underline',
                  marginTop: '4px',
                }}
              >
                Edit Account
              </Button>
            </Stack>
            <UserTabs />
          </Box>
          <Box
            sx={{
              paddingLeft: { sm: '0px', md: '50px' },
            }}
          >
            <UserDetails user={user} />
          </Box>
        </Box>
      )}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <EditUser
          editUser={user}
          onClose={() => setOpen(false)}
          onUpdateSuccess={(data) => {
            user.name = data?.name;
            user.profile_photo = data?.profile_photo;
            user.dob = data?.dob;
            user.gender = data?.gender;
          }}
        />
      </Drawer>
    </Box>
  );
}
