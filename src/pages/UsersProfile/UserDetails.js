/* eslint-disable no-unused-vars */
import { Email } from '@mui/icons-material';
import { Box } from '@mui/material';
import moment from 'moment';
import { ReactComponent as Calender } from '../../assets/icons/calender.svg';
import { ReactComponent as Dob } from '../../assets/icons/dob.svg';
import { ReactComponent as Gender } from '../../assets/icons/gender.svg';
import { ReactComponent as Loacation } from '../../assets/icons/location.svg';
import { ReactComponent as Phone } from '../../assets/icons/phone.svg';
import { ReactComponent as Register } from '../../assets/icons/register.svg';
import { ReactComponent as Warning } from '../../assets/icons/warning-icon.svg';
import ProfileSidebarInfo from '../../components/Common/ProfileSidebarInfo';

export default function UserDetails({ user = {} }) {
  const address = user?.address?.find((adrs) => adrs.primary) || user?.address?.at(0) || user?.address[0];
  console.log(user);

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
        value={user?.email}
        icon={Email}
        valueSx={{
          textTransform: 'none',
        }}
      />
      <ProfileSidebarInfo label="Phone number" value={user?.phone_number} icon={Phone} />
      <ProfileSidebarInfo label="Location" value={address?.address || 'Address not found'} icon={Loacation} />
      {user?.dob && (
        <ProfileSidebarInfo label="Date of Birth" value={moment(user?.dob).format('MMM DD, YYYY')} icon={Dob} />
      )}
      {user?.gender && <ProfileSidebarInfo label="Date of Birth" value={user?.gender} icon={Gender} />}
      <ProfileSidebarInfo label="Join Date" value={moment(user?.createdAt).format('MMM DD, YYYY')} icon={Calender} />
      <ProfileSidebarInfo label="Status" value={user?.status} icon={Warning} />
      <ProfileSidebarInfo label="Register Type" value={user?.registerType} icon={Register} />
    </Box>
  );
}
