/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { isFinite } from 'lodash';
import React, { useEffect, useState } from 'react';
import { ReactComponent as ExchangeIcon } from '../../../../assets/icons/exchangeIcon.svg';
import { useGlobalContext } from '../../../../context';
import FormateBaseCurrency from '../../../Common/FormateBaseCurrency';
import StyledIconButton from '../../../Styled/StyledIconButton';
import { productDeal } from '../../OrderDetail/Details/OrderSummary/Product';
import SelectableItem from './SelectableItem';
import StyledContainer from './StyledContainer';
import { getProductPrice } from './helpers';

export const getUpdatedPartialAndReplacementOrder = (data, totalSelectedAmount) => {
  const partialPayment = {
    shop: '',
    adminOrderRefund: '',
    adminDeliveryRefund: '',
    adminVat: '',
  };

  const replacementOrderCut = {
    baseCurrency_shopCutForReplacement: '',
    secondaryCurrency_shopCutForReplacement: '',
    baseCurrency_adminCutForReplacement: '',
    secondaryCurrency_adminCutForReplacement: '',
  };

  if (
    isFinite(100 / totalSelectedAmount) &&
    data?.refundPercentage === 'by_percentage' &&
    data?.replacement === 'without'
  ) {
    if (!data?.selectedItems?.length) {
      return { partialPayment };
    }
    const shopLossPercentage = Number(data?.byPercentage?.shop || 0);
    const adminLossPercentage = Number(data?.byPercentage?.adminOrderRefund || 0);
    const deliveryPercentage = Number(data?.byPercentage?.adminDeliveryRefund || 0);

    partialPayment.adminOrderRefund = Number((totalSelectedAmount * (adminLossPercentage / 100)).toFixed(2));
    partialPayment.adminDeliveryRefund = Number((totalSelectedAmount * (deliveryPercentage / 100)).toFixed(2));
    partialPayment.shop = Number((totalSelectedAmount * (shopLossPercentage / 100)).toFixed(2));
    return { partialPayment: { shop: '', adminOrderRefund: '', adminDeliveryRefund: '', adminVat: '' } };
  }

  if (
    isFinite(100 / totalSelectedAmount) &&
    data?.refundPercentage === 'by_percentage' &&
    data?.replacement === 'with'
  ) {
    if (!data?.selectedItems?.length) {
      return { replacementOrderCut };
    }

    const shopLossPercentage = Number(data?.byPercentage?.shop || 0);

    const adminLossPercentage = Number(data?.byPercentage?.adminOrderRefund || 0);

    replacementOrderCut.baseCurrency_shopCutForReplacement = Number(
      (totalSelectedAmount * (shopLossPercentage / 100)).toFixed(2),
    );

    replacementOrderCut.baseCurrency_shopCutForReplacement = Math.min(
      replacementOrderCut.baseCurrency_shopCutForReplacement,
      data?.deliveryFee,
    );

    replacementOrderCut.baseCurrency_adminCutForReplacement =
      totalSelectedAmount - replacementOrderCut?.baseCurrency_shopCutForReplacement;
    console.log({ replacementOrderCut, delivery: data?.deliveryFee });

    return {
      replacementOrderCut: {
        baseCurrency_shopCutForReplacement: '',
        secondaryCurrency_shopCutForReplacement: '',
        baseCurrency_adminCutForReplacement: '',
        secondaryCurrency_adminCutForReplacement: '',
      },
    };
  }

  if (data?.refundPercentage === 'by_price' && data?.replacement === 'with') {
    return { replacementOrderCut };
  }

  if (data?.refundPercentage === 'by_price' && data?.replacement === 'without') {
    return { partialPayment };
  }

  return {};
};

const getDeliveryFee = (order, flaggData, setFlaggData) => {
  console.log({ deliveryFee: order?.summary?.baseCurrency_riderFeeWithFreeDelivery });
  const deliveryFee =
    order?.summary?.baseCurrency_riderFeeWithFreeDelivery > 0
      ? order?.summary?.baseCurrency_riderFeeWithFreeDelivery
      : 0;

  const deliveryType =
    flaggData?.flaggedReason === 'missing-item' && flaggData?.replacement === 'with'
      ? 'shop-customer'
      : flaggData?.deliveryType;

  if (flaggData?.deliveryType === 'shop-customer-shop' && flaggData?.replacement === 'with') {
    setFlaggData((prev) => ({ ...prev, deliveryType, totalSelectedAmount: deliveryFee * 2 }));
    return deliveryFee * 2;
  }

  if (flaggData?.replacement === 'with') {
    setFlaggData((prev) => ({ ...prev, deliveryType, totalSelectedAmount: deliveryFee }));
  }

  return deliveryFee;
};

