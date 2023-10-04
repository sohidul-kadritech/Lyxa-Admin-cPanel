/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { isFinite } from 'lodash';
import React, { useState } from 'react';
import { ReactComponent as ExchangeIcon } from '../../../../assets/icons/exchangeIcon.svg';
import { useGlobalContext } from '../../../../context';
import StyledIconButton from '../../../Styled/StyledIconButton';
import SelectableItem from '../Refund/SelectableItem';
import StyledContainer from '../Refund/StyledContainer';

export const getUpdatedEndorseLossValue = (data, totalSelectedAmount) => {
  const template = {
    baseCurrency_shopLoss: 0,
    secondaryCurrency_shopLoss: 0,
    baseCurrency_adminLoss: 0,
    secondaryCurrency_adminLoss: 0,
  };

  if (isFinite(100 / totalSelectedAmount) && data?.refundPercentage === 'by_percentage') {
    const shopLossPercentage = Number(data?.byPercentage?.shop || 0);
    const adminLossPercentage = Number(data?.byPercentage?.adminOrderRefund || 0);

    template.baseCurrency_adminLoss = Number((totalSelectedAmount * (adminLossPercentage / 100)).toFixed(2));
    template.baseCurrency_shopLoss = Number((totalSelectedAmount * (shopLossPercentage / 100)).toFixed(2));
  }

  return template;
};

export const getSelectableItems = (order) => {
  let data = [];
  let k = 1;

  order?.productsDetails?.forEach((item) => {
    for (let i = 0; i < item?.productQuantity; i++) {
      const price =
        item?.baseCurrency_productPrice - item?.baseCurrency_productPrice * ((order?.adminPercentage || 0) / 100);
      const secondaryCurrency = order?.shop?.shopExchangeRate * Number(price);
      const temp = { name: item?.productName, price, id: k, secondaryCurrency };
      data.push(temp);
      k++;
    }
  });

  const secondaryCurrency = order?.adminExchangeRate * order?.summary?.baseCurrency_riderFee;

  const deliveryFee =
    order?.summary?.baseCurrency_riderFee > 0 && order?.orderFor === 'global' && order?.deliveryBoy
      ? { name: 'Delivery Fee', price: order?.summary?.baseCurrency_riderFee, id: 'delivery_fee', secondaryCurrency }
      : undefined;

  if (deliveryFee) {
    data = [...data, deliveryFee];
  }

  return data;
};

function SelectItemsToCancelOrder({ order, flaggData, setFlaggData }) {
  const theme = useTheme();

  const { general } = useGlobalContext();
  const { appSetting } = general;

  const { baseCurrency } = appSetting;

  console.log('order', order, general);

  const [refundItem, setRefundItem] = useState(getSelectableItems(order));
  const [selectedItem, setSelectedItem] = useState([]);

  const onSelectItems = (item) => {
    setRefundItem((prev) => {
      const refund = prev?.filter((prevItem) => prevItem?.id !== item?.id);

      return refund;
    });

    setSelectedItem((prev) => {
      const selected = [...prev, item];
      setFlaggData((prev) => {
        const totalSelectedAmount = selected.reduce((prevValue, item) => item?.price + prevValue, 0);

        const endorseLoss = getUpdatedEndorseLossValue(prev, totalSelectedAmount);

        return { ...prev, endorseLoss, selectedItems: selected, totalSelectedAmount };
      });
      return selected;
    });
  };

  const deSelectItems = (item) => {
    setSelectedItem((prev) => {
      const selected = prev?.filter((prevItem) => prevItem?.id !== item?.id);
      setFlaggData((prev) => {
        const totalSelectedAmount = selected.reduce((prevValue, item) => item?.price + prevValue, 0);
        const endorseLoss = getUpdatedEndorseLossValue(prev, totalSelectedAmount);
        console.log('prev', { endorseLoss });
        return { ...prev, endorseLoss, selectedItems: selected, totalSelectedAmount };
      });
      return selected;
    });
    setRefundItem((prev) => [...prev, item]);
  };

  /*
   value={order?.summary?.baseCurrency_riderFee > 0 ? order?.summary?.baseCurrency_riderFee : 'FREE'}
          valueSecondary={order?.summary?.secondaryCurrency_riderFee}
  */

  console.log('order in flagg', order);
  return (
    <Box>
      <Stack direction="row" gap={5} alignItems="center">
        {/* left items */}
        <StyledContainer>
          {refundItem.map((item, k) => (
            <SelectableItem
              key={k}
              isChecked={false}
              label={item?.name}
              price={item?.price}
              onChange={(value) => {
                console.log('value', value);
                onSelectItems(item);
              }}
            />
          ))}
        </StyledContainer>
        {/* icon button */}
        <StyledIconButton
          disableRipple
          sx={{ width: '44px', height: '44px', padding: '10px', color: 'primary.main', borderRadius: '50%!important' }}
        >
          <ExchangeIcon />
        </StyledIconButton>
        {/* right items */}
        <StyledContainer>
          <Stack
            sx={{
              minHeight: '182px',
            }}
            alignContent="space-between"
            justifyContent="space-between"
          >
            <Stack flex={1}>
              {selectedItem.map((item, k) => (
                <SelectableItem
                  key={k}
                  isChecked
                  label={item?.name}
                  price={item?.price}
                  onChange={(value) => {
                    // console.log('value', value);
                    deSelectItems(item);
                  }}
                />
              ))}
            </Stack>
            {/* total */}
            <Stack direction="row" justifyContent="space-between" gap={5} alignItems="center">
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '16px',
                }}
              >
                Total
              </Typography>
              <Typography variant="body2">
                {baseCurrency?.symbol} {selectedItem.reduce((prev, item) => prev + item?.price, 0)}
              </Typography>
            </Stack>
          </Stack>
        </StyledContainer>
      </Stack>
    </Box>
  );
}

export default SelectItemsToCancelOrder;
