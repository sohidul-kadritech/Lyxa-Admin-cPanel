import { Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { ReactComponent as FlagIcon } from '../../../../assets/icons/order-flag.svg';
import { StyledOrderDetailBox } from '../helpers';
import { StyledListItem } from './ListItem';
import FlagSummary from './Summary';

export default function FlagDetails({ order }) {
  const [buttonsOpen, setButtonsOpen] = useState(false);

  // const flagResolve = useMutation(
  //   () =>
  //   AXIOS.post(Api.RESOLVE_FLAG, {
  //       id: flag?._id,
  //       resolved: true,
  //     }),
  //   {
  //     onError: (error) => {
  //       console.log(error);
  //       successMsg(error, 'error');
  //     },

  //     onSuccess: (data) => {
  //       if (data?.status) {
  //         successMsg(data?.message, 'success');
  //         closeSideBar();
  //         queryClient.invalidateQueries({ queryKey: ['flagged_orders'] });
  //       } else {
  //         successMsg(data?.message, 'warn');
  //       }
  //     },
  //   }
  // );

  return (
    <Box>
      {!order?.flag?.length && (
        <Stack pt={30} pb={3}>
          <Typography textAlign="center" variant="body1">
            No Flags
          </Typography>
        </Stack>
      )}
      {order?.flag?.length && (
        <Stack gap={4}>
          <StyledOrderDetailBox
            title={
              <span>
                <FlagIcon color="#DD5B63" /> Flag Details
              </span>
            }
          >
            <Stack gap={2}>
              {order?.flag?.map((item, i, { length: l }) => (
                <Stack
                  gap={1.5}
                  key={item?._id}
                  pt={1.5}
                  pb={i === l - 1 ? 0 : 1.5}
                  borderBottom={i === l - 1 ? undefined : '1px solid #eee'}
                >
                  <StyledListItem label="Flag Type: " value={item?.type} />
                  <StyledListItem label="Flag Comment: " value={item?.comment} />
                </Stack>
              ))}
            </Stack>
          </StyledOrderDetailBox>
          <StyledOrderDetailBox title="Summary">
            <FlagSummary order={order} />
          </StyledOrderDetailBox>
          <Stack direction="column" gap="15px" pt="100px">
            <Button variant="contained" color="primary" fullWidth onClick={() => setButtonsOpen(!buttonsOpen)}>
              {buttonsOpen ? 'Less' : 'More'}
            </Button>
            {buttonsOpen && (
              <>
                <Button variant="contained" color="primary" fullWidth onClick={() => setButtonsOpen(!buttonsOpen)}>
                  Resolve Issue
                </Button>
                <Button variant="outlined" color="primary" fullWidth>
                  Contact Rider
                </Button>
                <Button variant="outlined" color="primary" fullWidth>
                  Contact Store
                </Button>
                <Button variant="outlined" color="primary" fullWidth>
                  Contact Customer
                </Button>
                <Button variant="outlined" color="primary" fullWidth>
                  Assign new rider
                </Button>
                <Button variant="outlined" color="error" fullWidth>
                  Cancel Order
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
