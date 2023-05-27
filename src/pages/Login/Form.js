import { Box, Button, Modal, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import StyledFormInput from './StyledFormInput';
import { credentialsInit, validateForm } from './helper';
// import forgetPassword from '../../store/auth/forgetpwd/reducer';
import ForgotPassword from './ForgotPassword';

export default function Form({ onSubmit, loginError, loading, loginFor }) {
  const theme = useTheme();
  const [credentials, setCredentials] = useState({ ...credentialsInit });
  const [errors, setErrors] = useState({ email: undefined, password: undefined });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [modal, setModal] = useState(false);

  const checkValidSubmit = () => {
    if (!touched.email && !touched.password) {
      validateForm(credentials, errors, setErrors);
      return;
    }

    if (Boolean(errors.email) || Boolean(errors.password)) {
      return;
    }

    onSubmit(credentials);
  };

  return (
    <Box
      sx={{
        width: '380px',
      }}
    >
      <Stack gap={5}>
        {Boolean(loginError) && (
          <Box
            sx={{
              background: '#e37b8233',
              padding: '8px 10px',
              border: `1px solid ${theme.palette.error.main}`,
            }}
          >
            <Typography variant="inherit" fontSize={12} lineHeight="20px" color="error">
              {loginError}
            </Typography>
          </Box>
        )}
        <StyledFormInput
          label="Email"
          placeholder="john.dowry@example.com"
          type="email"
          value={credentials.email}
          onChange={(e) => {
            setCredentials({ ...credentials, email: e.target.value });
            setTouched({ ...touched, email: true });
          }}
          error={Boolean(errors.email)}
          helperText={errors.email}
          onBlur={() => {
            validateForm(credentials, errors, setErrors);
          }}
        />
        <Box>
          <StyledFormInput
            label="Password"
            placeholder="XXXXXXXX"
            type="password"
            value={credentials.password}
            onChange={(e) => {
              setCredentials({ ...credentials, password: e.target.value });
              setTouched({ ...touched, password: true });
            }}
            error={Boolean(errors.password)}
            helperText={errors.password}
            onBlur={() => {
              validateForm(credentials, errors, setErrors);
            }}
          />
          <Typography
            variant="inherit"
            color="#fff"
            fontSize={14}
            lineHeight="20px"
            fontWeight={500}
            pt={2}
            textAlign="right"
            onClick={() => setModal(true)}
            sx={{
              cursor: 'pointer',
              transition: '200ms ease',

              '&:hover': {
                color: 'error.main',
              },
            }}
          >
            Forgot Password
          </Typography>
        </Box>
        <Box pt={4}>
          <Button
            variant="contained"
            fullWidth
            color="error"
            disabled={loading}
            onClick={checkValidSubmit}
            sx={{
              padding: '10px 30px',
              borderRadius: '7px',
            }}
          >
            Log In
          </Button>
          <Typography
            variant="inherit"
            color="#fff"
            fontSize={14}
            lineHeight="20px"
            fontWeight={500}
            pt={3}
            textAlign="center"
          >
            Join our network of restaurant partners
          </Typography>
        </Box>
      </Stack>
      <Modal open={modal} onClose={() => setModal(false)}>
        <ForgotPassword onClose={() => setModal(false)} loginFor={loginFor} />
      </Modal>
    </Box>
  );
}
