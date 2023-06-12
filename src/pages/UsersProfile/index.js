/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import PageTop from '../../components/Common/PageTop';
import ProfileSkeleton from '../../components/Skeleton/ProfileSkeleton';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import UserDetails from './UserDetails';

export default function UserProfile() {
  const [user, setUser] = useState({});
  const location = useLocation();
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

  useEffect(() => {}, []);

  return (
    <Box>
      <PageTop title="User Profile" />
      {query?.isLoading && <ProfileSkeleton></ProfileSkeleton>}
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
          ></Box>
          <Box
            sx={{
              paddingLeft: { sm: '0px', md: '50px' },
            }}
          >
            <UserDetails user={location?.state?.user} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
