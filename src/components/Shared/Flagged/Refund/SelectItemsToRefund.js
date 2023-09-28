/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ReactComponent as ExchangeIcon } from '../../../../assets/icons/exchangeIcon.svg';
import { useGlobalContext } from '../../../../context';
import StyledIconButton from '../../../Styled/StyledIconButton';
import SelectableItem from './SelectableItem';
import StyledContainer from './StyledContainer';

const getDeliveryFee = (order, flaggData, setFlaggData) => {
  const deliveryFee =
    order?.summary?.baseCurrency_riderFee > 0 && order?.orderFor === 'global'
      ? order?.summary?.baseCurrency_riderFee
      : 0;
  // "shop-customer" || "customer-shop-customer"

  if (flaggData?.deliveryType === 'customer-shop-customer' && flaggData?.replacement === 'with') {
    setFlaggData((prev) => ({ ...prev, totalSelectedAmount: deliveryFee * 2 }));
    return deliveryFee * 2;
  }

  if (flaggData?.replacement === 'with') {
    setFlaggData((prev) => ({ ...prev, totalSelectedAmount: deliveryFee }));
  }

  return deliveryFee;
};

export const getSelectableItems = (order, flaggData) => {
  let data = [];
  let k = 1;

  console.log('flaggData', flaggData);

  const adminPercentage = order?.adminPercentage;

  const replacementWithMissingItem = flaggData?.replacement === 'with' && flaggData?.flaggedReason === 'missing-item';
  const replacementWith = flaggData?.replacement === 'with';

  order?.productsDetails?.forEach((item) => {
    for (let i = 0; i < item?.productQuantity; i++) {
      const shopEarning = item?.baseCurrency_productPrice - item?.baseCurrency_productPrice * (adminPercentage / 100);
      const secondaryCurrency = order?.shop?.shopExchangeRate * Number(shopEarning);
      const price = replacementWithMissingItem ? 0 : replacementWith ? shopEarning : item?.baseCurrency_productPrice;

      const temp = { name: item?.productName, price, id: k, secondaryCurrency, ...item };
      data.push(temp);
      k++;
    }
  });

  const secondaryCurrency = order?.adminExchangeRate * order?.summary?.baseCurrency_riderFee;

  const deliveryFee =
    order?.summary?.baseCurrency_riderFee > 0 && order?.orderFor === 'global'
      ? { name: 'Delivery Fee', price: order?.summary?.baseCurrency_riderFee, id: 'delivery_fee', secondaryCurrency }
      : undefined;

  console.log('flaggData?.replacement', flaggData?.replacement);

  if (deliveryFee && flaggData?.replacement !== 'with' && flaggData?.replacement !== undefined) {
    data = [...data, deliveryFee];
  }

  console.log('id', data);

  return data;
};

function SelectItemsToRefund({ order, flaggData, setFlaggData }) {
  const theme = useTheme();

  const { general } = useGlobalContext();
  const { appSetting } = general;

  const { baseCurrency } = appSetting;

  const [refundItem, setRefundItem] = useState(getSelectableItems(order, flaggData));

  const [toggledItems, setToggledItem] = useState([]);

  const [selectedItem, setSelectedItem] = useState([]);

  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    setDeliveryFee(getDeliveryFee(order, flaggData, setFlaggData));
    setRefundItem((prev) => getSelectableItems(order, flaggData));
    setSelectedItem([]);
  }, [flaggData?.deliveryType, flaggData?.flaggedReason, flaggData?.replacement]);

  const onToggledHandler = (item, closed) => {
    setSelectedItem((prev) => {
      const findIndexOfToggle = prev?.findIndex((selected) => selected?.id === item?.id);
      const allItems = getSelectableItems(order, flaggData);
      const findIndexFromToggleHandler = allItems?.findIndex((selected) => selected?.id === item?.id);

      if (findIndexOfToggle >= 0 && findIndexFromToggleHandler >= 0) {
        const price = allItems[findIndexFromToggleHandler]?.price;
        prev[findIndexOfToggle].price = closed ? price : 0;
      }
      setFlaggData((oldData) => {
        const totalSelectedAmount = prev.reduce((prevValue, item) => item?.price + prevValue, 0) + deliveryFee;

        return { ...oldData, selectedItems: [...prev], totalSelectedAmount };
      });

      return [...prev];
    });
  };

  const onSelectItems = (item) => {
    setRefundItem((prev) => {
      const refund = prev?.filter((prevItem) => prevItem?.id !== item?.id);
      return refund;
    });

    setSelectedItem((prev) => {
      const selected = [...prev, item];
      setToggledItem(selected);
      setFlaggData((prev) => {
        const totalSelectedAmount =
          prev?.replacement !== 'with' && prev?.flaggedReason !== 'missing-item'
            ? selected.reduce((prevValue, item) => item?.price + prevValue, 0)
            : prev?.replacement === 'with' && prev?.flaggedReason !== 'missing-item'
            ? selected.reduce((prevValue, item) => item?.price + prevValue, 0) + deliveryFee
            : prev?.totalSelectedAmount;

        return { ...prev, selectedItems: selected, totalSelectedAmount, deliveryfee: deliveryFee };
      });
      return selected;
    });
  };

  const deSelectItems = (item) => {
    setSelectedItem((prev) => {
      const selected = prev?.filter((prevItem) => prevItem?.id !== item?.id);
      setToggledItem(selected);
      setFlaggData((prev) => {
        const totalSelectedAmount =
          prev?.replacement !== 'with' && prev?.flaggedReason !== 'missing-item'
            ? selected.reduce((prevValue, item) => item?.price + prevValue, 0)
            : prev?.replacement === 'with' && prev?.flaggedReason !== 'missing-item'
            ? selected.reduce((prevValue, item) => item?.price + prevValue, 0) + deliveryFee
            : prev?.totalSelectedAmount;

        return { ...prev, selectedItems: selected, totalSelectedAmount, deliveryfee: deliveryFee };
      });
      return selected;
    });
    setRefundItem((prev) => [...prev, item]);
  };

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
              showPrice={
                flaggData?.replacement === 'without'
                  ? true
                  : !!(flaggData?.replacement === 'with' && flaggData?.flaggedReason !== 'missing-item')
              }
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
                  showToggle={flaggData?.replacement === 'with' && flaggData?.flaggedReason === 'wrong-item'}
                  onChangeToggle={(value) => {
                    onToggledHandler(item, value);
                  }}
                  label={item?.name}
                  price={item?.price}
                  onChange={(value) => {
                    // console.log('value', value);
                    deSelectItems(item);
                  }}
                />
              ))}

              {flaggData?.replacement === 'with' && (
                <Stack direction="row" justifyContent="space-between" gap={5} alignItems="center" mt={2.5}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '16px',
                    }}
                  >
                    Delivery Fees
                  </Typography>
                  <Typography variant="body2" minWidth="40px">
                    {baseCurrency?.symbol} {deliveryFee}
                  </Typography>
                </Stack>
              )}
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
              <Typography variant="body2" minWidth="40px">
                {baseCurrency?.symbol} {flaggData?.totalSelectedAmount}
              </Typography>
            </Stack>
          </Stack>
        </StyledContainer>
      </Stack>
    </Box>
  );
}

export default SelectItemsToRefund;
