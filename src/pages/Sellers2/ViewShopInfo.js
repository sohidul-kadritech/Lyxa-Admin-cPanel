import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import CloseButton from '../../components/Common/CloseButton';
import Rating from '../../components/Common/Rating';

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

function ViewShopInfo({ onClose, selectedShop = {} }) {
  const theme = useTheme();
  console.log('selectedShop', selectedShop);
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
              <Avatar alt="user-image" src={selectedShop?.shopLogo} sx={{ width: 36, height: 36 }}>
                {selectedShop?.shopName?.length && selectedShop?.shopName[0]}
              </Avatar>
              <Stack gap={0.5}>
                <Typography variant="body4">{selectedShop?.shopName}</Typography>
                <Typography variant="body4" color="#737373">
                  {selectedShop?.totalOrder || 0} orders
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
            View Shop
          </Typography>
          <ShopInfo title="Shop Name" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.shopName}
            </Typography>
          </ShopInfo>
          <ShopInfo title="E-mail" theme={theme}>
            <Typography variant="body4">{selectedShop?.email}</Typography>
          </ShopInfo>
          <ShopInfo title="Phone number" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4">{selectedShop?.phone_number}</Typography>
          </ShopInfo>
          <ShopInfo title="rating" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Rating
              amount={selectedShop?.rating}
              titleSx={{
                fontSize: '15px',
                fontWeight: 500,
              }}
            />
          </ShopInfo>
          <ShopInfo title="Address" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4">{selectedShop?.address?.address}</Typography>
          </ShopInfo>
          <ShopInfo title="Zip Code" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4">{selectedShop?.address?.pin || '1233'}</Typography>
          </ShopInfo>
          <ShopInfo title="Shop Type" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.shopType}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Status" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.shopStatus}
            </Typography>
          </ShopInfo>
        </Box>
      </Box>
    </Box>
  );
}

export default ViewShopInfo;
