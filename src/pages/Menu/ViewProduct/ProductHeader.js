/* eslint-disable no-unused-vars */
/* eslint-disable no-unsafe-optional-chaining */
import { Avatar, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import {
  checkAnyMarketing,
  checkDoubleDealMarketing,
  checkPercentageMarketing,
  checkRewardMarketing,
} from '../../../components/Shared/AdjustMentOrder/helpers';

export const getPrice = (product) => {
  console.log({ product });
  if (checkAnyMarketing(product)?.type === 'double_menu') {
    return (product?.price - product?.discount) * 2 || 0;
  }

  if (checkAnyMarketing(product)?.type === 'reward') {
    return product?.reward?.amount || 0;
  }
  if (checkAnyMarketing(product)?.type === 'percentage') {
    return product?.price - product?.discount || 0;
  }

  return product?.price;
};

function ProductHeader({ productData }) {
  const price = productData?.price;
  const dealPrice = getPrice(productData);
  const shopExchangeRate = productData?.shop?.shopExchangeRate;
  const theme = useTheme();
  return (
    <Stack>
      <Stack direction="row" alignItems="center" gap={3}>
        <Stack>
          <Avatar variant="circle" src={productData?.images[0]} sx={{ width: '60px', height: '60px' }}>
            {productData?.name?.charAt(0).toUpperCase()}
          </Avatar>
        </Stack>
        <Stack gap={1.5}>
          <Typography variant="h6" fontWeight={700}>
            {productData?.name}
          </Typography>
          {checkAnyMarketing(productData) && (
            <Typography variant="body4" color={theme.palette.text.secondary2}>
              {checkPercentageMarketing(productData) && `${productData?.discountPercentage}% discount`}
              {checkRewardMarketing(productData) && `${productData?.rewardBundle} points enabled `}
              {checkDoubleDealMarketing(productData) && `Buy 1, get 1 free`}
            </Typography>
          )}

          {/* <Chip
            size="small"
            label={productData?.status === 'active' ? 'Active' : 'Inactive'}
            sx={
              productData?.status === 'active'
                ? { background: '#e1f4d0', color: '#56ca00' }
                : { background: '#ffcfce', color: '#ff0000' }
            }
            variant="contained"
          /> */}
        </Stack>
      </Stack>
      {/* price */}
      {productData?.seoDescription && (
        <Stack direction="row" gap={1.5} mt={1.5} alignItems="center">
          <Typography variant="h6">
            <Typography variant="span" fontWeight={700}>
              Description:
            </Typography>{' '}
            {productData?.seoDescription}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}

export default ProductHeader;
