import { Email } from '@mui/icons-material';
import { Box } from '@mui/material';
import { ReactComponent as Loacation } from '../../assets/icons/location.svg';
import { ReactComponent as Phone } from '../../assets/icons/phone.svg';
import ProfileSidebarInfo from '../../components/Common/ProfileSidebarInfo';

export default function RiderDetails({ user }) {
  const address = user?.address?.find((adrs) => adrs.primary) || user?.address?.at(0) || user?.address[0];

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
      <ProfileSidebarInfo label="Phone number" value={user?.number} icon={Phone} />
      <ProfileSidebarInfo label="Location" value={address?.address} icon={Loacation} />
      <ProfileSidebarInfo label="Vehicle Type" value={user?.vehicleType} icon={Loacation} />
      <ProfileSidebarInfo label="Vehicle Number" value={user?.vehicleNumber} icon={Loacation} />
      <ProfileSidebarInfo label="Area Covered" value="Rampura" icon={Loacation} />
      <ProfileSidebarInfo label="Shift" value={user?.shift} icon={Loacation} />
    </Box>
  );
}
