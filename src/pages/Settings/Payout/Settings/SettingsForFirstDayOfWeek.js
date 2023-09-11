/* eslint-disable no-unused-vars */
import { Box } from '@mui/material';
import React from 'react';

import InputBox from '../../../ReferFriend/InputBox';
import { getPayoutType, validatePayoutType } from './helpers';

const firstDayOfWeekOptions = [
  {
    label: 'Sunday',
    value: '0',
  },
  {
    label: 'Monday',
    value: '1',
  },
  {
    label: 'Tuesday',
    value: '2',
  },
  {
    label: 'Wednesday',
    value: '3',
  },
  {
    label: 'Thursday',
    value: '4',
  },
  {
    label: 'Friday',
    value: '5',
  },
  {
    label: 'Saturday',
    value: '6',
  },
];

// You can now use firstDayOfWeekOptions as an array of options for selecting the first day of the week.

function SettingsForFirstDayOfWeek({ sx, settings, setSettings }) {
  return (
    <Box sx={{ ...(sx || {}) }}>
      <InputBox
        title="First day of week"
        intputType="select"
        titleSx={{
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '28px !important',
          letterSpacing: '-2% !important',
        }}
        stackStyle={{
          direction: 'column',
        }}
        inputProps={{
          items: firstDayOfWeekOptions,
          value: settings?.firstDayOfWeek?.toString() || '',
          placeholder: 'Select first day of week',
          onChange: (e) => {
            setSettings((prev) => {
              const type = getPayoutType?.firstDayOfWeek;
              const oldType = prev?.payoutType;
              const payoutType = validatePayoutType(type, oldType) ? [...oldType, type] : [...oldType];

              return {
                ...prev,
                firstDayOfWeek: e?.target?.value,
                payoutType,
              };
            });
          },
        }}
      />
    </Box>
  );
}

export default SettingsForFirstDayOfWeek;
