import { Box, Unstable_Grid2 as Grid, Stack, Typography, useTheme } from '@mui/material';
import { ReactComponent as StarIcon } from '../../../assets/icons/star.svg';
import UserAvatar from '../../../components/Common/UserAvatar';
import StyledTable from '../../../components/Styled/StyledTable3';
import StyledBox from '../../../components/StyledCharts/StyledBox';
import { shopsList } from './mock';

export default function ShopList() {
  const theme = useTheme();

  const column = [
    {
      id: 1,
      headerName: '',
      field: 'rowNumber',
      flex: 1,
      sortable: false,
      maxWidth: 90,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 2,
      headerName: <span style={{ display: 'inline-block', paddingLeft: '30px' }}>ITEM</span>,
      field: 'item',
      flex: 1.5,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center" gap={5}>
          <Box sx={{ width: '11px', height: '11px', backgroundColor: 'success.main', borderRadius: '50%' }} />
          <UserAvatar
            imgAlt="logo"
            imgUrl={row?.logo}
            imgStyle="circular"
            imgFallbackCharacter={row?.shopName?.charAt(0)}
            name={row?.shopName}
          />
        </Stack>
      ),
    },
    {
      id: 3,
      headerName: 'ORDERS',
      field: 'orders',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 4,
      headerName: 'AVG.TIME',
      field: 'avgTime',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 5,
      headerName: 'RATING',
      field: 'rating',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ value }) => (
        <Stack direction="row" alignItems="center" gap={1} color={theme.palette.success.main}>
          <StarIcon />
          <Typography variant="span" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 6,
      headerName: 'PROFIT',
      field: 'profit',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
  ];

  return (
    <Grid xs={12}>
      <StyledBox padding>
        <Typography variant="body1" fontWeight={600} pb={5}>
          Shop List
        </Typography>
        <StyledTable
          columns={column}
          rows={shopsList(25)}
          getRowId={(row) => row?._id}
          rowHeight={71}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No Items found
              </Stack>
            ),
          }}
        />
      </StyledBox>
    </Grid>
  );
}