export const getSelectableItems = (order, flaggData) => {
  let data = [];
  let k = 1;

  // storing admin earning percentage from order amount
  const adminPercentage = order?.adminPercentage || 0;

  // check the order is replacement with missing order or not.
  const replacementWithMissingItem = flaggData?.replacement === 'with' && flaggData?.flaggedReason === 'missing-item';
  const replacementWith = flaggData?.replacement === 'with';
  console.log('order', { order });
  order?.productsDetails?.forEach((item) => {
    let quantity = item?.productQuantity;
    const deal = productDeal(item);
    if (deal === 'double_menu' && flaggData?.replacement !== 'with') {
      quantity /= 2;
    }
    for (let i = 0; i < quantity; i++) {
      // check there are any deal or not.

      const productPrice = getProductPrice(item, deal);
      // calculating shop earning
      const shopEarning = productPrice - productPrice * (adminPercentage / 100);
      // selecting product price conditionally
      const price = replacementWithMissingItem ? 0 : replacementWith ? shopEarning : productPrice;
      // calculating secondary currency of this
      const secondaryCurrency = order?.shop?.shopExchangeRate * Number(price);
      // make an template for add product
      const temp = { name: item?.productName, price, id: k, secondaryCurrency, ...item };
      // push template in data array object
      data.push(temp);
      k++;
    }
  });

  // secondary currncy for delivery fee
  const secondaryCurrency = order?.adminExchangeRate * order?.summary?.baseCurrency_riderFee;

  // check delivery fee is free or not.
  const deliveryFee =
    order?.summary?.baseCurrency_riderFee > 0
      ? { name: 'Delivery Fee', price: order?.summary?.baseCurrency_riderFee, id: 'delivery_fee', secondaryCurrency }
      : undefined;

  // check when should delivery fee should add.
  if (deliveryFee && flaggData?.replacement !== 'with' && flaggData?.replacement !== undefined) {
    data = [...data, deliveryFee];
  }

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

  // toggle handler when make toggle it make the item price zero other wise it return the original price of the item
  const onToggledHandler = (item, closed) => {
    setSelectedItem((prev) => {
      const findIndexOfToggledItem = prev?.findIndex((selected) => selected?.id === item?.id);
      const allItems = getSelectableItems(order, flaggData);
      const findIndexFromOriginalList = allItems?.findIndex((selected) => selected?.id === item?.id);

      if (findIndexOfToggledItem >= 0 && findIndexFromOriginalList >= 0) {
        const price = allItems[findIndexFromOriginalList]?.price;
        prev[findIndexOfToggledItem].price = closed ? price : 0;
      }
      setFlaggData((oldData) => {
        const totalSelectedAmount = prev.reduce((prevValue, item) => item?.price + prevValue, 0) + deliveryFee;
        const changeGivenPrice = getUpdatedPartialAndReplacementOrder({ ...oldData, deliveryFee }, totalSelectedAmount);
        return { ...oldData, ...changeGivenPrice, selectedItems: [...prev], totalSelectedAmount };
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
          prev?.replacement !== 'with'
            ? order?.summary?.baseCurrency_couponDiscountAmount > 0 && flaggData?.replacement === 'without'
              ? 0
              : selected.reduce((prevValue, item) => item?.price + prevValue, 0)
            : prev?.replacement === 'with' && prev?.flaggedReason !== 'missing-item'
            ? selected.reduce((prevValue, item) => item?.price + prevValue, 0) + deliveryFee
            : prev?.totalSelectedAmount;

        const changeGivenPrice = getUpdatedPartialAndReplacementOrder({ ...prev, deliveryFee }, totalSelectedAmount);

        return {
          ...prev,
          ...changeGivenPrice,

          // deliveryType: prev?.flaggedReason === 'missing-item' ? 'shop-customer' : prev?.deliveryType,
          selectedItems: selected,
          totalSelectedAmount,
          deliveryfee: deliveryFee,
        };
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
          prev?.replacement !== 'with'
            ? order?.summary?.baseCurrency_couponDiscountAmount > 0 && flaggData?.replacement === 'without'
              ? 0
              : selected.reduce((prevValue, item) => item?.price + prevValue, 0)
            : prev?.replacement === 'with' && prev?.flaggedReason !== 'missing-item'
            ? selected.reduce((prevValue, item) => item?.price + prevValue, 0) + deliveryFee
            : prev?.totalSelectedAmount;

        const changeGivenPrice = getUpdatedPartialAndReplacementOrder(prev, totalSelectedAmount);

        return {
          ...prev,
          ...changeGivenPrice,
          // deliveryType: prev?.flaggedReason === 'missing-item' ? 'shop-customer' : prev?.deliveryType,
          selectedItems: selected,
          totalSelectedAmount,
          deliveryfee: deliveryFee,
        };
      });
      return selected;
    });

    const allItems = getSelectableItems(order, flaggData);
    const findIndexFromOriginalList = allItems?.findIndex((selected) => selected?.id === item?.id);

    if (findIndexFromOriginalList >= -1) item.price = allItems[findIndexFromOriginalList]?.price;

    setRefundItem((prev) => [...prev, item]);
  };

  return (
    <Box>
      <Stack direction="row" gap={5} alignItems="flex-start">
        {/* left items */}
        <StyledContainer
          sx={{
            minHeight: '180px',
          }}
        >
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
        <Stack sx={{ minHeight: '180px' }} direction="row" alignContent="center" alignItems="center">
          <StyledIconButton
            disableRipple
            sx={{
              width: '44px',
              height: '44px',
              padding: '10px',
              color: 'primary.main',
              borderRadius: '50%!important',
            }}
          >
            <ExchangeIcon />
          </StyledIconButton>
        </Stack>
        {/* right items */}
        <StyledContainer>
          <Stack
            sx={{
              minHeight: '180px',
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
                    {FormateBaseCurrency.get(deliveryFee)}
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
                Total{' '}
              </Typography>
              {order?.summary?.baseCurrency_couponDiscountAmount > 0 && flaggData?.replacement === 'without' ? (
                <Typography variant="body2" minWidth="40px">
                  {FormateBaseCurrency.get(0)}
                </Typography>
              ) : (
                <Typography variant="body2" minWidth="40px">
                  {FormateBaseCurrency.get(flaggData?.totalSelectedAmount)}
                </Typography>
              )}
            </Stack>
            {order?.summary?.baseCurrency_couponDiscountAmount > 0 &&
              flaggData?.replacement === 'without' &&
              flaggData?.selectedItems?.length > 0 && (
                <Typography variant="body3">
                  (Here, a coupon is used, allowing the admin to change the overall amount.)
                </Typography>
              )}
          </Stack>
        </StyledContainer>
      </Stack>
    </Box>
  );
}

export default SelectItemsToRefund;
