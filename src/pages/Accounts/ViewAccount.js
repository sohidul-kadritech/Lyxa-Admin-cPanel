/* eslint-disable no-unused-vars */
import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import CloseButton from '../../components/Common/CloseButton';
import UserAvatar from '../../components/Common/UserAvatar';
import ViewUserInfoItem from '../../components/Common/ViewUserInfoItems';

export default function ViewAccountInfo({ onClose, user = {} }) {
  console.log(user);
  const address = user?.address?.find((adrs) => adrs.primary) || user?.address?.at(0) || user?.address[0];

  return (
    <Box
      sx={{
        width: '400px',
        padding: '0px 20px 25px 20px',
      }}
    >
      <Box>
        <Box
          sx={{
            position: 'sticky',
            top: '0',
            background: '#fff',
            padding: '25px 0px 40px',
            zIndex: '999',
            // marginBottom: '39px',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <UserAvatar
              name={user?.name}
              imgUrl={user?.profile_photo}
              subTitle={`${user?.orderCompleted} order completed`}
              titleProps={{ sx: { marginBottom: '-3px' } }}
            />
            <CloseButton
              disableRipple
              onClick={onClose}
              sx={{
                color: 'text.primary',
              }}
            />
          </Stack>
        </Box>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: '700',
              fontSize: '19px',
              lineHeight: '22.99px',
              color: 'text.primary',
              marginBottom: '43px',
            }}
          >
            View Account
          </Typography>
          {/* ========================= */}
          <Box>
            <ViewUserInfoItem title="Account Name" value={user?.name} />
            <ViewUserInfoItem title="E-mail" value={user?.email} valueSx={{ textTransform: 'normal' }} />
            <ViewUserInfoItem title="Phone Number" value={user?.phone_number} />
            <ViewUserInfoItem title="Address" value={address?.address} />
            {user?.dob && <ViewUserInfoItem title="Date of Birth" value={moment(user?.dob).format('MMM DD, YYYY')} />}
            {user?.gender && <ViewUserInfoItem title="Gender" value={user?.gender} />}
            <ViewUserInfoItem title="Status" value={user?.status} />
            <ViewUserInfoItem title="Balance" value={user?.tempBalance?.toFixed(2)} />
            <ViewUserInfoItem title="Points" value={user?.tempRewardPoints} />
            <ViewUserInfoItem title="Verified" value={user?.phoneVerify ? 'Yes' : 'No'} />
            <ViewUserInfoItem title="Register Type" value={user?.registerType} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
