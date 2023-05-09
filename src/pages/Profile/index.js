import { Avatar, Box, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { ReactComponent as CameraIcon } from '../../assets/icons/camera.svg';
import { ReactComponent as StarIcon } from '../../assets/icons/star.svg';
import PageTop from '../../components/Common/PageTop';
import { CoverPhotoButton } from './helper';

export default function ShopProfile() {
  const shop = useSelector((store) => store.Login.admin);
  //   console.log(shop);
  // eslint-disable-next-line no-unused-vars
  const theme = useTheme();
  return (
    <Box>
      <PageTop title="Profie" />
      {/* main container */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          paddingTop: '45px',
        }}
      >
        {/* left */}
        <Box
          sx={{
            paddingRight: '50px',
            borderRight: '1px solid #EEEEEE',
          }}
        >
          {/* banner */}
          <Box
            sx={{
              borderRadius: '7px',
              overflow: 'hidden',
              height: '350px',
              width: '100%',
              position: 'relative',
            }}
          >
            <img
              src={shop?.shopBanner}
              alt="Banner"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <CoverPhotoButton label="Add Cover Photo" />
          </Box>
          {/* logo */}
          <Stack direction="row" gap="21px" pt={4.5}>
            <Box sx={{ position: 'relative' }}>
              <Avatar src={shop.shopLogo} alt="Shop" variant="circular" sx={{ width: 175, height: 175 }}>
                {shop?.shopName
                  ?.split(' ')
                  .reduce((prev, cur) => prev + cur.charAt(0), '')
                  .slice(0, 3)}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: '129px',
                  left: '129px',
                  backgroundColor: '#E4E6EB',
                  width: '38px',
                  height: '38px',
                  padding: '9px 9px 11px 9px',
                  '&:hover': {
                    backgroundColor: theme.palette.background.secondaryHover,
                  },
                }}
                color={theme.palette.text.primary}
                aria-label="upload picture"
                component="label"
              >
                <input hidden accept="image/*" type="file" />
                <CameraIcon />
              </IconButton>
            </Box>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '9px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {/* Active Badges */}
                <Box sx={{ background: '#417C45', width: '11px', height: '11px', borderRadius: '50%' }}></Box>
                <Box>
                  <Box>
                    <Typography
                      variant="h2"
                      sx={{ fontSize: { xs: '14px', sm: '16px', md: '20px', lg: '30px' }, fontWeight: 500 }}
                    >
                      Roadster Diner
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography
                    sx={{ color: theme.palette.primary.main, fontSize: '15px', fontWeight: '600', marginLeft: '8px' }}
                  >
                    @account manager
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ marginLeft: '20px', marginTop: '9px' }}>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary2,
                    fontSize: { xs: '14px', sm: '16px', md: '18px', lg: '20px' },
                    fontWeight: 500,
                  }}
                >
                  Lunch, Dinner, Cafes, Breakfast . $$
                </Typography>

                <Box>
                  <Box
                    sx={{
                      color: '#417C45',
                      marginTop: '14px',
                      fontSize: { xs: '12px', sm: '12px', md: '14px', lg: '16px' },
                    }}
                  >
                    {' '}
                    <StarIcon />{' '}
                    <Typography variant="span" sx={{ fontWeight: 600 }}>
                      4.2
                    </Typography>{' '}
                    <Typography variant="span" sx={{ fontWeight: 400, color: theme.palette.text.secondary2 }}>
                      (100+ Reviews)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Box>
        {/* right */}
        <Box
          sx={{
            paddingLeft: '50px',
          }}
        ></Box>
      </Box>
    </Box>
  );
}
