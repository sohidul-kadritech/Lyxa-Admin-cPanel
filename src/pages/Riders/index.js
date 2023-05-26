import { Box, Drawer, Typography } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import TablePagination from '../../components/Common/TablePagination';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import AddRider from './AddRider';
import RidersTable from './RiderTable';
import SearchBar from './Searchbar';
import TableSkeleton from './TableSkeleton';
import { queryParamsInit } from './helper';

export default function RiderList() {
  const [queryParams, setQueryParams] = useState({ ...queryParamsInit });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [currentRider, setCurrentRider] = useState({});

  const query = useQuery(
    [Api.ALL_DELIVERY_MAN, { ...queryParams }],
    () => AXIOS.get(Api.ALL_DELIVERY_MAN, { params: { ...queryParams } }),
    {
      onSuccess: (data) => {
        console.log(data);
        setTotalPage(data?.data?.paginate?.metadata?.page?.totalPage);
      },
    }
  );

  return (
    <Box pt={9} pb={10}>
      <Typography variant="h4" pb={10}>
        Riders
      </Typography>
      <SearchBar
        queryParams={queryParams}
        setQueryParams={setQueryParams}
        onAdd={() => {
          setSidebarOpen(true);
        }}
        searchPlaceHolder="Search 24 items"
      />
      {query.isLoading && <TableSkeleton />}
      {!query.isLoading && (
        <Box>
          <RidersTable
            rows={query?.data?.data?.deliveryBoys}
            onEdit={(rider) => {
              setCurrentRider(rider);
              setSidebarOpen(true);
            }}
          />
          <TablePagination
            currentPage={queryParams.page}
            totalPage={totalPage}
            lisener={(page) => {
              console.log(page);
              setQueryParams((prev) => ({ ...prev, page }));
            }}
          />
        </Box>
      )}
      <Drawer open={sidebarOpen} anchor="right">
        <AddRider onClose={() => setSidebarOpen(false)} editRider={currentRider} />
      </Drawer>
    </Box>
  );
}
