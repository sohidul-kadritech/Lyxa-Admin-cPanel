/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Typography } from '@mui/material';
import { useGlobalContext } from '../../../../../context';

const productDeal = (product) => {
  if (product?.baseCurrency_discount > 0) return 'percentage';
  if (product?.isDoubleDeal) return 'double_menu';
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
              x{product?.productQuantity || 0}
            </span>
          </Typography>
          <Typography
            variant="inherit"
            fontSize="15px"
            lineHeight="22px"
            fontWeight={600}
            color={deal !== null && deal !== 'double_menu' ? 'text.secondary2' : undefined}
            sx={{
              textDecoration: deal !== null && deal !== 'double_menu' ? 'line-through' : undefined,
            }}
          >
            {currency} {(product?.baseCurrency_finalPrice || 0)?.toFixed(2)}
          </Typography>
        </Stack>
        {deal && (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="inherit" fontSize="15px" lineHeight="22px" fontWeight={500}>
              {deal === 'percentage' && `${dealTypeToLabelMap[deal]} ${product?.product?.discountPercentage}%`}
              {deal === 'double_menu' && `${dealTypeToLabelMap[deal]}`}
              {deal === 'reward' &&
                `${dealTypeToLabelMap[deal]} ${Math.round(
                  product?.finalReward?.points / product?.productQuantity
                )} pts`}
            </Typography>
            <Typography variant="inherit" fontSize="15px" lineHeight="22px" fontWeight={600}>
              {deal === 'percentage' &&
                `${currency} ${(product?.baseCurrency_finalPrice - product?.baseCurrency_totalDiscount || 0).toFixed(
                  2
                )}`}
              {deal === 'reward' &&
                `${product?.finalReward?.points} pts + ${currency} ${product?.finalReward?.baseCurrency_amount}`}
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
