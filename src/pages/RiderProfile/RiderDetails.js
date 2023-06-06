import { Email } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { ReactComponent as Loacation } from '../../assets/icons/location.svg';
import { ReactComponent as LogoutIcon } from '../../assets/icons/logout.svg';
import { ReactComponent as Phone } from '../../assets/icons/phone.svg';
import ProfileSidebarInfo from '../../components/Common/ProfileSidebarInfo';
import { successMsg } from '../../helpers/successMsg';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';

export default function RiderDetails({ rider }) {
  const [, setRender] = useState(false);
  const queryClient = useQueryClient();

  const update = useMutation((data) => AXIOS.post(Api.EDIT_DELIVERY_MAN, data), {
    onSuccess: (data) => {
      successMsg(data?.message, data?.status ? 'success' : undefined);
      if (data?.status) {
        queryClient.invalidateQueries([Api.ALL_DELIVERY_MAN]);
        rider.isLogin = false;
        setRender((prev) => !prev);
      }
    },

    onError: (error) => {
      console.log(error);
      successMsg(error?.message);
    },
  });

  return (
    <Box
      pb={12}
      sx={{
        display: 'grid',
        rowGap: '40px',
        gridTemplateColumns: {
          lg: '1fr',
          md: '1fr 1fr',
        },
      }}
    >
      <ProfileSidebarInfo
        label="Email"
        value={rider?.email}
        icon={Email}
        valueSx={{
          textTransform: 'none',
        }}
      />
      <ProfileSidebarInfo label="Phone number" value={rider?.number} icon={Phone} />
      <ProfileSidebarInfo label="Location" value={rider?.address} icon={Loacation} />
      <ProfileSidebarInfo label="Vehicle Type" value={rider?.vehicleType} icon={Loacation} />
      <ProfileSidebarInfo label="Vehicle Number" value={rider?.vehicleNumber} icon={Loacation} />
      <ProfileSidebarInfo label="Area Covered" value="Rampura" icon={Loacation} />
      <ProfileSidebarInfo label="Shift" value={rider?.shift} icon={Loacation} />
      <Box>
        <Button
          variant="text"
          disableRipple
          color="error"
          startIcon={<LogoutIcon />}
          disabled={update.isLoading}
          onClick={() => {
            update.mutate({ id: rider._id, isLogin: false });
          }}
        >
          Force Log out
        </Button>
      </Box>
    </Box>
  );
}
