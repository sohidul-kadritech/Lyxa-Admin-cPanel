import { Box } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import SearchBar from '../../../components/Common/CommonSearchbar';
import TablePagination from '../../../components/Common/TablePagination';
import { getQueryParamsInit } from '../helper';
import FlagTable from './Table';

const searchFlags = (flags, queryParams) => {
  const items = [];

  flags?.forEach((flag) => {
    if (moment(flag.createdAt).isBefore(queryParams.startDate)) return;
    if (moment(flag.createdAt).isAfter(queryParams.endDate)) return;

    if (!queryParams?.searchKey) {
      items?.push(flag);
      return;
    }

    if (flag?.comment?.toLowerCase()?.includes(queryParams?.searchKey?.toLowerCase())) {
      items.push(flag);
    }
  });

  items?.sort((a, b) => {
    if (moment(a?.createdAt).isBefore(b?.createdAt)) return queryParams?.sortBy === 'DESC' ? 1 : -1;
    if (moment(a?.createdAt).isAfter(b?.createdAt)) return queryParams?.sortBy === 'DESC' ? -1 : 1;
    return 0;
  });

  return items;
};

export default function ShopFlags({ flags = [], onViewDetail }) {
  const [queryParams, setQueryParams] = useState(getQueryParamsInit({ page: 1 }));
  const [filteredData, setFilteredData] = useState(flags);

  useEffect(() => {
    setFilteredData(searchFlags(flags, queryParams));
  }, [queryParams, flags]);

  return (
    <Box>
      <SearchBar
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        searchPlaceHolder="Search Flags"
        showFilters={{ search: true, sort: true, date: true }}
      />
      <Box sx={{ paddingTop: '30px' }} />
      <FlagTable flags={filteredData} onViewDetail={onViewDetail} />
      <TablePagination
        currentPage={queryParams?.page}
        lisener={(page) => {
          setQueryParams({ ...queryParams, page });
        }}
        totalPage={Math.ceil(filteredData.length / 5)}
      />
    </Box>
  );
}
