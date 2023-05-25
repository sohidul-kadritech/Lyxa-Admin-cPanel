import { Stack } from '@mui/material';
import AccountInfomation from './AccountInformation';
import CreditCards from './CreditCards';

export default function UserProfile({ user }) {
  return (
    <Stack gap={5}>
      <AccountInfomation user={user} />
      <CreditCards user={user} />
    </Stack>
  );
}
