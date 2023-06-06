/* eslint-disable no-unused-vars */
import { Box, Button, Drawer, Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation, useParams, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import PageTop from '../../components/Common/PageTop';
import { useGlobalContext } from '../../context';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import AddRider from '../Riders/AddRider';
import RiderDetails from './RiderDetails';
import RiderTabs from './Tabs';
import TopInfo from './TopInfo';

export default function RiderProfile() {
  const location = useLocation();
  const routeMatch = useRouteMatch();

  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;

  const backRoute = useMemo(() => {
    const routeArr = routeMatch?.url?.split('/');
    routeArr?.pop();
    return routeArr?.join('/');
  }, []);

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [open, setOpen] = useState(false);
  const params = useParams();
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
      enabled: params?.riderId !== location?.state?.rider?._id,
      onSuccess: (data) => {
        if (data?.status) {
          setRider(data?.data?.delivery);
        }
      },
    }
  );

  return (
    <Box>
      <PageTop title="Rider Profile" backButtonLabel="Back to Riders" backTo={backRoute} />
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
          <RiderTabs rider={rider} />
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
      <Drawer open={open} onClose={() => setOpen(false)} anchor="right">
        <AddRider
          riderFor={rider?.deliveryBoyType === 'shopRider' ? 'shop' : 'global'}
          riderShop={rider?.deliveryBoyType === 'shopRider' ? shop : undefined}
          hideDelete
          editRider={rider}
          onClose={() => setOpen(false)}
          onUpdateSuccess={(data) => {
            setRider(data?.data?.delivery);
          }}
        />
      </Drawer>
    </Box>
  );
}
