/* eslint-disable import/no-named-as-default */
import { Edit } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import StyledIconButton from '../../../../../components/Styled/StyledIconButton';
import StyledSwitch from '../../../../../components/Styled/StyledSwitch';
import StyledTable from '../../../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../../../context';

export default function SettingsTable({ rows = [], onEdit, onStatusChange }) {
  const [render, setRender] = useState(false);
  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code);
  const { general } = useGlobalContext();
  const currency = general?.currency?.code;

  const columns = [
    {
      id: 1,
      headerName: 'DURATION',
      field: 'featuredWeeklyDuration',
      flex: 2,
      disableColumnFilter: true,
      sortable: false,
      renderCell: ({ value }) => (
        <Typography variant="body4" style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
          {value} week
        </Typography>
      ),
    },
    {
      id: 2,
      headerName: 'AMOUNT',
      field: 'featuredAmount',
      headerAlign: 'left',
      align: 'left',
      sortable: false,
      flex: 2,
      minWidth: 200,
      renderCell: ({ value }) => (
        <Typography variant="body4">
          {currency} {value}
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: '',
      field: 'featuredStatus',
      sortable: false,
      flex: 4,
      minWidth: 100,
      headerAlign: 'right',
      align: 'right',
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={4}>
          <StyledSwitch
            color="primary"
            checked={row?.featuredStatus === 'active'}
            onChange={() => {
              row.featuredStatus = row?.featuredStatus === 'active' ? 'inactive' : 'active';
              setRender(!render);
              onStatusChange(row);
              // set_has_unsaved_change(true);
            }}
          />
          <StyledIconButton
            onClick={() => {
              onEdit(row);
            }}
            color="primary"
          >
            <Edit />
          </StyledIconButton>
        </Stack>
      ),
    },
  ];
  return (
    <Box
      sx={{
        border: '1px solid #EEEEEE',
        borderRadius: '7px',
        padding: '6px 18px',
      }}
    >
      <StyledTable columns={columns} rows={rows} getRowId={(row) => row?._id} />
    </Box>
  );
}
