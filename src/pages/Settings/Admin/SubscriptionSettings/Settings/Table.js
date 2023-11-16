/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import { Edit } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import FormateBaseCurrency from '../../../../../components/Common/FormateBaseCurrency';
import TableSkeleton from '../../../../../components/Skeleton/TableSkeleton';
import StyledIconButton from '../../../../../components/Styled/StyledIconButton';
import StyledSwitch from '../../../../../components/Styled/StyledSwitch';
import StyledTable from '../../../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../../../context';

function Table({ rows = [], onEdit, onStatusChange, loading = true }) {
  const [render, setRender] = useState(false);
  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code);
  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

  const columns = [
    {
      id: 1,
      headerName: 'SUBSCRIPTION PACKAGE',
      field: 'subscriptionPackage',
      flex: 2,
      disableColumnFilter: true,
      sortable: false,
      renderCell: ({ value }) => (
        <Typography
          variant="body4"
          style={{ overflow: 'hidden', textTransform: 'capitalize', textOverflow: 'ellipsis', width: '100%' }}
        >
          {value}
        </Typography>
      ),
    },
    {
      id: 2,
      headerName: 'AMOUNT',
      field: 'subscriptionFee',
      headerAlign: 'left',
      align: 'left',
      sortable: false,
      flex: 2,
      minWidth: 200,
      renderCell: ({ value }) => <Typography variant="body4">{FormateBaseCurrency.get(value)}</Typography>,
    },
    {
      id: 3,
      headerName: '',
      field: 'status',
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
              row.status = row?.status === 'active' ? 'inactive' : 'active';
              setRender(!render);
              onStatusChange(row, true);
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

  if (loading) {
    return <TableSkeleton columns={['text', 'text', 'text']} rows={2} />;
  }
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

export default Table;
