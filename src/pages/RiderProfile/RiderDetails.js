import { Email } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { ReactComponent as Loacation } from '../../assets/icons/location.svg';
import { ReactComponent as Phone } from '../../assets/icons/phone.svg';
import ProfileSidebarInfo from '../../components/Common/ProfileSidebarInfo';

export default function RiderDetails({ rider }) {
  console.log(rider);

  return (
    <Stack gap="40px" flexDirection="column">
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
    </Stack>
  );
}
