/* eslint-disable no-unused-vars */
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Stack } from '@mui/material';
import _ from 'lodash';
import React, { useState } from 'react';
import { DateRangePicker } from 'react-dates';
import DatePresets from './Presets';

// eslint-disable-next-line no-unused-vars
export default function StyledDateRangePicker({ startDate, endDate, onChange }) {
  const [focusedInput, setFocusedInput] = useState(null);
  const [gotNull, setGotNull] = useState(false);
  const [date, setDate] = useState({ startDate, endDate });

  // useEffect(() => {
  //   function handleClickOutside() {
  //     // onChange({ startDate, endDate });
  //   }

  //   // Attach the click event listener to the document
  //   document.addEventListener('click', handleClickOutside);

  //   return () => {
  //     // Remove the event listener when the component unmounts
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, []);

  return (
    <Stack>
      {/* <StyledDateInput /> */}

      <DateRangePicker
        // startDate={date?.startDate}
        startDate={startDate}
        // endDate={date?.endDate}
        endDate={endDate}
        startDateId={_.uniqueId('start_date_id')}
        endDateId={_.uniqueId('end_date_id')}
        onDatesChange={({ startDate, endDate }) => {
          console.log({ startDate, endDate });
          onChange({ startDate, endDate });
          // if (startDate && endDate) onChange({ startDate, endDate });
          // else {
          //   setDate({ startDate, endDate });
          // }
        }}
        onClose={({ startDate, endDate }) => {
          console.log('onClose', { startDate, endDate, date });
          // onChange(date);
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
        renderCalendarInfo={() => <DatePresets endDate={endDate} startDate={startDate} onChange={onChange} />}
      />
    </Stack>
  );
}
