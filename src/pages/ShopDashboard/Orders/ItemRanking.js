// third party
import { Unstable_Grid2 as Grid, Stack, Typography } from '@mui/material';
// import { useState } from 'react';
import { useQuery } from 'react-query';
import UserAvatar from '../../../components/Common/UserAvatar';
import StyledTable from '../../../components/Styled/StyledTable3';
import IncreaseDecrease from '../../../components/StyledCharts/IncreaseDecrease';
import StyledBox from '../../../components/StyledCharts/StyledBox';
import { useGlobalContext } from '../../../context';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';

export default function ItemRanking({ ...props }) {
  const itemsQuery = useQuery([Api.SHOP_DASHBOARD_ITEM_RANKING], () => AXIOS.get(Api.SHOP_DASHBOARD_ITEM_RANKING));
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  const column = [
    {
      id: 1,
      headerName: '',
      field: 'rowNumber',
      flex: 1,
      sortable: false,
      maxWidth: 90,
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
      renderHeader: () => <IncreaseDecrease status="neutral" amount="% ( Last 30 days )" />,
      field: 'soldAvgInPercentage',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => (
        <IncreaseDecrease status={value >= 0 ? 'increase' : 'decrease'} amount={value || 'none'} />
      ),
    },
    {
      id: 5,
      headerName: 'SALES',
      field: 'totalAmount',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value || 'none'}</Typography>,
    },
  ];

  return (
    <Grid xs={12} {...props}>
      <StyledBox padding>
        <Typography variant="body1" fontWeight={600} pb={5}>
          Item Ranking
        </Typography>
        <StyledTable
          columns={column}
          rows={
            itemsQuery?.data?.data?.items?.map((row, index) => ({
              ...row,
              rowNumber: index + 1,
            })) || []
          }
          getRowId={(row) => row?.product?._id}
          rowHeight={71}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                {itemsQuery?.isLoading ? '' : 'No Items found'}
              </Stack>
            ),
          }}
        />
      </StyledBox>
    </Grid>
  );
}
