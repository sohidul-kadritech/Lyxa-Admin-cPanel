import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { AverageOrderValue, TagsAndCuisines, openingHours } from '../../pages/ShopProfile/helper';
import CloseButton from '../Common/CloseButton';
import Rating from '../Common/Rating';

const getDeliveryFee = (selectedShop) => {
  const isFreeDelivery =
    selectedShop?.marketings?.length > 0
      ? selectedShop?.marketings?.find(
          // eslint-disable-next-line prettier/prettier
          (marketing) => marketing.type === 'free_delivery' && marketing.status === 'active' && marketing.isActive
        )
      : null;
  if (selectedShop.haveOwnDeliveryBoy && !isFreeDelivery) {
    return {
      status: true,
      value: selectedShop?.deliveryFee,
    };
  }
  if (selectedShop.haveOwnDeliveryBoy && isFreeDelivery) {
    return {
      status: true,
      value: 0,
    };
  }
  return {
    status: false,
    value: 0,
  };
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
              {selectedShop?.seller?.company_name}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Unique ID" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4">{selectedShop?.autoGenId}</Typography>
          </ShopInfo>
          <ShopInfo title="Shop Name" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.shopName}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Shop Manager" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.name}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Shop Type" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.shopType}
            </Typography>
          </ShopInfo>

          <ShopInfo title="E-mail" theme={theme}>
            <Typography variant="body4">{selectedShop?.email}</Typography>
          </ShopInfo>

          <ShopInfo title="Location" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4">{selectedShop?.address?.address}</Typography>
          </ShopInfo>
          <ShopInfo title="Zip Code" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4">{selectedShop?.address?.pin || '1233'}</Typography>
          </ShopInfo>
          <ShopInfo title="Delivery by" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.haveOwnDeliveryBoy ? 'Store' : 'Lyxa'}
            </Typography>
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
          <ShopInfo title="Payment Options" sx={{ textTransform: 'capitalize' }} theme={theme}>
            {selectedShop?.paymentOption?.length > 0 ? (
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
              <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                {TagsAndCuisines(selectedShop?.tags, selectedShop?.cuisineType)}
              </Typography>
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

          {getDeliveryFee(selectedShop).status && (
            <ShopInfo title="Delivery Charge" sx={{ textTransform: 'capitalize' }} theme={theme}>
              <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                {getDeliveryFee(selectedShop)?.value}
              </Typography>
            </ShopInfo>
          )}

          <ShopInfo title="Status" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.shopStatus}
            </Typography>
          </ShopInfo>

          <ShopInfo title="Average Ord. Value" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {AverageOrderValue(selectedShop?.orderValue?.productAmount, selectedShop?.orderValue?.count)}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Opening Hours" sx={{ textTransform: 'capitalize' }} theme={theme}>
            {openingHours(selectedShop?.normalHours)}
          </ShopInfo>
          <Box sx={{ marginBottom: '16px' }}>
            <Typography variant="h4" sx={{ textTransform: 'capitalize', fontSize: '16px', fontWeight: '600' }}>
              Banking
            </Typography>
          </Box>
          <ShopInfo title="Bank Name" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.bank_name}
            </Typography>
          </ShopInfo>
          <ShopInfo
            title="Account holder's full name/name of the enterprise"
            sx={{ textTransform: 'capitalize' }}
            theme={theme}
          >
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.account_name}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Address" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.bank_address}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Postal Code" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.bank_postal_code}
            </Typography>
          </ShopInfo>
          <ShopInfo title="IBAN" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.account_number}
            </Typography>
          </ShopInfo>
          <ShopInfo title="SWIFT" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.account_swift}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Payout Frequency" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {selectedShop?.payout_frequency}
            </Typography>
          </ShopInfo>
        </Box>
      </Box>
    </Box>
  );
}

export default ViewShopInfo;
