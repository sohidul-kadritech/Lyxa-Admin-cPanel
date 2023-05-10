import { Button, useTheme } from '@mui/material';
import { ReactComponent as CameraIcon } from '../../assets/icons/camera.svg';

export function validateEditedData(shopData) {
  const status = {
    status: false,
    msg: null,
  };

  const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  if (shopData?.email && !emailRegex.test(shopData?.email)) {
    status.msg = 'Email is not valid';
    return status;
  }

  if (!shopData?.password) {
    status.msg = 'Please provide your password';
    return status;
  }

  if (!shopData?.phone_number) {
    status.msg = 'Please provide your phone number';
    return status;
  }

  if (!shopData?.address) {
    status.msg = 'Please provide your phone number';
    return status;
  }
  if (!shopData?.zip_code) {
    status.msg = 'Please provide your Zip Code';
    return status;
  }
  if (!shopData?.shopLogo) {
    status.msg = 'Please provide your Shop logo';
    return status;
  }

  if (!shopData?.shopBanner) {
    status.msg = 'Please provide your Shop Banner';
    return status;
  }

  if (!shopData?.shopStatus) {
    status.msg = 'Please Select your Shop Status';
    return status;
  }

  if (!shopData?.bank_name) {
    status.msg = 'Please provide your bank account';
    return status;
  }

  if (!shopData?.account_name) {
    status.msg = 'Please provide your bank account name';
    return status;
  }

  if (!shopData?.bank_address) {
    status.msg = 'Please provide your bank address';
    return status;
  }
  if (!shopData?.bank_postal_code) {
    status.msg = 'Please provide your bank postal code';
    return status;
  }
  if (!shopData?.account_number) {
    status.msg = 'Please provide your bank account number';
    return status;
  }

  if (!shopData?.account_swift) {
    status.msg = 'Please provide your bank swift';
    return status;
  }

  // if(shopData?.)
  return { status: true };
}

export function CoverPhotoButton({ label }) {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      startIcon={<CameraIcon />}
      sx={{
        position: 'absolute',
        color: theme.palette.text.primary,
        bottom: 15,
        right: 15,
        backgroundColor: 'white',
        fontWeight: '600',
        fontSize: '16px',
        gap: 2,
        padding: '12px 24px',

        '& .MuiButton-startIcon': {
          margin: '0',
        },

        '&:hover': {
          background: '#d5d5d5',
        },
      }}
    >
      {label}
    </Button>
  );
}
