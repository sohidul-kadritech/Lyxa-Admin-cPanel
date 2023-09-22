import { Box, Stack, useTheme } from '@mui/material';
import React from 'react';
import StyledRadioGroup from '../../../Styled/StyledRadioGroup';
import StyledInputBox from '../StyledInputBox';
import ByPercentage from './ByPercentage';
import ByPrice from './ByPrice';
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

function RefundOrder() {
  const theme = useTheme();
  return (
    <Box marginTop={5} pr={5}>
      <Stack gap={5}>
        {/* log User */}
        <StyledInputBox title="Log Users">
          <Stack mt={10 / 4}>
            <StyledRadioGroup
              items={logUsersOptions}
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
        {/* type */}
        <StyledInputBox title="Type">
          <Stack mt={10 / 4}>
            <StyledRadioGroup
              items={TypeOptions}
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
        {/* replacement order */}
        <StyledInputBox title="Replacement">
          <Stack mt={10 / 4}>
            <StyledRadioGroup
              items={ReplacementOptions}
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

        {/* Delivery type */}
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

        <StyledInputBox title="Refund">
          <Stack mt={10 / 4}>
            <StyledRadioGroup
              items={RefundOptions}
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

        <StyledInputBox title="Refund Type">
          <Stack mt={10 / 4}>
            <StyledRadioGroup
              items={RefundTypeOptions}
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
        {/*  */}

        <StyledInputBox title="Select Item to refund">
          <Stack mt={10 / 4}>
            <SelectItemsToRefund />
          </Stack>
        </StyledInputBox>

        <StyledInputBox title="Refund Percentage">
          <Stack mt={10 / 4} gap={2.5}>
            <StyledRadioGroup
              items={RefundPercentage}
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
            <ByPercentage />
            <ByPrice />
          </Stack>
        </StyledInputBox>
      </Stack>
    </Box>
  );
}

export default RefundOrder;
