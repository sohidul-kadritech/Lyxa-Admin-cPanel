/* eslint-disable no-unused-vars */
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import _ from 'lodash';
import React, { useState } from 'react';
import { DateRangePicker } from 'react-dates';
import DatePresets from './Presets';

// eslint-disable-next-line no-unused-vars
export default function StyledDateRangePicker({ startDate, endDate, onChange }) {
  const [focusedInput, setFocusedInput] = useState(null);
  const [gotNull, setGotNull] = useState(false);
  const [date, setDate] = useState({ startDate, endDate });

  return (
    <DateRangePicker
      startDate={date?.startDate}
      endDate={date?.endDate}
      startDateId={_.uniqueId('start_date_id')}
      endDateId={_.uniqueId('end_date_id')}
      onDatesChange={({ startDate, endDate }) => {
        console.log({ startDate, endDate });

        if (startDate && endDate) {
          onChange({ startDate, endDate });
          setDate({ startDate, endDate });
        } else {
          setDate({ startDate, endDate });
        }
      }}
      focusedInput={focusedInput}
      onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
      noBorder
      customArrowIcon="-"
      showDefaultInputIcon
      inputIconPosition="after"
      customInputIcon={<ExpandMoreIcon />}
      hideKeyboardShortcutsPanel
      keepOpenOnDateSelect
      isOutsideRange={() => false}
      renderCalendarInfo={() => (
        <DatePresets
          endDate={endDate}
          startDate={startDate}
          onChange={({ startDate, endDate }) => {
            onChange({ startDate, endDate });
            setDate({ startDate, endDate });
          }}
        />
      )}
    />
  );
}
