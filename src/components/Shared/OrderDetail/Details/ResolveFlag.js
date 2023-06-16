/* eslint-disable no-unused-vars */
import { Button, Stack } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { successMsg } from '../../../../helpers/successMsg';
import * as Api from '../../../../network/Api';
import AXIOS from '../../../../network/axios';

export default function ResolveOrderFlag({ order }) {
  const queryClient = useQueryClient();
  const [buttonsOpen, setButtonsOpen] = useState(false);
  const isAllResolved = order?.flag?.reduce((acc, curr) => acc && curr?.isResolved, true);
  const [toResolve, setToResolve] = useState(0);

  const flagResolve = useMutation((data) => AXIOS.post(Api.RESOLVE_FLAG, data), {
    onError: (error) => {
      console.log(error);
      successMsg(error, 'error');
    },

    onSuccess: (data) => {
      if (data?.status) {
        setToResolve((prev) => {
          if (prev === 1) successMsg(data?.message, 'success');
          return prev - 1;
        });

        const cFlag = order?.flag?.find((f) => f?._id !== data?.data?._id);
        cFlag.isResolved = true;

        queryClient.invalidateQueries([Api.GET_ALL_FLAGGED_ORDERS]);
        queryClient.invalidateQueries([Api.ORDER_LIST]);
      } else {
        successMsg(data?.message, 'warn');
      }
    },
  });

  const resolveAll = () => {
    order?.flag?.forEach((f) => {
      setToResolve((prev) => prev + 1);
      if (!f.isResolved) {
        flagResolve.mutate({
          id: f?._id,
          resolved: true,
        });
      }
    });
  };

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!order?.flag?.length) return <></>;

  return (
    <Stack direction="column" gap="15px" pt="30px">
      <Button variant="contained" color="primary" fullWidth onClick={() => setButtonsOpen(!buttonsOpen)}>
        {buttonsOpen ? 'Less' : 'More'}
      </Button>
      {buttonsOpen && (
        <>
          {!isAllResolved && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={flagResolve?.isLoading}
              onClick={() => {
                resolveAll();
              }}
            >
              Resolve Issue
            </Button>
          )}
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
          <Button variant="outlined" color="primary" fullWidth>
            Assign new rider
          </Button>
          <Button variant="outlined" color="error" fullWidth>
            Cancel Order
          </Button>
        </>
      )}
    </Stack>
  );
}
