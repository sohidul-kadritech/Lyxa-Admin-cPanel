import moment from 'moment';
import { getFirstMonday } from '../components/Styled/StyledDateRangePicker/Presets';

export const dateRangeInit = {
  end: moment().format('YYYY-MM-DD'),
  start: getFirstMonday('week'),
};
