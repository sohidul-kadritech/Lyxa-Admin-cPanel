/* eslint-disable prettier/prettier */
import { isNaN } from 'lodash';

export function formatNumber(number, showDecimal = false) {
  // Use toLocaleString to format the number with thousands separators
  let string = number.toLocaleString('en-US').replace(/,/g, ' ');

  if (showDecimal === true) {
    string = Number(number)
      .toLocaleString('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
      })
      .replace(/,/g, ' ');
  }
  return isNaN(string) ? '' : string;
}

export function stringToNumber(str) {
  // Remove commas and parse as a float
  const string = parseFloat(str.replace(/ /g, ''));
  console.log('string', string);

  return isNaN(string) ? '' : string;
}
