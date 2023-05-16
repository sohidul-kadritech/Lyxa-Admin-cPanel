/* eslint-disable no-unsafe-optional-chaining */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { StyledOrderDetailBox } from '../helper';

export default function OrderSummary({ productsDetails = [] }) {
  const theme = useTheme();
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions?.currency?.code)?.toUpperCase();

  const totalProductQuantity = productsDetails.reduce((prev, curr) => curr?.productQuantity + prev, 0);

  return (
    <StyledOrderDetailBox
      title={
        <span>
          Order Summary
          <span
            style={{
              fontStyle: 'italic',
            }}
          >
            {' '}
            x{totalProductQuantity || 0}
          </span>
        </span>
      }
    >
      <Box pt={1}>
        {productsDetails?.map((product, index, { length }) => (
          <Box
            key={product?.productId}
            pt={index === 0 ? 0 : 3}
            pb={index === length - 1 ? 0 : 3}
            borderBottom={index === length - 1 ? undefined : `1px solid ${theme.palette.custom.border}`}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body4" lineHeight="22px">
                {product?.productName}
                <span
                  style={{
                    fontStyle: 'italic',
                    fontWeight: '600',
                  }}
                >
                  {' '}
                  x{product?.productQuantity || 0}
                </span>
              </Typography>
              <Typography variant="body4" lineHeight="22px" color="#737373">
                {currency} {product?.productPrice}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Box>
    </StyledOrderDetailBox>
  );
}
