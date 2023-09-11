import { Visibility } from '@mui/icons-material';
import { Box, Checkbox, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as DownloadIcon } from '../../../../assets/icons/download-icon.svg';
// eslint-disable-next-line import/no-named-as-default
import UserAvatar from '../../../../components/Common/UserAvatar';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../../../components/Styled/StyledIconButton';
import StyledTable from '../../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../../context';

function PayoutTable({ data = [], payoutData, loading = false }) {
  const { general } = useGlobalContext();

  console.log('payoutData', payoutData);
  const theme = useTheme();
  const currency = general?.currency?.symbol;
  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  const allColumns = [
    {
      id: 1,
      headerName: `NAME`,
      field: 'title',
      flex: 1.5,
      renderCell: ({ row }) => (
        <Stack direction="row" alignItems="center" sx={{ padding: '10px 0px !important' }}>
          <Checkbox />
          <UserAvatar
            imgAlt="user-image"
            imgUrl={row?.image}
            imgFallbackCharacter={row?.name?.charAt(0)}
            name={row?.name}
            subTitle={row?.autoGenId}
            subTitleProps={{ sx: { color: 'text.secondary', cursor: 'pointer' } }}
            titleProps={{ sx: { color: 'primary.main', cursor: 'pointer' } }}
          />
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: `SELLER`,
      field: 'order',
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Box>
            <Typography
              variant="body1"
              style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textTransform: 'capitalize' }}
            >
              {params?.row?.seller?.company_name}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 3,
      field: 'order_amount',
      headerName: 'DATE ISSUED',
      sortable: false,
      flex: 1.5,
      renderCell: (params) => <Typography variant="body1">{params?.row?.createdAt}</Typography>,
    },
    {
      id: 4,
      field: 'delivery_fee',
      headerName: `DUE DATE`,
      sortable: false,
      flex: 1.5,
      renderCell: (params) => <Typography variant="body1">{params?.row?.dueDate}</Typography>,
    },
    {
      id: 5,
      field: 'lyxa_profit',
      headerName: `AMOUNT (${currency})`,
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body1">
          {currency}
          {params?.row?.amount.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 6,
      headerName: `ACTION`,
      sortable: false,
      flex: 1,
      headerAlign: 'right',
      align: 'right',
      renderCell: () => (
        <Stack direction="row" alignItems="center" gap={2}>
          <StyledIconButton
            color="primary"
            sx={{
              width: 'auto',
              fontSize: '14px',
              textTransform: 'uppercase',
              paddingLeft: '20px',
              paddingRight: '20px',
            }}
          >
            Pay
          </StyledIconButton>
          <StyledIconButton color="primary">
            <DownloadIcon />
          </StyledIconButton>
          <StyledIconButton color="primary">
            <Visibility />
          </StyledIconButton>
        </Stack>
      ),
    },
  ];
  return (
    <Box
      sx={{
        padding: '7.5px 16px  2px',
        maxHeight: '480px',
        overflow: 'auto',
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '7px',
      }}
    >
      <StyledTable
        columns={allColumns}
        rows={data}
        autoHeight
        rowHeight={71}
        getRowId={(row) => row?._id}
        sx={{
          '& .MuiDataGrid-cell': {
            cursor: 'defualt',
          },
        }}
        components={{
          NoRowsOverlay: () => (
            <Stack height="100%" alignItems="center" justifyContent="center">
              {loading ? 'Loading...' : 'No Invoice Found'}
            </Stack>
          ),
        }}
      />
    </Box>
  );
}

export default PayoutTable;
