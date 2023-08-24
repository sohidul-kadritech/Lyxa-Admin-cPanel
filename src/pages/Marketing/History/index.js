import { Box, Stack } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import SearchBar from '../../../components/Common/CommonSearchbar';
import { getFirstMonday } from '../../../components/Styled/StyledDateRangePicker/Presets';
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import MarketingHistoryTable from './Table';

export const queryParamsInit = (props) => ({
  page: 1,
  pageSize: 10,
  sortBy: 'DESC',
  startDate: getFirstMonday('week'),
  endDate: moment(),
  searchKey: '',
  status: '',
  shopId: '',
  creatorType: '',
  ...props,
});

export default function MarketingHistory({ viewUserType }) {
  const params = useParams();
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;

  const [queryParams, setQueryParams] = useState(
    queryParamsInit({ shopId: params?.id || shop?._id, creatorType: viewUserType })
  );

  const query = useQuery([Api.GET_MARKETING_HISTORY, queryParams], () =>
    AXIOS.get(Api.GET_MARKETING_HISTORY, {
      params: queryParams,
    })
  );

  console.log(query?.data);

  return (
    <Box>
      <Stack pb={7.5} direction="row" justifyContent="flex-end">
        <SearchBar
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          searchPlaceHolder="Search"
          showFilters={{
            date: true,
            sort: true,
            status: true,
          }}
        />
      </Stack>
      <MarketingHistoryTable
        rows={query?.data?.data?.marketings}
        loading={query?.isLoading}
        page={queryParams?.page}
        totalPage={query?.data?.data?.paginate?.metadata?.page?.totalPage}
        setPage={(page) => setQueryParams((prev) => ({ ...prev, page }))}
      />
    </Box>
  );
}
