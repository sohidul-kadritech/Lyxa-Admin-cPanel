/* eslint-disable no-unused-vars */
import { Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { createEditShopData, getShopEditData } from '../../components/Shared/AddShop/helper';
import StyledSwitch from '../../components/Styled/StyledSwitch';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

export default function OrderToggle({ shop }) {
  const [, setRender] = useState(false);
  const [value, setValue] = useState(shop?.liveStatus === 'online');

  const mutation = useMutation((data) => AXIOS.post(Api.EDIT_SHOP, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);
      if (data?.status) {
        shop.liveStatus = data?.data?.shop?.liveStatus ?? shop.liveStatus;
        setRender((prev) => !prev);
      }
    },
  });

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
      }}
    >
      <Typography sx={{ fontSize: '16px', fontWeight: 500, color: value ? 'primary.main' : '#F78C3F', width: '115px' }}>
        {value ? 'Taking orders' : 'Orders paused'}
      </Typography>
      <StyledSwitch
        checked={value}
        onChange={() => {
          setValue((prev) => !prev);
          const shopData = getShopEditData(shop);

          createEditShopData(shopData)?.then((data) => {
            if (data?.status === false) {
              successMsg(data?.msg);
              return;
            }
            mutation.mutate({ ...data, liveStatus: value ? 'offline' : 'online' });
          });
        }}
      />
    </Stack>
  );
}