/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Avatar, Box, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useQuery } from 'react-query';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { AverageOrderValue, OpeningHours, TagsAndCuisines } from '../../pages/ShopProfile/helper';
import CloseButton from '../Common/CloseButton';
import Rating from '../Common/Rating';
import ClickableAddress from './ClickableAddress';

function RowSkeleton() {
  return (
    <Stack gap={2.5}>
      <Skeleton width="250px" height="16px" />
      <Skeleton width="150px" height="10px" />
    </Stack>
  );
}

function ViewShopInfoSkeleton() {
  return (
    <Stack>
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
            <Skeleton width="60px" height="60px" sx={{ borderRadius: '50%' }} />

            <Stack gap={0.5}>
              <Skeleton width="250px" height="16px" />
              <Skeleton width="150px" height="10px" />
            </Stack>
          </Stack>
          <Skeleton width="20px" height="20px" />
        </Stack>
      </Box>
      <Stack gap={6}>
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
      </Stack>
    </Stack>
  );
}

const getDeliveryFee = (shopData) => {
  const isFreeDelivery =
    shopData?.marketings?.length > 0
      ? shopData?.marketings?.find(
          // eslint-disable-next-line prettier/prettier
          (marketing) => marketing.type === 'free_delivery' && marketing.status === 'active' && marketing.isActive,
        )
      : null;
  if (shopData.haveOwnDeliveryBoy && !isFreeDelivery) {
    return {
      status: true,
      value: shopData?.deliveryFee,
    };
  }
  if (shopData.haveOwnDeliveryBoy && isFreeDelivery) {
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
  console.log('shopData', selectedShop);

  const shopsQuery = useQuery(
    [API_URL.GET_SINGLE_SHOP, { shopId: selectedShop?._id }],
    () =>
      AXIOS.get(API_URL.GET_SINGLE_SHOP, {
        params: {
          shopId: selectedShop?._id,
        },
      }),
    {
      onSuccess: (data) => {
        console.log('data', { data });
      },
    },
  );

  if (shopsQuery?.isLoading) {
    return (
      <Box
        sx={{
          width: '400px',
          padding: '0px 20px 25px 20px',
        }}
      >
        <ViewShopInfoSkeleton />
      </Box>
    );
  }

  const shopData = shopsQuery?.data?.data?.shop;

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
              <Avatar alt="user-image" src={shopData?.shopLogo} sx={{ width: 36, height: 36 }}>
                {shopData?.shopName?.length && shopData?.shopName[0]}
              </Avatar>
              <Stack gap={0.5}>
                <Typography variant="body4">{shopData?.shopName}</Typography>
                <Typography variant="body4" color="#737373">
                  {shopData?.totalOrder || 0} orders
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
              {shopData?.seller?.company_name}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Unique ID" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4">{shopData?.autoGenId}</Typography>
          </ShopInfo>
          <ShopInfo title="Shop Name" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {shopData?.shopName}
            </Typography>
          </ShopInfo>
          {shopData?.shopBrand && (
            <ShopInfo title="Shop Brand" sx={{ textTransform: 'capitalize' }} theme={theme}>
              <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                {shopData?.shopBrand}
              </Typography>
            </ShopInfo>
          )}
          {shopData?.name && (
            <ShopInfo title="Shop Manager" sx={{ textTransform: 'capitalize' }} theme={theme}>
              <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                {shopData?.name}
              </Typography>
            </ShopInfo>
          )}
          {shopData?.accountManager?.name && (
            <ShopInfo title="Account Manager" sx={{ textTransform: 'capitalize' }} theme={theme}>
              <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                {shopData?.accountManager?.name}
              </Typography>
            </ShopInfo>
          )}
          <ShopInfo title="Shop Type" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {shopData?.shopType}
            </Typography>
          </ShopInfo>

          <ShopInfo title="E-mail" theme={theme}>
            <Typography variant="body4">{shopData?.email}</Typography>
          </ShopInfo>

          <ShopInfo title="Location" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <ClickableAddress latitude={shopData?.address?.latitude} longitude={shopData?.address?.longitude}>
              <Typography variant="body4">{shopData?.address?.address}</Typography>
            </ClickableAddress>
          </ShopInfo>
          <ShopInfo title="Zip Code" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4">{shopData?.address?.pin || '1233'}</Typography>
          </ShopInfo>
          <ShopInfo title="Delivery by" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {shopData?.haveOwnDeliveryBoy ? 'Store' : 'Lyxa'}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Phone number" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4">{shopData?.phone_number}</Typography>
          </ShopInfo>
          <ShopInfo title="rating" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Rating
              amount={shopData?.rating}
              titleSx={{
                fontSize: '15px',
                fontWeight: 500,
              }}
            />
          </ShopInfo>
          <ShopInfo title="Payment Options" sx={{ textTransform: 'capitalize' }} theme={theme}>
            {shopData?.paymentOption?.length > 0 ? (
              <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                {shopData?.paymentOption.join(', ')}
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
            {shopData?.tags?.length > 0 || shopData?.cuisineType?.length > 0 ? (
              <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                {TagsAndCuisines(shopData?.tags, shopData?.cuisineType)}
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
            {shopData?.dietary?.length > 0 ? (
              <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                {shopData?.dietary.join(', ')}
              </Typography>
            ) : (
              <Box>
                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  No Dietary Found
                </Typography>
              </Box>
            )}
          </ShopInfo>

          {getDeliveryFee(shopData).status && (
            <ShopInfo title="Delivery Charge" sx={{ textTransform: 'capitalize' }} theme={theme}>
              <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                {getDeliveryFee(shopData)?.value}
              </Typography>
            </ShopInfo>
          )}

          <ShopInfo title="Status" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {shopData?.shopStatus}
            </Typography>
          </ShopInfo>

          <ShopInfo title="Average Ord. Value" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
              {AverageOrderValue(shopData?.orderValue?.productAmount, shopData?.orderValue?.count)}
            </Typography>
          </ShopInfo>
          <ShopInfo title="Opening Hours" sx={{ textTransform: 'capitalize' }} theme={theme}>
            <OpeningHours normalHours={shopData?.normalHours} />
          </ShopInfo>
          {shopData?.shopReceivePaymentBy === 'bank' && (
            <Box>
              <Box sx={{ marginBottom: '16px' }}>
                <Typography variant="h4" sx={{ textTransform: 'capitalize', fontSize: '16px', fontWeight: '600' }}>
                  Banking
                </Typography>
              </Box>
              <ShopInfo title="Bank Name" sx={{ textTransform: 'capitalize' }} theme={theme}>
                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  {shopData?.bank_name}
                </Typography>
              </ShopInfo>
              <ShopInfo
                title="Account holder's full name/name of the enterprise"
                sx={{ textTransform: 'capitalize' }}
                theme={theme}
              >
                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  {shopData?.account_name}
                </Typography>
              </ShopInfo>
              <ShopInfo title="Address" sx={{ textTransform: 'capitalize' }} theme={theme}>
                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  {shopData?.bank_address}
                </Typography>
              </ShopInfo>
              <ShopInfo title="Postal Code" sx={{ textTransform: 'capitalize' }} theme={theme}>
                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  {shopData?.bank_postal_code}
                </Typography>
              </ShopInfo>
              <ShopInfo title="IBAN" sx={{ textTransform: 'capitalize' }} theme={theme}>
                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  {shopData?.account_number}
                </Typography>
              </ShopInfo>
              <ShopInfo title="SWIFT" sx={{ textTransform: 'capitalize' }} theme={theme}>
                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  {shopData?.account_swift}
                </Typography>
              </ShopInfo>
              <ShopInfo title="Payout Frequency" sx={{ textTransform: 'capitalize' }} theme={theme}>
                <Typography variant="body4" sx={{ textTransform: 'capitalize' }}>
                  {shopData?.payout_frequency}
                </Typography>
              </ShopInfo>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ViewShopInfo;
