import { Box } from '@mui/material';
import React from 'react';
import InputBox from '../../../ReferFriend/InputBox';
import { getPayoutType, validatePayoutType } from './helpers';

function OverDuePeriod({ sx, settings, setSettings }) {
  return (
    <Box sx={{ ...(sx || {}) }}>
      <InputBox
        title="Over Due Periods"
        intputType="text"
        titleSx={{
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '28px !important',
          letterSpacing: '-2% !important',
        }}
        endAdornment="Days"
        inputProps={{
          type: 'number',
          placeholder: 'Enter over due periods as days...',
          value: settings?.overDuePeriod || '',
          onChange: (e) => {
            setSettings((prev) => {
              const type = getPayoutType?.overDuePeriod;
              const oldType = prev?.payoutType;
              const payoutType = validatePayoutType(type, oldType) ? [...oldType, type] : [...oldType];

              return {
                ...prev,
                overDuePeriod: e?.target?.value,
                payoutType,
              };
            });
          },
          sx: {
            height: '24px',
          },
        }}
        stackStyle={{
          direction: 'column',
        }}
      />
    </Box>
  );
}

export default OverDuePeriod;
