/* eslint-disable no-unused-vars */
import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { successMsg } from '../../../../helpers/successMsg';
import * as Api from '../../../../network/Api';
import AXIOS from '../../../../network/axios';

export default function ResolveOrderFlag({ order, setRender }) {
  const queryClient = useQueryClient();
  const [buttonsOpen, setButtonsOpen] = useState(false);
  const isAllResolved = order?.flag?.reduce((acc, curr) => acc && curr?.isResolved, true);
  const [toResolve, setToResolve] = useState(0);

  const flagResolve = useMutation((data) => AXIOS.post(Api.RESOLVE_MULTIPLE_FLAG, data), {
    onError: (error) => {
      console.log(error);
      successMsg(error, 'error');
    },

    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);

      if (data?.status) {
        order?.flag?.forEach((f) => {
          f.isResolved = true;
        });

        setRender((prev) => !prev);
        queryClient.invalidateQueries([Api.GET_ALL_FLAGGED_ORDERS]);
        queryClient.invalidateQueries([Api.ORDER_LIST]);
        queryClient.invalidateQueries(Api.URGENT_ORDER_COUNT);
        queryClient.invalidateQueries(Api.LATE_ORDER_COUNT);
      }
    },
  });

  return (
    <Stack direction="column" gap="15px" pt="30px">
      <Button variant="contained" color="primary" fullWidth onClick={() => setButtonsOpen(!buttonsOpen)}>
        {buttonsOpen ? 'Less' : 'More'}
      </Button>
      {buttonsOpen && (
        <>
          {order?.deliveryBoy?.number && (
            <Button variant="outlined" color="primary" fullWidth href={`tel:${order?.deliveryBoy?.number}`}>
              Contact Rider
            </Button>
          )}
          <Button variant="outlined" color="primary" fullWidth href={`tel:${order?.shop?.phone_number}`}>
            Contact Store
          </Button>
          {order?.user?.phone_number && (
            <Button variant="outlined" color="primary" fullWidth href={`tel:${order?.shop?.phone_number}`}>
              Contact Customer
            </Button>
          )}
          {/* <Button variant="outlined" color="primary" fullWidth>
            Assign new rider
          </Button> */}
          {/* <Button variant="outlined" color="error" fullWidth>
            Cancel Order
          </Button> */}
        </>
      )}
    </Stack>
  );
}
