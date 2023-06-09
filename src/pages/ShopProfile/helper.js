import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import { ReactComponent as CameraIcon } from '../../assets/icons/camera.svg';
import { getImageUrl } from '../../helpers/images';

export const getQueryParamsInit = (params) => ({
  endDate: moment().format('YYYY-MM-DD'),
  startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),
  searchKey: '',
  sortBy: 'DESC',
  ...params,
});

export const menuOtions = (userType) => {
  const options = [
    {
      label: 'Edit Shop',
      value: 'edit',
    },
  ];

  if (userType !== 'shop') {
    options?.push({
      label: 'Access as Shop',
      value: 'access-shop',
    });
  }

  return options;
};

export const createShopData = async (shopData) => {
  const img_url_logo = await getImageUrl(shopData.shopLogo[0]);
  const img_url_banner = await getImageUrl(shopData.shopBanner[0]);

  if (!img_url_logo) {
    return {
      status: false,
      msg: 'Error uploading shop logo image!',
    };
  }
  if (!img_url_banner) {
    return {
      status: false,
      msg: 'Error uploading shop banner image',
    };
  }

  shopData.shopAddress = shopData.address;
  delete shopData.address;

  return {
    id: shopData?._id,
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

export function CoverPhotoButton({ label, onDrop, loading }) {
  const theme = useTheme();

  return (
    <Button
      disabled={loading}
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

        '&.Mui-disabled': {
          backgroundColor: 'white',
          opacity: '0.8',
          color: '#363636!important',
        },
      }}
    >
      <input hidden onChange={(e) => onDrop([e.target.files[0]])} accept="image/*" type="file" />
      {label}
    </Button>
  );
}

export function AverageOrderValue(totalProductsAmount, totalOrder) {
  return totalProductsAmount / totalOrder || 0;
}

export function TagsAndCuisines(tags, cuisines) {
  console.log(tags, cuisines);
  return ` ${tags?.join(', ')}${cuisines?.length ? ', ' : ''}${cuisines?.map((cuisines) => cuisines.name).join(', ')}`;
}

export function convertTimeToAmPm(time) {
  const date = new Date();
  const [hours, minutes] = time.split(':');
  date.setHours(hours, minutes, 0, 0);
  const suffix = hours >= 12 ? 'P.M' : 'A.M';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${suffix}`;
}

export function openingHours(normalHours) {
  const openingHoursSx = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#363636',
  };
  const dayStructure = (day) => {
    if (day.toLowerCase() === 'saturday') return 'Sat.';
    if (day.toLowerCase() === 'sunday') return 'Sun.';
    if (day.toLowerCase() === 'monday') return 'Mon.';
    if (day.toLowerCase() === 'tuesday') return 'Tue.';
    if (day.toLowerCase() === 'wednesday') return 'Wed.';
    if (day.toLowerCase() === 'thursday') return 'Thu.';
    if (day.toLowerCase() === 'friday') return 'Fri.';

    return '';
  };

  return (
    <Stack direction="column" gap="10px">
      {normalHours?.map((week, i) => (
        <Box key={i}>
          <Stack direction="row">
            <Typography sx={openingHoursSx} width="40px" variant="inherit">
              {dayStructure(week.day)}
            </Typography>
            {week.isActive ? (
              <>
                {' '}
                <Typography sx={openingHoursSx} variant="inherit">
                  {convertTimeToAmPm(week.open)} - {convertTimeToAmPm(week.close)}
                </Typography>
              </>
            ) : (
              <Typography sx={openingHoursSx} variant="inherit">
                Closed
              </Typography>
            )}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
