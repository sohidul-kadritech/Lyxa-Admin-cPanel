/* eslint-disable prettier/prettier */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Close } from '@mui/icons-material';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { calculateSecondaryCurrency } from '../../../pages/RiderProfile/Transactions/helpers';
import FormateBaseCurrency from '../../Common/FormateBaseCurrency';
import StyledIconButton from '../../Styled/StyledIconButton';
import StyledSwitch from '../../Styled/StyledSwitch';
import { getPriceWithCurrency, productDeal } from '../OrderDetail/Details/OrderSummary/Product';
import StyledIncrementDecrementButton from './StyledIncrementDecrementButton';

// deal type tot label map
export const dealTypeToLabelMap = {
  percentage: 'Discount',
  double_menu: 'Buy 1 Get 1',
  reward: 'Reward',
};

function AdjustMentProduct({
  product,
  shopExchangeRate,
  isFirst,
  isLast,
  onDeleteProduct,
  onDeleteAtribute,
  onIncrementDecrement,
  onToggled = () => {},
}) {
  const deal = productDeal(product);
  const baseCurrencyFinalPrice = product?.baseCurrency_finalPrice;
  const secondaryCurrencyFinalPrice = product?.secondaryCurrency_finalPrice;
  const quantity = product?.productQuantity;

  console.log({ skipDiscount: product?.skipDiscount });

  const [isToggled, setIsToggled] = useState(
    product?.skipDiscount === undefined
      ? deal === 'reward' && product?.finalReward?.baseCurrency_amount > 0
      : !product?.skipDiscount,
  );

  return (
    <Box
      sx={{
        borderBottom: isLast ? 'none' : '1px dotted',
        borderColor: 'custom.border',
        paddingTop: isFirst ? '0px' : '12px',
        paddingBottom: isLast ? '0px' : '12px',
      }}
    >
      <Stack gap={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack>
            <Stack direction="row" alignItems="center" gap={2.5}>
              <Avatar variant="rounded" src={product?.product?.images[0]} alt="product_image">
                {product?.product?.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="inherit" fontSize="15px" lineHeight="22px" fontWeight={500}>
                {product?.product?.name}{' '}
                <span
                  style={{
                    fontStyle: 'italic',
                  }}
                >
                  x{quantity || 0}
                </span>
              </Typography>
              <StyledIconButton
                size="small"
                sx={{
                  width: '24px',
                  height: '24px',
                }}
                onClick={() => {
                  if (onDeleteProduct) onDeleteProduct(product);
                }}
              >
                <Close />
              </StyledIconButton>
            </Stack>
          </Stack>
          <Typography
            variant="inherit"
            fontSize="15px"
            lineHeight="22px"
            fontWeight={600}
            color={deal !== null ? 'text.secondary2' : undefined}
            sx={{
              textDecoration: deal !== null ? 'line-through' : undefined,
            }}
          >
            {getPriceWithCurrency(
              baseCurrencyFinalPrice,
              secondaryCurrencyFinalPrice,
              { shouldCalculate: false },
              {
                both: shopExchangeRate > 0,
                base: !shopExchangeRate > 0,
              },
            )}
            {/* {FormateCurrency.get(baseCurrencyFinalPrice)} */}
          </Typography>
        </Stack>
        {/* deal info */}
        {deal && (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="inherit" fontSize="15px" lineHeight="22px" fontWeight={500}>
              {/* percentage */}
              {deal === 'percentage' && `${dealTypeToLabelMap[deal]} ${product?.product?.discountPercentage}%`}

              {/* double_menu */}
              {deal === 'double_menu' && `${dealTypeToLabelMap[deal]}`}

              {/* reward */}
              {deal === 'reward' &&
                `${dealTypeToLabelMap[deal]} ${Math.round(
                  product?.finalReward?.points / product?.productQuantity,
                )} pts`}
            </Typography>
            <Typography variant="inherit" fontSize="15px" lineHeight="22px" fontWeight={600}>
              {/* percentage */}
              {deal === 'percentage' &&
                `${FormateBaseCurrency.get(product?.baseCurrency_finalPrice - product?.baseCurrency_totalDiscount)}`}

              {/* reward */}
              {deal === 'reward' &&
                `${product?.finalReward?.points} pts + ${FormateBaseCurrency.get(
                  product?.finalReward?.baseCurrency_amount,
                )}`}

              {/* double menu */}
              {deal === 'double_menu' &&
                `${FormateBaseCurrency.get(
                  product?.baseCurrency_finalPrice - product?.baseCurrency_totalDiscount || 0,
                )}`}
            </Typography>
          </Stack>
        )}
        {deal === 'reward' && (
          <Box>
            <StyledSwitch
              size="small"
              sx={{
                width: 40,
                height: 20,
                '& .MuiSwitch-switchBase': {
                  margin: '1px 2px 2px 2px',
                  '&.Mui-checked': {
                    transform: 'translateX(19px)',
                  },
                },
                '& .MuiSwitch-thumb': {
                  boxSizing: 'border-box',
                  width: 18,
                  height: 18,
                },
              }}
              checked={isToggled}
              onChange={() => {
                setIsToggled((prev) => {
                  const toggled = !prev;
                  onToggled(product, toggled);

                  return toggled;
                });
              }}
            />
          </Box>
        )}
      </Stack>
      {product?.selectedAttributes?.length ? (
        <Box>
          {product?.selectedAttributes?.map((attr, index) => (
            <Box key={index} pt={2.5}>
              <Typography variant="inherit" fontSize="15px" lineHeight="22px" fontWeight={500}>
                {attr?.data?.name}
              </Typography>
              <Stack>
                {attr?.selectedItems?.map((item, index) => (
                  <Stack direction="row" alignItems="center" justifyContent="flex-start" key={index} gap={2} flex={1}>
                    <Typography variant="inherit" fontSize="14px" lineHeight="22px" fontWeight={500}>
                      {item?.name}
                    </Typography>
                    <Typography variant="inherit" fontSize="14px" lineHeight="22px" fontWeight={500}>
                      (
                      {calculateSecondaryCurrency(item?.extraPrice, shopExchangeRate, quantity)?.enabled
                        ? calculateSecondaryCurrency(item?.extraPrice, shopExchangeRate, quantity)?.withOutbaseCurrency
                        : calculateSecondaryCurrency(item?.extraPrice, shopExchangeRate, quantity)
                            ?.withOutSecondaryCurrency}
                      )
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>
      ) : null}

      <Stack direction="row" justifyContent="flex-start">
        <StyledIncrementDecrementButton
          value={quantity}
          step={deal === 'double_menu' ? 2 : 1}
          onClick={(type, value) => {
            onIncrementDecrement(type, { value, product });
          }}
        />
      </Stack>
    </Box>
  );
}

export default AdjustMentProduct;
