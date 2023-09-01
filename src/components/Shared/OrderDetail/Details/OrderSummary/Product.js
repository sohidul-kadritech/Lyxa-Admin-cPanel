/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Typography } from '@mui/material';
import { useGlobalContext } from '../../../../../context';
import { calculateSecondaryCurrency } from '../../../../../pages/RiderProfile/Transactions/helpers';

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

// eslint-disable-next-line no-unused-vars
const getPriceWithCurrency = (
  baseCurrency,
  secondaryCurrency,
  price,
  secondaryCurrencyPrice = undefined,
  exchangeRate = { shouldCalculate: false, rate: null },
) => {
  if (exchangeRate?.shouldCalculate) {
    if (exchangeRate?.rate > 0) return `${secondaryCurrency} ${Math.round(price * exchangeRate?.rate || 0)}`;
    return `${baseCurrency} ${(price || 0)?.toFixed(2)}`;
  }

  return `${secondaryCurrency} ${Math.round(secondaryCurrencyPrice || 0)} ~ ${baseCurrency}
  ${(price || 0)?.toFixed(2)}`;
};

// eslint-disable-next-line no-unused-vars
export default function Product({ product, isFirst, isLast, shopExchangeRate }) {
  const { general } = useGlobalContext();

  const currency = general?.currency?.symbol;
  const secondaryCurrency = general?.appSetting?.secondaryCurrency?.code;
  const deal = productDeal(product);
  const baseCurrencyFinalPrice = product?.baseCurrency_finalPrice;
  // eslint-disable-next-line no-unused-vars
  const secondaryCurrencyFinalPrice = product?.secondaryCurrency_finalPrice;
  const quantity = product?.productQuantity;

  console.log('product', product);

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
            {getPriceWithCurrency(currency, secondaryCurrency, baseCurrencyFinalPrice, secondaryCurrencyFinalPrice)}
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
                `${currency} ${(product?.baseCurrency_finalPrice - product?.baseCurrency_totalDiscount || 0).toFixed(
                  2,
                )}`}

              {/* reward */}
              {deal === 'reward' &&
                `${product?.finalReward?.points} pts + ${currency} ${product?.finalReward?.baseCurrency_amount}`}

              {/* double menu */}
              {deal === 'double_menu' &&
                `${currency} ${(product?.baseCurrency_finalPrice - product?.baseCurrency_totalDiscount || 0).toFixed(
                  2,
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
                  <Stack direction="row" alignItems="center" justifyContent="flex-start" key={index} gap={2} flex={1}>
                    <Typography variant="inherit" fontSize="14px" lineHeight="22px" fontWeight={500}>
                      {item?.name}
                    </Typography>
                    <Typography variant="inherit" fontSize="14px" lineHeight="22px" fontWeight={500}>
                      (
                      {calculateSecondaryCurrency(
                        general?.appSetting?.baseCurrency,
                        general?.appSetting?.secondaryCurrency,
                        item?.extraPrice,
                        shopExchangeRate,
                        quantity,
                      ).enabled
                        ? calculateSecondaryCurrency(
                            general?.appSetting?.baseCurrency,
                            general?.appSetting?.secondaryCurrency,
                            item?.extraPrice,
                            shopExchangeRate,
                            quantity,
                          ).withOutbaseCurrency
                        : calculateSecondaryCurrency(
                            general?.appSetting?.baseCurrency,
                            general?.appSetting?.secondaryCurrency,
                            item?.extraPrice,
                            shopExchangeRate,
                            quantity,
                          ).withOutSecondaryCurrency}
                      )
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
