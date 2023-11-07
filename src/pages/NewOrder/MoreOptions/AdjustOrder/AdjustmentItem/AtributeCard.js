/* eslint-disable no-unused-vars */
import { Stack, Typography } from '@mui/material';
import React from 'react';
import { calculateSecondaryCurrency } from '../../../../RiderProfile/Transactions/helpers';

function AtributeCard({ attr, quantity = 0, shopExchangeRate = 0 }) {
  return (
    <Stack>
      <Stack>
        <Typography>{attr?.data?.name}</Typography>
      </Stack>
      <Stack>
        {attr?.selectedItems?.map((item, index) => {
          const attributeItemPrice = calculateSecondaryCurrency(item?.extraPrice, shopExchangeRate, quantity)?.enabled
            ? calculateSecondaryCurrency(item?.extraPrice, shopExchangeRate, quantity)?.withOutbaseCurrency
            : calculateSecondaryCurrency(item?.extraPrice, shopExchangeRate, quantity)?.withOutSecondaryCurrency;
          return (
            <Typography
              sx={{
                color: 'danger.secondary',
              }}
            >
              {`${item?.name} ${attributeItemPrice}`}
            </Typography>
          );
        })}
      </Stack>
    </Stack>
  );
}

export default AtributeCard;
