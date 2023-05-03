// third party
import { Unstable_Grid2 as Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import UserAvatar from '../../../components/Common/UserAvatar';
import StyledTable from '../../../components/Styled/StyledTable3';
import StyledBox from '../../../components/StyledCharts/StyledBox';

// project import
import IncreaseDecrease from '../../../components/StyledCharts/IncreaseDecrease';
import { rankedItems } from './mock';

export default function ItemRanking() {
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code);

  const columns = [
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
      headerName: 'ITEM',
      field: 'item',
      flex: 1.5,
      sortable: false,
      renderCell: ({ row }) => (
        <UserAvatar
          imgAlt="product"
          imgUrl={row?.profile_photo}
          imgStyle="square"
          imgFallbackCharacter={row?.name?.charAt(0)}
          name={row?.name}
          subTitle={`${currency} ${row?.price}`}
        />
      ),
    },
    {
      id: 3,
      headerName: 'ITEMS SOLD',
      field: 'sold',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
    {
      id: 4,
      headerName: <IncreaseDecrease status="neutral" amount="%" />,
      field: 'isIncreased',
      flex: 1,
      sortable: false,
      renderCell: ({ value }) => <IncreaseDecrease status={value ? 'increase' : 'decrease'} amount="10%" />,
    },
    {
      id: 5,
      headerName: 'SALES',
      field: 'sales',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
    },
  ];

  return (
    <Grid xs={12}>
      <StyledBox padding>
        <Typography variant="body1" fontWeight={600} pb={5}>
          Item Ranking
        </Typography>
        <StyledTable
          columns={columns}
          rows={rankedItems?.map((row, index) => ({
            ...row,
            rowNumber: index + 1,
          }))}
          getRowId={(row) => row?._id}
          rowHeight={71}
        />
      </StyledBox>
    </Grid>
  );
}
