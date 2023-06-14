import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import CloseButton from '../../components/Common/CloseButton';

export const getSellerCredentials = (sellerData) => {
  const parrentUser = [{ name: sellerData?.name }];
  const childUsers = sellerData?.childSellers?.map((user) => ({ name: user?.name }));
  return [...parrentUser, ...childUsers];
};

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
                {selectedSeller?.name?.length > 0 && selectedSeller?.name[0]}
              </Avatar>
              <Stack gap={0.5}>
                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  {selectedSeller?.name}
                </Typography>
                <Typography variant="body4" color="#737373">
                  {selectedSeller?.shops?.length > 0 ? selectedSeller?.shops?.length : 0} Shops
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
          <ShopInfo title="Unique ID" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4">{selectedSeller?.autoGenId}</Typography>
          </ShopInfo>
          <ShopInfo title="Seller Name" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedSeller?.name}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Company Name" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedSeller?.company_name}
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
          <ShopInfo title="Total Order" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4">{selectedSeller?.totalOrder || 0}</Typography>
          </ShopInfo>
          <ShopInfo title="Seller charge Type" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedSeller?.sellerChargeType || 'Global'}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Lyxa charge" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4">
              {selectedSeller?.sellerChargeType !== 'global'
                ? selectedSeller?.dropPercentage
                : selectedSeller?.globalDropPercentage || 0}
              %
            </Typography>
          </ShopInfo>
          <ShopInfo title="Seller Type" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedSeller?.sellerType}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Status" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedSeller?.status}
            </Typography>
          </ShopInfo>

          <ShopInfo title="National ID" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <img style={{ width: '150px', objectFit: 'cover' }} src={selectedSeller?.national_id} alt="NID_CARD"></img>
          </ShopInfo>
          <ShopInfo title="Contract Paper" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <img
              style={{ width: '150px', objectFit: 'cover' }}
              src={selectedSeller?.sellerContractPaper}
              alt="seller_contract_paper"
            ></img>
          </ShopInfo>
          <ShopInfo title="Certificate of incorporation" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <img
              style={{ width: '150px', objectFit: 'cover' }}
              src={selectedSeller?.certificate_of_incorporation}
              alt="seller_contract_paper"
            ></img>
          </ShopInfo>
          <ShopInfo title="Seller Team" sx={{ textTransform: 'capitalize' }} theme={theme}>
            {getSellerCredentials(selectedSeller)?.length > 0 ? (
              <Stack
                direction="column"
                gap="8px"
                sx={{
                  maxWidth: '250px',
                  maxHeight: '250px',
                  padding: '8px',
                  borderRadius: '7px',
                  border: `1px solid ${theme.palette.custom.border}`,
                  overflow: 'auto',
                }}
              >
                {getSellerCredentials(selectedSeller).map((seller, i) => (
                  <Stack key={i} direction="row" gap="6px" alignItems="center">
                    <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                      {i + 1}
                    </Typography>
                    <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                      {seller?.name}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Box>
                <Stack gap="4px">
                  <Stack direction="row" gap="4px" alignItems="center">
                    <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                      No Seller Team
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            )}
          </ShopInfo>
        </Box>
      </Box>
    </Box>
  );
}

export default ViewSellerInfo;
