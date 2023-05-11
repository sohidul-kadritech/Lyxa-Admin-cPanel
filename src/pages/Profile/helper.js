import { Box, Button, Typography, useTheme } from '@mui/material';
import { ReactComponent as CameraIcon } from '../../assets/icons/camera.svg';
import { getImageUrl } from '../../helpers/images';

export function convertTime(timeString) {
  const hours = timeString.slice(0, 2);
  const minutes = timeString.slice(2, 4);
  return `${hours}:${minutes}`;
}

export const createShopData = async (shopData) => {
  const img_url_logo = await getImageUrl(shopData.shopLogo[0]);
  const img_url_banner = await getImageUrl(shopData.shopBanner[0]);

  if (!img_url_logo) {
    return {
      status: false,
      msg: 'Error while Shop Logo image is uploading!',
    };
  }
  if (!img_url_banner) {
    return {
      status: false,
      msg: 'Error while Shop Banner image is uploading!',
    };
  }

  shopData.shopAddress = shopData.address;
  delete shopData.address;

  return {
    //
    id: shopData?._id,
    shopStartTime: convertTime(shopData?.shopStartTime),
    shopEndTime: convertTime(shopData?.shopEndTime),
    shopName: shopData?.shopName,
    email: shopData?.email,
    password: shopData?.password,
    phone_number: shopData?.phone_number,
    shopStatus: shopData?.shopStatus,
    bank_name: shopData?.bank_name,
    account_name: shopData?.account_name,
    account_number: shopData?.account_number,
    bank_address: shopData?.bank_address,
    bank_postal_code: shopData?.bank_postal_code,
    account_swift: shopData?.account_swift,
    //

    shopAddress: {
      address: shopData?.shopAddress?.address,
      latitude: shopData?.shopAddress?.latitude,
      longitude: shopData?.shopAddress?.longitude,
      country: shopData?.shopAddress?.country,
      state: shopData?.shopAddress?.state,
      city: shopData?.shopAddress?.city,
      pin: shopData?.shopAddress?.pin,
      primary: false,
      note: shopData?.shopAddress?.note,
    },
    shopLogo: img_url_logo,
    shopBanner: img_url_banner,
  };
};

export function validateEditedData(shopData) {
  const status = {
    status: false,
    msg: null,
  };

  const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  if (!shopData?.email) {
    status.msg = 'Please provide your email';
    return status;
  }
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
  if (!shopData?.address?.pin) {
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

  return { status: true };
}

export function CoverPhotoButton({ label, onDrop }) {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      aria-label="upload picture"
      component="label"
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
      <input hidden onChange={(e) => onDrop([e.target.files[0]])} accept="image/*" type="file" />
      {label}
    </Button>
  );
}

export function StyledOrderDetailBox({ title, children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '10px',
        padding: '12px 16px',
      }}
    >
      {title && (
        <Typography variant="body4" display="block" pb={2} fontWeight={600}>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}
