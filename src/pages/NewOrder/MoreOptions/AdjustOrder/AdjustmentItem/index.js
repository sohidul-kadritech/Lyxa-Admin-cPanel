/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import FormateBaseCurrency from '../../../../../components/Common/FormateBaseCurrency';
import StyledFormField from '../../../../../components/Form/StyledFormField';
import { dealTypeToLabelMap } from '../../../../../components/Shared/AdjustMentOrder/AdjustMentProduct';
import CustomeCheckedBox from '../../../../../components/Shared/Flagged/CustomeCheckedBox';
import {
  getPriceWithCurrency,
  productDeal,
} from '../../../../../components/Shared/OrderDetail/Details/OrderSummary/Product';
import AtributeCard from './AtributeCard';

function AdjustmentItemCard({ product, isChecked, notes = '', onCheck, onAddNote, shopExchangeRate }) {
  const theme = useTheme();

  const [newNotes, setNewNotes] = useState(notes);

  const deal = productDeal(product);
  const baseCurrencyFinalPrice = product?.baseCurrency_finalPrice;
  const secondaryCurrencyFinalPrice = product?.secondaryCurrency_finalPrice;
  const quantity = product?.productQuantity;

  return (
    <Stack
      sx={{
        borderRadius: '10px',
        padding: '15px',
        border: `1px solid ${theme.palette.custom.border}`,
        width: '100%',
      }}
    >
      {/* check box here */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={deal ? 2.5 : 0} width="100%">
        <CustomeCheckedBox
          label={
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
          }
          value={isChecked}
          onChange={() => onCheck(product)}
          checkBoxSx={{
            color: 'danger.secondary',
            '&.Mui-checked': {
              color: 'danger.secondary',
            },
          }}
          labelSx={{
            '& .MuiFormControlLabel-label': {
              fontWeight: '400',
              fontSize: '16px',
              lineHeight: '19.36px',
            },
          }}
        />

        <Typography
          variant="inherit"
          fontSize="16px"
          lineHeight="22px"
          fontWeight={600}
          color={deal !== null ? 'text.secondary2' : undefined}
          sx={{
            textDecoration: deal !== null ? 'line-through' : undefined,
          }}
        >
          {getPriceWithCurrency(baseCurrencyFinalPrice, secondaryCurrencyFinalPrice)}
        </Typography>
      </Stack>

      {deal && (
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="inherit" fontSize="15px" lineHeight="22px" fontWeight={500}>
            {/* percentage */}
            {deal === 'percentage' && `${dealTypeToLabelMap[deal]} ${product?.product?.discountPercentage}%`}

            {/* double_menu */}
            {deal === 'double_menu' && `${dealTypeToLabelMap[deal]}`}

            {/* reward */}
            {deal === 'reward' &&
              `${dealTypeToLabelMap[deal]} ${Math.round(product?.finalReward?.points / product?.productQuantity)} pts`}
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
              `${FormateBaseCurrency.get(product?.baseCurrency_finalPrice - product?.baseCurrency_totalDiscount || 0)}`}
          </Typography>
        </Stack>
      )}

      {/* flex wrap */}
      {product?.selectedAttributes?.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={15 / 4} mt={15 / 4}>
          {product?.selectedAttributes?.map((attr, index) => (
            <Stack
              flex={1}
              sx={{
                minWidth: '45%',
              }}
            >
              <AtributeCard attr={attr} shopExchangeRate={shopExchangeRate} quantity={quantity} />
            </Stack>
          ))}
        </Stack>
      )}

      <Stack
        sx={{
          height: isChecked ? '100px' : '0px',
          opacity: isChecked ? '1' : '0',
          transition: 'all 0.3s linear',
        }}
      >
        {isChecked && (
          <StyledFormField
            label="Notes"
            intputType="text"
            inputProps={{
              placeholder: 'Type reason here',
              name: 'note',
              value: notes,
              onChange: (e) => {
                onAddNote(product, e);
              },
            }}
          />
        )}
      </Stack>
    </Stack>
  );
}

export default AdjustmentItemCard;
