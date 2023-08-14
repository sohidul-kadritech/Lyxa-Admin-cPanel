import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { ReactComponent as Calender } from '../../assets/icons/calender.svg';
import { ReactComponent as Dob } from '../../assets/icons/dob.svg';
import { ReactComponent as Email } from '../../assets/icons/email.svg';
import { ReactComponent as Gender } from '../../assets/icons/gender.svg';
import { ReactComponent as Loacation } from '../../assets/icons/location.svg';
import { ReactComponent as Phone } from '../../assets/icons/phone.svg';
import { ReactComponent as Register } from '../../assets/icons/register.svg';
import { ReactComponent as Reward } from '../../assets/icons/reward-fill.svg';
import { ReactComponent as Scale } from '../../assets/icons/scale.svg';
import { ReactComponent as Check } from '../../assets/icons/timeline-check.svg';
import { ReactComponent as Account } from '../../assets/icons/user.svg';
import { ReactComponent as Warning } from '../../assets/icons/warning-icon.svg';
import ProfileSidebarInfo from '../../components/Common/ProfileSidebarInfo';

export default function UserDetails({ user = {} }) {
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
      <ProfileSidebarInfo label="Account Name" value={user?.name} icon={Account} />
      <ProfileSidebarInfo
        label="Email"
        value={user?.email}
        icon={Email}
        valueSx={{
          textTransform: 'none',
        }}
      />
      <ProfileSidebarInfo label="Phone number" value={user?.phone_number} icon={Phone} />
      {user?.address?.length ? (
        <UserAddress address={user?.address} />
      ) : (
        <ProfileSidebarInfo label="Address" value="Not Added" icon={Loacation} />
      )}
      <ProfileSidebarInfo
        label="Date of Birth"
        value={user?.dob ? moment(user?.dob).format('MMM DD, YYYY') : 'Not Added'}
        icon={Dob}
      />
      {user?.gender && <ProfileSidebarInfo label="Gender" value={user?.gender} icon={Gender} />}
      <ProfileSidebarInfo label="Join Date" value={moment(user?.createdAt).format('MMM DD, YYYY')} icon={Calender} />
      <ProfileSidebarInfo label="Status" value={user?.status} icon={Warning} />
      <ProfileSidebarInfo label="Lyxa Balance" value={(user?.tempBalance || 0)?.toFixed(2)} icon={Scale} />
      <ProfileSidebarInfo label="Reward Points" value={Math.round(user?.tempRewardPoints)} icon={Reward} />
      <ProfileSidebarInfo label="Number Verified" value={user?.phoneVerify ? 'Yes' : 'No'} icon={Check} />
      <ProfileSidebarInfo label="Register Type" value={user?.registerType} icon={Register} />
    </Box>
  );
}

function UserAddress({ address }) {
  return (
    <Box>
      <Stack direction="row" sx={{ justifyItems: 'center', alignItems: 'center', gap: '11px' }} pb={4.5}>
        <Loacation />
        <Typography variant="inherit" sx={{ fontSize: '14px', fontWeight: '600' }}>
          Address
        </Typography>
      </Stack>
      <Stack gap={4}>
        {address?.map((item) => (
          <Typography
            key={item?.id}
            variant="inherit"
            sx={{ textTransform: 'capitalize', fontSize: '14px', fontWeight: '500' }}
          >
            {item?.address}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}
