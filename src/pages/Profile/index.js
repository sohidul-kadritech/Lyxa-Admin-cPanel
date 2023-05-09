import { Avatar, Box, IconButton, Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { ReactComponent as CameraIcon } from '../../assets/icons/camera.svg';
import PageTop from '../../components/Common/PageTop';
import { CoverPhotoButton } from './helper';

export default function ShopProfile() {
  const shop = useSelector((store) => store.Login.admin);
  //   console.log(shop);

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
          <Stack pt={4.5}>
            <Box>
              <Avatar src={shop.shopLogo} alt="Shop" variant="circular" sx={{ width: 175, height: 175 }}>
                {shop?.shopName
                  ?.split(' ')
                  .reduce((prev, cur) => prev + cur.charAt(0), '')
                  .slice(0, 3)}
              </Avatar>
              <IconButton color="secondary" aria-label="upload picture" component="label">
                <input hidden accept="image/*" type="file" />
                <CameraIcon />
              </IconButton>
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
