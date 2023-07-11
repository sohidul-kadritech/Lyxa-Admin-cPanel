import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import _ from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';
import { DateRangePicker } from 'react-dates';

export default function StyledDateRangePicker({ startDate, endDate, onChange }) {
  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <DateRangePicker
      startDate={moment(startDate)}
      startDateId={_.uniqueId('start_date_id')}
      endDate={moment(endDate)}
      endDateId={_.uniqueId('end_date_id')}
      onDatesChange={onChange}
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
    />
  );
}
