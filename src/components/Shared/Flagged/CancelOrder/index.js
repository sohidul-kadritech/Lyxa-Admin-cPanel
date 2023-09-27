/* eslint-disable no-unused-vars */
import { Box, Stack, useTheme } from '@mui/material';
import React from 'react';
import { useGlobalContext } from '../../../../context';
import StyledRadioGroup from '../../../Styled/StyledRadioGroup';
import { CustomInputField } from '../Refund/CustomInputField';

import { RefundPercentage, cancelReasonOptions, endorseLoseOptions, logUsersOptions } from '../Refund/helpers';
import StyledInputBox from '../StyledInputBox';
import ByPercentage from './ByPercentage';
import ByPrice from './ByPrice';
import SelectItemsToCancelOrder from './SelectItemsToCancelOrder';

export const initialDataForFlagg = (order) => {
  const flaggData = {
    orderId: order?._id,
    logUser: '', // all, rider, shop
    cancelReason: '',
    otherReason: '',
    isEndorseLoss: '', // true, false
    endorseLoss: {
      baseCurrency_shopLoss: 0,
      secondaryCurrency_shopLoss: 0,
      baseCurrency_adminLoss: 0,
      secondaryCurrency_adminLoss: 0,
    },
  };

  return flaggData;
};

function CancelOrder({ order, cancelOrderData, setCancelOrderData }) {
  const theme = useTheme();

  const { general } = useGlobalContext();

  const { appSetting } = general;

  console.log('appsettings', appSetting);

  const onChangeHandler = (e) => {
    setCancelOrderData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  console.log('order?.isButler', order?.isButler);

  return (
    <Box marginTop={5} pr={5}>
      <Stack gap={5}>
        {/* log User */}
        {!order?.isButler && (
          <StyledInputBox title="Log Users">
            <Stack mt={10 / 4}>
              <StyledRadioGroup
                items={logUsersOptions}
                value={cancelOrderData?.logUser}
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
        )}

        {/* type ---> flag reasone here */}

        <StyledInputBox title="Specific Reason">
          <Stack mt={10 / 4}>
            <StyledRadioGroup
              items={cancelReasonOptions}
              value={cancelOrderData?.cancelReason}
              name="cancelReason"
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

        {cancelOrderData?.cancelReason === 'others' && (
          <StyledInputBox title="Other reason">
            <Stack mt={10 / 4}>
              <CustomInputField
                inputProps={{
                  value: cancelOrderData?.otherReason,
                  name: 'otherReason',
                  type: 'text',
                  placeholder: 'Write other reason here...',
                  onChange: onChangeHandler,
                }}
              />
            </Stack>
          </StyledInputBox>
        )}

        {!order?.isButler && (
          <StyledInputBox title="Endorse Order">
            <Stack mt={10 / 4}>
              <StyledRadioGroup
                items={endorseLoseOptions}
                value={cancelOrderData?.isEndorseLoss}
                name="isEndorseLoss"
                onChange={(e) => {
                  setCancelOrderData((prev) => {
                    const endorseLoss = {
                      baseCurrency_shopLoss: 0,
                      secondaryCurrency_shopLoss: 0,
                      baseCurrency_adminLoss: 0,
                      secondaryCurrency_adminLoss: 0,
                    };
                    return { ...prev, endorseLoss: { ...endorseLoss } };
                  });
                  onChangeHandler(e);
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
            </Stack>
          </StyledInputBox>
        )}

        {cancelOrderData?.isEndorseLoss === 'true' && (
          <StyledInputBox title="Select Item to refund">
            <Stack mt={10 / 4}>
              <SelectItemsToCancelOrder order={order} setFlaggData={setCancelOrderData} flaggData={cancelOrderData} />
            </Stack>
          </StyledInputBox>
        )}

        {cancelOrderData?.isEndorseLoss === 'true' && (
          <StyledInputBox title="Put Cost On">
            <Stack mt={10 / 4} gap={2.5}>
              <StyledRadioGroup
                items={RefundPercentage}
                value={cancelOrderData?.refundPercentage}
                name="refundPercentage"
                onChange={(e) => {
                  onChangeHandler(e);

                  setCancelOrderData((prev) => {
                    const endorseLoss = {
                      baseCurrency_shopLoss: 0,
                      secondaryCurrency_shopLoss: 0,
                      baseCurrency_adminLoss: 0,
                      secondaryCurrency_adminLoss: 0,
                    };
                    return { ...prev, endorseLoss: { ...endorseLoss } };
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
              {cancelOrderData?.refundPercentage === 'by_percentage' && (
                <ByPercentage setCancelOrderData={setCancelOrderData} cancelOrderData={cancelOrderData} order={order} />
              )}
              {cancelOrderData?.refundPercentage === 'by_price' && (
                <ByPrice setCancelOrderData={setCancelOrderData} cancelOrderData={cancelOrderData} order={order} />
              )}
            </Stack>
          </StyledInputBox>
        )}
      </Stack>
    </Box>
  );
}

export default CancelOrder;
