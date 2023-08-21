/* eslint-disable no-unused-vars */
import { Box, Button, Drawer, Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useLocation, useParams, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import PageTop from '../../components/Common/PageTop';
import ProfileSkeleton from '../../components/Skeleton/ProfileSkeleton';
import { useGlobalContext } from '../../context';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import PageSkeleton from '../NewOrder/PageSkeleton';
import AddRider from '../Riders/AddRider';
import RiderDetails from './RiderDetails';
import RiderTabs from './Tabs';
import TopInfo from './TopInfo';

const getBreadCrumbItems = (searchUrl, id) => {
  const breadcrumbItems = [
    {
      label: 'Financials',
      to: '/financials',
    },
    {
      label: 'Rider List',
      to: '/add-wallet/delivery-transactions',
    },
    {
      label: 'Rider Profile',
      to: `/riders/${id}?financials=${searchUrl.get('financials')}`,
    },
  ];

  return breadcrumbItems;
};

export default function RiderProfile() {
  const location = useLocation();
  const routeMatch = useRouteMatch();

  const { currentUser } = useGlobalContext();
  const { shop, admin } = currentUser;

  const backRoute = useMemo(() => {
    const routeArr = routeMatch?.url?.split('/');
    routeArr?.pop();
    return routeArr?.join('/');
  }, []);

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [open, setOpen] = useState(false);

  const params = useParams();

  const queryClient = useQueryClient();

  const [rider, setRider] = useState(location?.state?.rider);

  const query = useQuery(
    [Api.SINGLE_DELIVERY_MAN, { id: params?.riderId }],
    () =>
      AXIOS.get(Api.SINGLE_DELIVERY_MAN, {
        params: {
          id: params?.riderId,
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          console.log('rider data on success', data?.data?.delivery);
          setRider(data?.data?.delivery);
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  return (
    <Box>
      <PageTop
        title={`${searchParams.get('financials') === 'riders' ? '' : 'Rider Profile'}`}
        backButtonLabel={location?.state?.backToLabel ? location?.state?.backToLabel : 'Back To Riders List'}
        backTo={location?.state?.from ? location?.state?.from : '/riders'}
        breadcrumbItems={
          searchParams.get('financials') === 'riders' ? getBreadCrumbItems(searchParams, params?.riderId) : undefined
        }
      />
      {query?.isLoading && (
        <ProfileSkeleton>
          <Box pt={5}>
            <PageSkeleton />
          </Box>
        </ProfileSkeleton>
      )}
      {!query?.isLoading && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              lg: '1fr 300px',
              md: '1fr',
            },
          }}
        >
          <Box
            sx={{
              paddingRight: {
                lg: '50px',
                md: '0px',
              },
              paddingBottom: '30px',
            }}
          >
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" pb={12}>
              <TopInfo rider={rider} />
              {admin?.adminType !== 'customerService' && (
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
              )}
            </Stack>
            <RiderTabs isFinancials={searchParams.get('financials') === 'riders'} rider={rider} />
          </Box>
          <Box
            sx={{
              paddingLeft: {
                lg: '50px',
                md: '0px',
              },
              borderLeft: '1px solid',
              borderColor: {
                lg: 'custom.border',
                md: 'transparent',
              },
            }}
          >
            <RiderDetails rider={rider} />
          </Box>
        </Box>
      )}
      <Drawer open={open} onClose={() => setOpen(false)} anchor="right">
        <AddRider
          riderFor={rider?.deliveryBoyType === 'shopRider' ? 'shop' : 'global'}
          riderShop={rider?.deliveryBoyType === 'shopRider' ? shop : undefined}
          hideDelete
          editRider={rider}
          onClose={() => setOpen(false)}
          onUpdateSuccess={(data) => {
            console.log('rider data on update', data);
            setRider(data?.data?.delivery);
            queryClient.invalidateQueries(Api.SINGLE_DELIVERY_MAN);
          }}
        />
      </Drawer>
    </Box>
  );
}
