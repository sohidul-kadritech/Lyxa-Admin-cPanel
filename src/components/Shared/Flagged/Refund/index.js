/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import StyledRadioGroup from '../../../Styled/StyledRadioGroup';
import StyledInputBox from '../StyledInputBox';
import ByPercentage from './ByPercentage';
import ByPrice from './ByPrice';
import { CustomInputField } from './CustomInputField';
import SelectItemsToRefund from './SelectItemsToRefund';
import {
  DeliveryTypeOptions,
  RefundOptions,
  RefundPercentage,
  RefundTypeOptions,
  ReplacementOptions,
  TypeOptions,
  logUsersOptions,
} from './helpers';

function RefundOrder({ flaggData, setFlaggData, order }) {
  const theme = useTheme();

  const onChangeHandler = (e) => {
    setFlaggData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        {flaggData?.replacement === 'with' && (
          <StyledInputBox title="Delivery Type">
            <Stack mt={10 / 4}>
              <StyledRadioGroup
                items={DeliveryTypeOptions}
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

        {flaggData?.replacement && (
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
        {flaggData?.refund === 'with' && (
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
                  background: theme.palette.background.secondary,
                  padding: '12px 18px',
                  borderRadius: '10px',
                  flex: 1,
                }}
              />
            </Stack>
          </StyledInputBox>
        )}

        {/* when we select partial order */}

        {flaggData?.refundType === 'partial' && (
          <StyledInputBox title="Select Item to refund">
            <Stack mt={10 / 4}>
              <SelectItemsToRefund order={order} setFlaggData={setFlaggData} flaggData={flaggData} />
            </Stack>
          </StyledInputBox>
        )}

        {flaggData?.refundType === 'partial' && (
          <StyledInputBox title="Refund Percentage">
            <Stack mt={10 / 4} gap={2.5}>
              <StyledRadioGroup
                items={RefundPercentage}
                value={flaggData?.refundPercentage}
                name="refundPercentage"
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

              {flaggData?.refundPercentage === 'by_percentage' && (
                <ByPercentage setFlaggData={setFlaggData} flaggData={flaggData} order={order} />
              )}
              {flaggData?.refundPercentage === 'by_price' && (
                <ByPrice setFlaggData={setFlaggData} flaggData={flaggData} order={order} />
              )}

              <Stack mt={2.5}>
                <Typography variant="h6">Total VAT: {flaggData?.totalSelectedAmount * 0.1 || 0}</Typography>
              </Stack>
            </Stack>
          </StyledInputBox>
        )}
      </Stack>
    </Box>
  );
}

export default RefundOrder;
