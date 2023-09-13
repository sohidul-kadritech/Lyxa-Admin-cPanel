/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import { Visibility } from '@mui/icons-material';
import { Box, Checkbox, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as DownloadIcon } from '../../../assets/icons/download-icon.svg';
import { useGlobalContext } from '../../../context';
import TablePagination from '../../Common/TablePagination';
import UserAvatar from '../../Common/UserAvatar';
import TableSkeleton from '../../Skeleton/TableSkeleton';
import StyledIconButton from '../../Styled/StyledIconButton';
import StyledTable from '../../Styled/StyledTable3';
import { getPayoutData } from './helpers';

function PayoutTable({
  payoutData = [],
  loading = false,
  showFor = 'shop',
  queryParams,
  setQueryParams,
  totalPage,
  setOpen,
  setCurrentPayout,
}) {
  const { general } = useGlobalContext();

  console.log('payoutData', payoutData);

  const theme = useTheme();

  const currency = general?.currency?.symbol;
  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  const allColumns = [
    {
      id: 1,
      showFor: ['admin', 'shop', 'rider'],
      headerName: `NAME`,
      field: 'name',
      flex: 1.5,
      renderCell: ({ row }) => {
        const rowData = getPayoutData(row);
        return (
          <Stack direction="row" alignItems="center" sx={{ padding: '10px 0px !important' }}>
            <Checkbox />
            <UserAvatar
              imgAlt="user-image"
              imgUrl={rowData?.image}
              imgFallbackCharacter={rowData?.name?.charAt(0)}
              name={rowData?.name}
              subTitle={rowData?.autoGenId}
              toolTip={rowData?.type}
              subTitleProps={{ sx: { color: 'text.secondary', cursor: 'pointer' } }}
              titleProps={{
                sx: { color: 'primary.main', cursor: 'pointer' },
                onClick: () => {
                  history.push(rowData?.route);
                },
              }}
            />
          </Stack>
        );
      },
    },

    {
      id: 2,
      showFor: ['shop', 'rider', 'admin'],
      headerName: `SELLER`,
      field: 'seller',
      flex: 1.5,
      sortable: false,
      renderCell: ({ value }) => (
        <Stack width="100%" spacing={2} flexDirection="row" alignItems="center" gap="10px">
          <Box>
            <Typography
              variant="body1"
              onClick={() => {
                if (value?._id) history.push(`/seller/list/${value?._id}`);
              }}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                textTransform: 'capitalize',
                color: 'primary.main',
                cursor: 'pointer',
              }}
            >
              {value?.company_name || '_'}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 3,
      showFor: ['shop', 'rider', 'admin'],
      field: 'createdAt',
      headerName: 'DATE ISSUED',
      sortable: false,
      flex: 1.5,
      renderCell: ({ value }) => <Typography variant="body1">{moment(value).format('MMMM DD, YYYY')}</Typography>,
    },
    {
      id: 4,
      showFor: ['shop', 'rider', 'admin'],
      field: 'payoutOverDueDate',
      headerName: `DUE DATE`,
      sortable: false,
      flex: 1.5,
      renderCell: ({ value }) => <Typography variant="body1">{moment(value).format('MMMM DD, YYYY')}</Typography>,
    },
    {
      id: 5,
      showFor: ['shop', 'rider', 'admin'],
      field: 'profitBreakdown',
      headerName: `AMOUNT (${currency})`,
      sortable: false,
      flex: 1.5,
      renderCell: ({ value }) => {
        console.log('value', value);
        return (
          <Typography variant="body1">
            {currency} {(value?.totalAmount || value?.riderPayout || 0).toFixed(2)}
          </Typography>
        );
      },
    },
    {
      id: 6,
      showFor: ['shop', 'rider', 'admin'],
      headerName: `ACTION`,
      sortable: false,
      flex: 1,
      headerAlign: 'right',
      align: 'right',
      renderCell: ({ row }) => (
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
          <StyledIconButton
            color="primary"
            onClick={() => {
              setCurrentPayout(row);
              setOpen(true);
            }}
          >
            <Visibility />
          </StyledIconButton>
        </Stack>
      ),
    },
  ];
  return (
    <>
      <Box
        sx={{
          padding: '7.5px 16px  2px',
          maxHeight: '480px',
          overflow: 'auto',
          border: `1px solid ${theme.palette.custom.border}`,
          borderRadius: '7px',
        }}
      >
        {loading ? (
          <TableSkeleton columns={['avatar', 'text', 'text', 'text', 'text', 'text']} rows={5} />
        ) : (
          <StyledTable
            columns={allColumns.filter((column) => column?.showFor?.includes(showFor))}
            rows={payoutData}
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
                  {loading ? 'Loading...' : 'No Payouts Found'}
                </Stack>
              ),
            }}
          />
        )}
      </Box>

      <Box py={2.5}>
        <TablePagination
          currentPage={queryParams?.page || 1}
          lisener={(page) => {
            setQueryParams((prev) => ({ ...prev, page }));
          }}
          totalPage={totalPage || 1}
        />
      </Box>
    </>
  );
}

export default PayoutTable;
