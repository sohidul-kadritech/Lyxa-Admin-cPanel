// third party
import { Box, Unstable_Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import TablePagination from '../../../components/Common/TablePagination';
import UserAvatar from '../../../components/Common/UserAvatar';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledTable from '../../../components/Styled/StyledTable3';
import IncreaseDecrease from '../../../components/StyledCharts/IncreaseDecrease';
import StyledBox from '../../../components/StyledCharts/StyledBox';
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

const getQueryParamsInit = (shopId) => ({
  page: 1,
  pageSize: 5,
  shopId,
});

export default function ItemRanking({ ...props }) {
  const { general, currentUser } = useGlobalContext();
  const currency = general?.currency?.symbol;
  const [queryParams, setQueryParams] = useState(getQueryParamsInit(currentUser?.shop?._id));

  const query = useQuery([Api.SHOP_DASHBOARD_ITEM_RANKING, queryParams], () =>
    AXIOS.get(Api.SHOP_DASHBOARD_ITEM_RANKING, {
      params: queryParams,
    })
  );

  const column = [
    {
      id: 1,
      headerName: '',
      field: 'rowNumber',
      flex: 1,
      sortable: false,
      maxWidth: 50,
      renderCell: ({ value }) => <Typography variant="body4">{value || 'none'}</Typography>,
    },
    {
      id: 2,
      headerName: 'ITEM',
      field: 'item',
      flex: 1.5,
      sortable: false,
      renderCell: ({ row }) => (
        <UserAvatar
          imgAlt="product"
          imgUrl={row?.product?.images}
          imgStyle="square"
          imgFallbackCharacter={row?.product?.name?.charAt(0) || 'none'}
          name={row?.product?.name}
          subTitle={`${currency} ${row?.product?.price}`}
        />
      ),
    },
    {
      id: 3,
      headerName: 'ITEMS SOLD',
      field: 'soldQuantity',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value || 'none'}</Typography>,
    },
    {
      id: 4,
      renderHeader: () => <IncreaseDecrease status="neutral" amount="% (30 days)" />,
      field: 'soldAvgInPercentage',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ value }) => (
        <IncreaseDecrease status={value >= 0 ? 'increase' : 'decrease'} amount={value || 'none'} />
      ),
    },
    {
      id: 5,
      headerName: `SALES (${currency})`,
      field: 'totalAmount',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value || 'none'}</Typography>,
    },
  ];

  const getRowNo = (index) => {
    const prev = (queryParams.page - 1) * queryParams.pageSize;
    return prev + index + 1;
  };

  return (
    <Grid xs={12} {...props}>
      <StyledBox padding>
        <Typography variant="body1" fontWeight={600} pb={5}>
          Item Ranking
        </Typography>
        {!query?.isLoading && (
          <Box>
            <StyledTable
              columns={column}
              rows={
                query?.data?.data?.items?.map((row, index) => ({
                  ...row,
                  rowNumber: getRowNo(index),
                })) || []
              }
              getRowId={(row) => row?.product?._id}
              rowHeight={71}
              components={{
                NoRowsOverlay: () => (
                  <Stack height="100%" alignItems="center" justifyContent="center">
                    No products ranked
                  </Stack>
                ),
              }}
            />
            <TablePagination
              currentPage={queryParams?.page}
              lisener={(page) => setQueryParams((prev) => ({ ...prev, page }))}
              totalPage={query?.data?.data?.paginate?.metadata?.page?.totalPage}
            />
          </Box>
        )}
        {query?.isLoading && <TableSkeleton columns={['text', 'text', 'text', 'text', 'text']} rows={7} />}
      </StyledBox>
    </Grid>
  );
}
