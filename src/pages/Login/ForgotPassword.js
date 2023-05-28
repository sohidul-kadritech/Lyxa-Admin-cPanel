import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import CloseButton from '../../components/Common/CloseButton';
import StyledRadioGroup from '../../components/Styled/StyledRadioGroup';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import { adminAccountTypes, businessAccountTypes, validateEmail } from './helper';

export default function ForgotPassword({ onClose, loginFor }) {
  const [accountType, setAccountType] = useState('');
  const [email, setEmail] = useState('');
  const [submitDisabled, setSuttonDisabled] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (accountType && validateEmail(email)) setSuttonDisabled(false);
    else setSuttonDisabled(true);
  }, [accountType, email]);

  const mutation = useMutation(
    () =>
      AXIOS.post(Api.FORGET_PASS, {
        type: accountType,
        to_email: email,
      }),
    {
      onSuccess: (data) => {
        console.log(data);
        if (!data?.status) {
          setError(data?.message);
        } else {
          setSuccess(data?.message);
        }
      },
    }
  );

  return (
    <Box
      sx={{
        background: '#fff',
        width: 'min(600px, 70vw)',
        padding: '14px 20px 20px',
        borderRadius: '8px',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" pb={2.5}>
        <Typography variant="inherit" sx={{ fontSize: '18px', fontWeight: 600, lineHeight: '24px' }}>
          Forgot Password
        </Typography>
        <CloseButton size="sm" onClick={onClose} />
      </Stack>
      {!success && (
        <Box>
          {error && (
            <Box
              sx={{
                background: '#e37b8233',
                padding: '8px 10px',
                border: `1px solid error.main`,
              }}
            >
              <Typography variant="inherit" fontSize={12} lineHeight="20px" color="error">
                {error}
              </Typography>
            </Box>
          )}
          <Stack gap={5} pt={3}>
            <StyledRadioGroup
              color="error"
              items={loginFor === 'team' ? adminAccountTypes : businessAccountTypes}
              value={accountType}
              sx={{
                flexDirection: 'row',
                gap: '20px',

                '& .MuiFormControlLabel-root': {
                  gap: '4px',
                },
              }}
              onChange={(e) => {
                setAccountType(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              placeholder="Your Email Address"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                margin: '0',

                '& .MuiInputBase-input': {
                  padding: '10px',
                },

                '& .MuiInputBase-root.Mui-focused': {
                  '& fieldset': {
                    borderColor: 'error.main',
                    borderWidth: '1px',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              color="error"
              fullWidth
              disabled={submitDisabled || mutation.isLoading}
              onClick={mutation.mutate}
              rounded
              sx={{
                fontSize: '14px',

                '&.Mui-disabled': {
                  opacity: '0.7',
                },
              }}
            >
              Submit
            </Button>
          </Stack>
        </Box>
      )}
      {success && (
        <Box
          sx={{
            background: '#417c4538',
            padding: '20px 10px',
            border: `1px solid`,
            borderColor: 'success.main',
          }}
        >
          <Typography variant="inherit" fontSize={14} lineHeight="20px" color="success.main">
            {success}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
