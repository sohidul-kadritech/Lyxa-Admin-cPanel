import { Box, Stack } from '@mui/material';
import { useState } from 'react';
import { ReactComponent as LyxaIcon } from '../../assets/icons/lyxa-logo-lg.svg';
import { ReactComponent as LyxaText } from '../../assets/icons/lyxa-text-lg.svg';
import AccountSelect from './AccountSelect';
import Form from './Form';

const businessAccountTypes = [
  {
    value: 'seller',
    label: 'Seller Account',
  },
  {
    value: 'shop',
    label: 'Shop Account',
  },
];

export default function Login() {
  const [accountType, setAccountType] = useState('');

  return (
    <Box
      sx={{
        backgroundColor: '#363636',
        height: '100vh',
      }}
    >
      <Stack pt={6} pl={9}>
        <AccountSelect
          options={businessAccountTypes}
          value={accountType}
          onChange={(event) => {
            setAccountType(event.target.value);
          }}
          placeholder="For Business"
        />
      </Stack>
      <Stack alignItems="center" height="calc(100vh - 45px)" justifyContent="center">
        {/* logo */}
        <Stack alignItems="center" justifyContent="center" gap={2} pb={17}>
          <LyxaIcon />
          <LyxaText />
        </Stack>
        <Form />
      </Stack>
    </Box>
  );
}
