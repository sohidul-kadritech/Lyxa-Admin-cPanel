/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import { Stack, debounce } from '@mui/material';
import React, { useMemo } from 'react';
import { ReactComponent as DownloadIcon } from '../../../assets/icons/download-icon-2.svg';
// import { ReactComponent as DownloadIcon } from '../../../assets/icons/download-icon-2.svg';
import { AddMenuButton } from '../../../pages/Faq2';
import StyledFormField from '../../Form/StyledFormField';
import StyledSearchBar from '../../Styled/StyledSearchBar';
import DateRange from '../../StyledCharts/DateRange';

const tabsOptions = [
  { value: '', label: 'All' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'revoked', label: 'Revoked' },
  { value: 'paid', label: 'Paid' },
];

function SearchBar({ queryParams, setQueryParams, searchPlaceHolder, onPaid, onDownload }) {
  const updateSearch = useMemo(
    () =>
      debounce((e) => {
        setQueryParams((prev) => ({ ...prev, searchKey: e.target.value, page: 1 }));
      }, 300),
    // eslint-disable-next-line prettier/prettier
    [],
  );

  return (
    <Stack direction="row" justifyContent="start" alignItems="center" gap="20px" flexWrap="wrap">
      <StyledSearchBar
        // fullWidth
        sx={{ flex: 1 }}
        placeholder={searchPlaceHolder}
        onChange={(e) => updateSearch(e)}
      />

      <StyledFormField
        intputType="select"
        tooltip="filtered by payout status"
        inputProps={{
          name: 'payoutStatus',
          size: 'sm',
          placeholder: 'Filtered by Payout Status',
          value: queryParams?.payoutStatus,
          items: tabsOptions || [],
          onChange: (e) => setQueryParams((prev) => ({ ...prev, [e.target.name]: e.target.value })),
        }}
      />
      <DateRange range={queryParams} startKey="startDate" endKey="endDate" setRange={setQueryParams} />

      <AddMenuButton
        title="Download"
        icon={<DownloadIcon />}
        onClick={() => {
          if (onDownload) onDownload();
        }}
      />
    </Stack>
  );
}

export default SearchBar;
