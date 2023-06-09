import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import CloseButton from '../../components/Common/CloseButton';

function ShopInfo({ title, theme, sx, children }) {
  return (
    <Box marginBottom="28px">
      <Typography variant="body4" sx={{ color: theme.palette.text.secondary2, ...sx }}>
        {title}
      </Typography>
      <Box marginTop="10px">{children}</Box>
    </Box>
  );
}

function ViewSellerInfo({ onClose, selectedSeller = {} }) {
  const theme = useTheme();
  console.log('selectedShop', selectedSeller);
  return (
    <Box
      sx={{
        width: '400px',
        padding: '0px 20px 25px 20px',
      }}
    >
      <Box>
        <Box
          sx={{
            position: 'sticky',
            top: '0',
            background: '#fff',
            padding: '25px 0px',
            zIndex: '999',
            marginBottom: '39px',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" gap={3}>
              <Avatar alt="user-image" src={selectedSeller?.profile_photo} sx={{ width: 36, height: 36 }}>
                {selectedSeller?.name?.length && selectedSeller?.name[0]}
              </Avatar>
              <Stack gap={0.5}>
                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  {selectedSeller?.name}
                </Typography>
                <Typography variant="body4" color="#737373">
                  {selectedSeller?.shops?.length || 0} Shops
                </Typography>
              </Stack>
            </Stack>
            <CloseButton
              disableRipple
              onClick={onClose}
              sx={{
                color: theme.palette.text.primary,
              }}
            />
          </Stack>
        </Box>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: '700',
              fontSize: '19px',
              lineHeight: '22.99px',
              color: theme.palette.text.primary,
              marginBottom: '43px',
            }}
          >
            View Seller
          </Typography>
          <ShopInfo title="Seller Name" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedSeller?.name}
            </Typography>
          </ShopInfo>
          <ShopInfo title="E-mail" theme={theme}>
            <Typography variant="body4">{selectedSeller?.email}</Typography>
          </ShopInfo>
          <ShopInfo title="Phone number" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4">{selectedSeller?.phone_number}</Typography>
          </ShopInfo>
          <ShopInfo title="Address" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4">{selectedSeller?.addressSeller?.address}</Typography>
          </ShopInfo>
          <ShopInfo title="Zip Code" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4">{selectedSeller?.addressSeller?.pin || '1233'}</Typography>
          </ShopInfo>
          <ShopInfo title="Shop Type" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedSeller?.sellerType}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Status" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedSeller?.status}
            </Typography>
          </ShopInfo>
        </Box>
      </Box>
    </Box>
  );
}

export default ViewSellerInfo;
