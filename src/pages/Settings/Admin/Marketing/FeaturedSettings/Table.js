/* eslint-disable import/no-named-as-default */
import { Edit } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import StyledIconButton from '../../../../../components/Styled/StyledIconButton';
import StyledSwitch from '../../../../../components/Styled/StyledSwitch';
import StyledTable from '../../../../../components/Styled/StyledTable3';

export default function SettingsTable({ rows, onEdit }) {
  const [render, setRender] = useState(false);

  const columns = [
    {
      id: 1,
      headerName: 'DURATION',
      field: 'duration',
      flex: 2,
      disableColumnFilter: true,
      sortable: false,
      renderCell: (params) => (
        <Typography variant="body4" style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
          {params?.value}
        </Typography>
      ),
    },
    {
      id: 2,
      headerName: 'AMOUNT',
      field: 'amount',
      headerAlign: 'left',
      align: 'left',
      sortable: false,
      flex: 2,
      minWidth: 200,
      renderCell: ({ value }) => <Typography variant="body4">${value}</Typography>,
    },
    {
      id: 3,
      headerName: '',
      field: 'action',
      sortable: false,
      flex: 4,
      minWidth: 100,
      headerAlign: 'right',
      align: 'right',
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-start" gap={4}>
          <StyledSwitch
            color="primary"
            checked={row?.status === 'active'}
            onChange={() => {
              console.log(row);
              row.status = row.status === 'active' ? 'inactive' : 'active';
              setRender(!render);
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
      <StyledTable columns={columns} rows={rows} />
    </Box>
  );
}
