/* eslint-disable prettier/prettier */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useGlobalContext } from '../../../../context';
import StyledRadioGroup from '../../../Styled/StyledRadioGroup';
import StyledInputBox from '../StyledInputBox';
import ByPercentage from './ByPercentage';
import ByPrice from './ByPrice';
import { CustomInputField } from './CustomInputField';

import { getRefundMaxAmounts } from '../../RefundOrder/helpers';

import SelectItemsToRefund from './SelectItemsToRefund';

import { TitleWithToolTip } from '../../../../pages/NewOrder/helpers';

import StyledFormField from '../../../Form/StyledFormField';
import {
  DeliveryTypeOptions,
  RefundOptions,
  RefundPercentage,
  RefundTypeOptions,
  ReplacementOptions,
  TypeOptions,
  calculateVat,
  getInitialValue,
  getMaximumAdjustableAmount,
  getTotalRefundAmountWithVat,
  logUsersOptions,
} from './helpers';

function RefundOrder({ flaggData, setFlaggData, order }) {
  const theme = useTheme();

  const { general } = useGlobalContext();

  const { appSetting } = general;

  const onChangeHandler = (e) => {
    setFlaggData((prev) => {
      if (prev?.replacement === 'with' && e.target.name === 'flaggedReason' && e.target.value === 'missing-item') {
        return { ...prev, deliveryType: 'shop-customer', [e.target.name]: e.target.value };
      }

      if (prev?.refund === 'with' && e.target.name === 'refundType' && e.target.value === 'full') {
        return { ...prev, partialPayment: { ...getRefundMaxAmounts(order) }, [e.target.name]: e.target.value };
      }

      if (e.target.name === 'totalSelectedAmount') {
        return {
          ...prev,
          partialPayment: {
            shop: '',
            adminOrderRefund: '',
            adminDeliveryRefund: '',
            adminVat: '',
          },
          [e.target.name]: e.target.value,
        };
      }

      return { ...prev, ...getInitialValue(e.target.name), [e.target.name]: e.target.value };
    });
  };

  return (
    <Box marginTop={5} pr={5}>
      <Stack gap={5}>
        {/* log User */}
        <StyledInputBox title="Log Users">
          <Stack mt={10 / 4}>
            <StyledRadioGroup
              items={logUsersOptions}
              value={flaggData?.logUser}
              sx={{
                flexDirection: 'row',
                gap: '20px',
              }}
              sxForm={{
                background: theme.palette.background.secondary,
                padding: '12px 18px',
                borderRadius: '10px',
                flex: 1,
              }}
              name="logUser"
              onChange={onChangeHandler}
            />
          </Stack>
        </StyledInputBox>

        {/* type ---> flag reasone here */}

        <StyledInputBox title="Type">
          <Stack mt={10 / 4}>
            <StyledRadioGroup
              items={TypeOptions}
              value={flaggData?.flaggedReason}
              name="flaggedReason"
              onChange={onChangeHandler}
              sx={{
                flexDirection: 'row',
                gap: '20px',
              }}
              sxForm={{
                background: theme.palette.background.secondary,
                padding: '12px 18px',
                borderRadius: '10px',
                flex: 1,
              }}
            />
          </Stack>
        </StyledInputBox>

        {flaggData?.flaggedReason === 'others' && (
          <StyledInputBox title="Other reason">
            <Stack mt={10 / 4}>
              <CustomInputField
                inputProps={{
                  value: flaggData?.otherReason,
                  name: 'otherReason',
                  type: 'text',
                  placeholder: 'Write other reason here...',
                  onChange: onChangeHandler,
                }}
              />
            </Stack>
          </StyledInputBox>
        )}

        {/* replacement order */}
        {flaggData?.flaggedReason && (
          <StyledInputBox title="Replacement">
            <Stack mt={10 / 4}>
              <StyledRadioGroup
                items={ReplacementOptions}
                value={flaggData?.replacement}
                name="replacement"
                onChange={onChangeHandler}
                sx={{
                  flexDirection: 'row',
                  gap: '20px',
                }}
                sxForm={{
                  background: theme.palette.background.secondary,
                  padding: '12px 18px',
                  borderRadius: '10px',
                  flex: 1,
                }}
              />
            </Stack>
          </StyledInputBox>
        )}

        {/* Delivery type */}
        {flaggData?.replacement === 'with' && flaggData?.flaggedReason !== 'missing-item' && (
          <StyledInputBox title="Delivery Type">
            <Stack mt={10 / 4}>
              <StyledRadioGroup
                items={DeliveryTypeOptions}
                value={flaggData?.deliveryType}
                name="deliveryType"
                onChange={onChangeHandler}
                sx={{
                  flexDirection: 'row',
                  gap: '20px',
                }}
                sxForm={{
                  background: theme.palette.background.secondary,
                  padding: '12px 18px',
                  borderRadius: '10px',
                  flex: 1,
                }}
              />
            </Stack>
          </StyledInputBox>
        )}

        {flaggData?.replacement === 'without' && (
          <StyledInputBox title="Refund">
            <Stack mt={10 / 4}>
              <StyledRadioGroup
                items={RefundOptions}
                value={flaggData?.refund}
                name="refund"
                onChange={onChangeHandler}
                sx={{
                  flexDirection: 'row',
                  gap: '20px',
                }}
                sxForm={{
                  background: theme.palette.background.secondary,
                  padding: '12px 18px',
                  borderRadius: '10px',
                  flex: 1,
                }}
              />
            </Stack>
          </StyledInputBox>
        )}

        {/* when with refund is selected then it will visible */}
        {flaggData?.refund === 'with' && flaggData?.replacement === 'without' && (
          <StyledInputBox title="Refund Type">
            <Stack mt={10 / 4}>
              <StyledRadioGroup
                items={RefundTypeOptions}
                value={flaggData?.refundType}
                name="refundType"
                onChange={onChangeHandler}
                sx={{
                  flexDirection: 'row',
                  gap: '20px',
                }}
                sxForm={{
                  background: theme?.palette?.background?.secondary,
                  padding: '12px 18px',
                  borderRadius: '10px',
                  flex: 1,
                }}
              />
            </Stack>
            {/* when refund with group order the message will show */}
            {order?.cart?.cartType === 'group' && flaggData?.refund === 'with' && flaggData?.refundType && (
              <Typography variant="body3">
                {flaggData?.refundType === 'full'
                  ? '** Full refund is refundable for all individual user'
                  : '** Partial refund only refundable for creator of this group order'}
              </Typography>
            )}
            {flaggData?.refundType === 'full' && (
              <Stack mt={2.5} gap={2.5}>
                <TitleWithToolTip
                  tooltip="Lyxa Earning + Lyxa VAT + Shop Earning + Shop VAT + Rider Earning + Rider VAT"
                  title={`Total Refund Amount: ${appSetting?.baseCurrency?.symbol} ${getTotalRefundAmountWithVat(
                    order,
                    flaggData,
                  )}`}
                />
              </Stack>
            )}
          </StyledInputBox>
        )}

        {/* when we select partial order */}
        {((flaggData?.refund === 'with' && flaggData?.refundType === 'partial') ||
          flaggData?.replacement === 'with') && (
          <StyledInputBox
            title={flaggData?.replacement === 'with' ? 'Select Item to replacement' : 'Select Item to refund'}
          >
            <Stack mt={10 / 4}>
              <SelectItemsToRefund order={order} setFlaggData={setFlaggData} flaggData={flaggData} />
            </Stack>
          </StyledInputBox>
        )}

        {flaggData?.selectedItems?.length > 0 &&
          order?.summary?.baseCurrency_couponDiscountAmount > 0 &&
          flaggData?.refund === 'with' &&
          flaggData?.refundType === 'partial' && (
            <StyledFormField
              label="Adjust total amount"
              intputType="text"
              inputProps={{
                type: 'number',
                name: 'totalSelectedAmount',
                value: flaggData?.totalSelectedAmount,
                onChange: (e) => {
                  const updatedInputValue = getMaximumAdjustableAmount(order, e.target.value);
                  console.log('updatedInputValue', updatedInputValue);
                  onChangeHandler({ ...e, target: { ...e?.target, name: e.target.name, value: updatedInputValue } });
                },
              }}
            />
          )}

        {((flaggData?.refundType === 'partial' &&
          flaggData?.refund === 'with' &&
          flaggData?.selectedItems?.length > 0) ||
          (flaggData?.replacement === 'with' && flaggData?.selectedItems?.length > 0)) && (
          <StyledInputBox title={flaggData?.replacement === 'with' ? 'Put cost on' : 'Refund Percentage'}>
            <Stack mt={10 / 4} gap={2.5}>
              <StyledRadioGroup
                items={RefundPercentage}
                value={flaggData?.refundPercentage}
                name="refundPercentage"
                onChange={(e) => {
                  onChangeHandler(e);
                  setFlaggData((prev) => {
                    const partialPayment = {
                      shop: 0,
                      adminOrderRefund: 0,
                      adminDeliveryRefund: 0,
                      adminVat: 0,
                    };

                    return { ...prev, partialPayment: { ...partialPayment } };
                  });
                }}
                sx={{
                  flexDirection: 'row',
                  gap: '20px',
                }}
                sxForm={{
                  background: theme.palette.background.secondary,
                  padding: '12px 18px',
                  borderRadius: '10px',
                  flex: 1,
                }}
              />

              {flaggData?.refundPercentage === 'by_percentage' && flaggData?.totalSelectedAmount > 0 && (
                <ByPercentage setFlaggData={setFlaggData} flaggData={flaggData} order={order} />
              )}
              {flaggData?.refundPercentage === 'by_price' && flaggData?.totalSelectedAmount > 0 && (
                <ByPrice setFlaggData={setFlaggData} flaggData={flaggData} order={order} />
              )}

              <Stack mt={2.5} gap={2.5}>
                <TitleWithToolTip
                  tooltip="Lyxa Earning + Lyxa VAT + Shop Earning + Shop VAT + Rider Earning + Rider VAT"
                  title={`${flaggData?.replacement === 'without' ? 'Total VAT' : 'Total Delivery VAT'}: ${
                    appSetting?.baseCurrency?.symbol
                  } ${calculateVat(order, flaggData, appSetting?.vat).totalVat}`}
                />
                {flaggData?.refundType === 'partial' && (
                  <TitleWithToolTip
                    tooltip="Lyxa Earning + Lyxa VAT + Shop Earning + Shop VAT + Rider Earning + Rider VAT"
                    title={`Total Refund Amount: ${appSetting?.baseCurrency?.symbol} ${getTotalRefundAmountWithVat(
                      order,
                      flaggData,
                      calculateVat(order, flaggData, appSetting?.vat).totalVat,
                    )}`}
                  />
                )}
              </Stack>
            </Stack>
          </StyledInputBox>
        )}
      </Stack>
    </Box>
  );
}

export default RefundOrder;
