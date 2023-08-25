/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Typography } from '@mui/material';
import { useGlobalContext } from '../../../../../context';

const productDeal = (product) => {
  if (product?.isDoubleDeal && product?.baseCurrency_totalDiscount) return 'double_menu';
  if (product?.baseCurrency_discount > 0) return 'percentage';
  if (product?.finalReward) return 'reward';

  return null;
};

const dealTypeToLabelMap = {
  percentage: 'Discount',
  double_menu: 'Buy 1 Get 1',
  reward: 'Reward',
};

export default function Product({ product, isFirst, isLast }) {
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const deal = productDeal(product);
  const finalPrice = product?.baseCurrency_finalPrice;
  const quantity = product?.productQuantity;

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
        <Stack direction="row" justifyContent="space-between">
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
            {currency} {(finalPrice || 0)?.toFixed(2)}
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
                  product?.finalReward?.points / product?.productQuantity
                )} pts`}
            </Typography>
            <Typography variant="inherit" fontSize="15px" lineHeight="22px" fontWeight={600}>
              {/* percentage */}
              {deal === 'percentage' &&
                `${currency} ${(product?.baseCurrency_finalPrice - product?.baseCurrency_totalDiscount || 0).toFixed(
                  2
                )}`}

              {/* reward */}
              {deal === 'reward' &&
                `${product?.finalReward?.points} pts + ${currency} ${product?.finalReward?.baseCurrency_amount}`}

              {/* double menu */}
              {deal === 'double_menu' &&
                `${currency} ${(product?.baseCurrency_finalPrice - product?.baseCurrency_totalDiscount || 0).toFixed(
                  2
                )}`}
            </Typography>
          </Stack>
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
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    key={index}
                    gap={5}
                    flex={1}
                  >
                    <Typography variant="inherit" fontSize="14px" lineHeight="22px" fontWeight={500}>
                      {item?.name}
                    </Typography>
                    <Typography variant="inherit" fontSize="14px" lineHeight="22px" fontWeight={500}>
                      {currency} {item?.extraPrice}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}
