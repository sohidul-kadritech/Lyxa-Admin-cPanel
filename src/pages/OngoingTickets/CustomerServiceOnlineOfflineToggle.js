/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Stack, Typography } from '@mui/material';
import React from 'react';
import { useMutation } from 'react-query';
import StyledSwitch from '../../components/Styled/StyledSwitch';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';

function CustomerServiceOnlineOfflineToggle({ admin, sx, sxToggle }) {
  const { dispatchCurrentUser } = useGlobalContext();
  const customerServiceUpdateLiveStatusMutation = useMutation(
    () =>
      AXIOS.post(
        API_URL.EDIT_LIVE_STATUS,
        {},
        {
          params: { userType: 'admin' },
        },
      ),
    {
      onSuccess: (data) => {
        successMsg(data?.message, data?.status ? 'success' : undefined);
        if (data?.status) {
          admin.liveStatus = data?.data?.admin?.liveStatus ?? admin.liveStatus;
          dispatchCurrentUser({ type: 'admin', payload: { admin, isCurrentUser: true } });
        }
      },
      // eslint-disable-next-line prettier/prettier
    },
  );

  const value = admin?.liveStatus === 'online';

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap="15px"
      sx={{
        padding: '10px 16px',
        borderRadius: '7px',
        alignItems: 'center',
        backgroundColor: value ? 'rgba(94, 151, 169, 0.12)' : '#FCF9F0',
        ...(sx || {}),
      }}
    >
      <Typography sx={{ fontSize: '16px', fontWeight: 500, color: value ? 'primary.main' : '#F78C3F', width: '115px' }}>
        {value ? 'Online' : 'Offline'}
      </Typography>
      <StyledSwitch
        checked={value}
        disabled={admin?.liveStatus === 'busy'}
        sx={{
          ...(sxToggle || {}),
        }}
        onChange={() => {
          //   const shopData = getShopEditData(shop);
          //   createEditShopData(shopData)?.then((data) => {
          //     if (data?.status === false) {
          //       successMsg(data?.msg);
          //       return;
          //     }
          //     successMsg('Updating status....', 'success');
          customerServiceUpdateLiveStatusMutation.mutate();
          //   });
        }}
      />
    </Stack>
  );
}

export default CustomerServiceOnlineOfflineToggle;
