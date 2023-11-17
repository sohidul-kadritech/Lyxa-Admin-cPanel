/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import FormateBaseCurrency from '../../../components/Common/FormateBaseCurrency';
import FormatesecondaryCurrency from '../../../components/Common/FormatesecondaryCurrency';
import { checkAnyMarketing } from '../../../components/Shared/AdjustMentOrder/helpers';
import { useGlobalContext } from '../../../context';
import { getPrice } from './ProductHeader';

// Order Details Handling
export function StyledProductDetailBox({ title, children, showborder = false, sx }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: showborder ? `1px solid ${theme.palette.custom.border}` : null,
        borderRadius: '10px',
        padding: showborder ? '12px 16px' : '0px 0px',
        ...(sx || {}),
      }}
    >
      {title && (
        <Typography variant="body4" display="block" pb={2} fontWeight={600}>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}

function ProductDetails({ productData }) {
  const { currentUser } = useGlobalContext();
  const { userType } = currentUser;
  console.log({ currentUser });
  //   get price
  const price = productData?.price;
  const dealPrice = getPrice(productData);
  //   get deal price
  const shopExchangeRate = productData?.shop?.shopExchangeRate;

  return (
    <Stack mt={2.5} gap={4}>
      {/* price */}
      <StyledProductDetailBox title="Price">
        <Stack direction="row" gap={1.5} alignItems="flex-start">
          {checkAnyMarketing(productData) && checkAnyMarketing(productData)?.type !== 'double_menu' && (
            <Stack direction="row" gap={1.5}>
              {!(shopExchangeRate > 0) && (
                <Typography variant="body" fontWeight={400}>
                  {FormateBaseCurrency.get(dealPrice)}
                </Typography>
              )}
              {shopExchangeRate > 0 && (
                <Typography variant="body" fontWeight={400}>
                  {FormatesecondaryCurrency.get(dealPrice * shopExchangeRate)}
                </Typography>
              )}
            </Stack>
          )}
          <Stack direction="row" gap={1.5}>
            {!(shopExchangeRate > 0) && (
              <Typography
                variant="body"
                fontWeight={400}
                sx={{
                  textDecoration:
                    checkAnyMarketing(productData) && checkAnyMarketing(productData)?.type !== 'double_menu'
                      ? 'line-through'
                      : null,
                }}
              >
                {FormateBaseCurrency.get(price)}
              </Typography>
            )}
            {shopExchangeRate > 0 && (
              <Typography
                variant="body"
                fontWeight={400}
                sx={{
                  textDecoration:
                    checkAnyMarketing(productData) && checkAnyMarketing(productData)?.type !== 'double_menu'
                      ? 'line-through'
                      : null,
                }}
              >
                {FormatesecondaryCurrency.get(price * shopExchangeRate)}
              </Typography>
            )}
          </Stack>
        </Stack>
      </StyledProductDetailBox>
      {/* type */}
      <StyledProductDetailBox title="Type">
        <Typography variant="body" sx={{ textTransform: 'capitalize' }}>
          {productData?.type}
        </Typography>
      </StyledProductDetailBox>
      {/* Category */}
      <StyledProductDetailBox title="Category">
        <Typography variant="body" sx={{ textTransform: 'capitalize' }}>
          {productData?.category?.name}
        </Typography>
      </StyledProductDetailBox>
      {/* Category */}
      {productData?.type !== 'food' && (
        <StyledProductDetailBox title="Sub Category">
          <Typography variant="body" sx={{ textTransform: 'capitalize' }}>
            {productData?.subCategory?.name}
          </Typography>
        </StyledProductDetailBox>
      )}

      {/* Atributes */}
      {productData?.attributes?.length > 0 && (
        <StyledProductDetailBox title="Attributes">
          {productData?.attributes?.map((item, index) => (
            <Stack key={index} gap={2}>
              <Stack>
                <Typography variant="h6" fontWeight={500} sx={{ fontSize: '14px' }}>
                  {item?.name}
                </Typography>
                <Box
                  sx={{
                    width: '30%',
                    borderBottom: '2px solid #000',
                  }}
                />
              </Stack>
              <Stack gap={0.2}>
                {item?.items?.map((atrItem, i) => (
                  <Stack key={i}>
                    <Typography variant="body" fontWeight={400}>
                      {i + 1}. {atrItem?.name} ({FormatesecondaryCurrency.get(atrItem?.extraPrice)})
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          ))}
        </StyledProductDetailBox>
      )}

      {/* Addons */}
      {productData?.type === 'food' && productData?.addons?.length > 0 && (
        <StyledProductDetailBox title="Add-ons">
          <Stack gap={0.2}>
            {productData?.addons?.map((addon, i) => (
              <Stack key={i}>
                <Typography variant="body" fontWeight={400}>
                  {i + 1}. {addon?.name} ({FormatesecondaryCurrency.get(addon?.price)})
                </Typography>
              </Stack>
            ))}
          </Stack>
        </StyledProductDetailBox>
      )}

      {/* Dietary */}
      {productData?.type === 'food' && productData?.dietary?.length > 0 && (
        <StyledProductDetailBox title="Dietary">
          <Typography variant="body" fontWeight={500} textTransform="capitalize">
            {productData?.dietary?.join(', ')}
          </Typography>
        </StyledProductDetailBox>
      )}

      {/* Units */}
      {productData?.isUnitEnabled && productData?.unit && (
        <StyledProductDetailBox title="Units">
          <Typography variant="body" fontWeight={500}>
            {productData?.unit}
          </Typography>
        </StyledProductDetailBox>
      )}
    </Stack>
  );
}

export default ProductDetails;
