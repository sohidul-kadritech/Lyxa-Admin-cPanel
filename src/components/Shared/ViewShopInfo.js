import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import CloseButton from '../Common/CloseButton';
import Rating from '../Common/Rating';

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
            paddingTop: '25px',
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
          <ShopInfo title="Seller" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.seller?.name}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Unique ID" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.autoGenId}
            </Typography>
          </ShopInfo>
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
          <ShopInfo title="Payment Options" sx={{ textTransform: 'capitalize' }} theme={theme}>
            {/* <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.shopType}
            </Typography> */}

            {selectedShop?.paymentOption.length > 0 ? (
              <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                {selectedShop?.paymentOption.join(', ')}
              </Typography>
            ) : (
              <Box>
                {' '}
                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  No Methods Found
                </Typography>
              </Box>
            )}
          </ShopInfo>
          <ShopInfo title="Tags & Cuisines" sx={{ textTransform: 'capitalize' }} theme={theme}>
            {selectedShop?.tags?.length > 0 || selectedShop?.cuisineType?.length > 0 ? (
              <>
                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  {selectedShop?.tags.join(', ')}
                </Typography>
                {/* <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  {selectedShop?.cuisineType.join(', ')}
                </Typography> */}

                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  {selectedShop?.cuisineType.map((item) => item.name).join(', ')}
                </Typography>
              </>
            ) : (
              <Box>
                {' '}
                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  No Tags & Cuisines Found
                </Typography>
              </Box>
            )}
          </ShopInfo>

          <ShopInfo title="Dietary" sx={{ textTransform: 'capitalize' }} theme={theme}>
            {selectedShop?.dietary?.length > 0 ? (
              <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                {selectedShop?.dietary.join(', ')}
              </Typography>
            ) : (
              <Box>
                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  No Dietary Found
                </Typography>
              </Box>
            )}
          </ShopInfo>
          <ShopInfo title="Delivery Method" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.haveOwnDeliveryBoy ? 'Store' : 'Lyxa'}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Delivery Charge Apply" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.deliveryChargeApply ? 'Yes' : 'NO'}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Delivery Charge" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.deliveryFee}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Rider Fee (Per KM)" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.deliveryFeePerKm}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Status" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.shopStatus}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Bank Account Name" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.account_name}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Bank Account Nr / IBAN" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.account_number}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Bank Name" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.bank_name}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Bank Address" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.bank_address}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Bank Postal Code" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.bank_postal_code}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Bank SWIFT" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.account_swift}
            </Typography>
          </ShopInfo>
        </Box>
      </Box>
    </Box>
  );
}

export default ViewShopInfo;
