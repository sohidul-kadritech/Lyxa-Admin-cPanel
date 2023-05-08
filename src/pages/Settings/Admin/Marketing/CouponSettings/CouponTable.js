/* eslint-disable import/no-named-as-default */
// project import
import { Edit } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import ConfirmModal from '../../../../../components/Common/ConfirmModal';
import StyledIconButton from '../../../../../components/Styled/StyledIconButton';
import StyledSwitch from '../../../../../components/Styled/StyledSwitch';
import StyledTable from '../../../../../components/Styled/StyledTable3';
import StyledBox from '../../../../../components/StyledCharts/StyledBox';
import { successMsg } from '../../../../../helpers/successMsg';
import * as Api from '../../../../../network/Api';
import AXIOS from '../../../../../network/axios';
import { getFormatedDuration } from './helpers';

export default function CouponTable({ rows = [], onEdit, couponType }) {
  const queryClient = useQueryClient();
  const history = useHistory();

  const [confirmModal, setConfirmModal] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState({});

  const couponUpdateMutation = useMutation(
    (data = {}) =>
      AXIOS.post(Api.UPDATE_COUPON, {
        ...data,
        id: data?._id,
      }),
    {
      onSuccess: (data) => {
        console.log(data);
        if (data?.status) {
          queryClient.invalidateQueries([Api.GET_COUPON]);
        }
      },
    }
  );

  const couponDeleteMutation = useMutation(
    (data = {}) =>
      AXIOS.post(Api.DELETE_COUPON, {
        id: data?._id,
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          successMsg(data?.message, data?.status ? 'success' : undefined);
          setConfirmModal(false);
          setCurrentCoupon({});
        }
        queryClient.invalidateQueries([Api.GET_COUPON]);
      },
    }
  );

  const columns = [
    {
      id: 1,
      headerName: `COUPON`,
      sortable: false,
      field: 'invoiceId',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ row }) => <Typography variant="body4">{row?.couponName}</Typography>,
    },
    {
      id: 3,
      headerName: `DURATION`,
      sortable: false,
      field: 'status',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      minWidth: 180,
      renderCell: ({ row }) => (
        <Stack gap={1.5}>
          <Typography variant="body4">
            {getFormatedDuration(row?.couponDuration?.start, row?.couponDuration?.end)}
          </Typography>
          <Typography variant="body4" color="#737373">
            {getFormatedDuration(moment(), row?.couponDuration?.end)} left
          </Typography>
        </Stack>
      ),
    },
    {
      id: 4,
      headerName: `MIN ORDER`,
      sortable: false,
      field: 'couponMinimumOrderValue',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value ? `$${value}` : '_'}</Typography>,
    },
    {
      id: 5,
      headerName: `ORDER LIMIT`,
      sortable: false,
      field: 'couponOrderLimit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value || '_'}</Typography>,
    },
    {
      id: 6,
      headerName: `AMOUNT LIMIT`,
      sortable: false,
      field: 'couponAmountLimit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value ? `$${value}` : '_'}</Typography>,
    },
    {
      id: 7,
      headerName: `USER LIMIT`,
      sortable: false,
      field: 'couponUserLimit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value || '_'}</Typography>,
    },
    {
      id: 8,
      headerName: ``,
      sortable: false,
      field: 'action',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      minWidth: 150,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={4}>
          <StyledSwitch
            checked={params?.row?.couponStatus === 'active'}
            onChange={() => {
              params.row.couponStatus = params.row.couponStatus === 'active' ? 'inactive' : 'active';
              couponUpdateMutation.mutate(params?.row);
            }}
          />
          <StyledIconButton
            onClick={() => {
              onEdit(params?.row);
            }}
            color="primary"
          >
            <Edit />
          </StyledIconButton>
          <StyledIconButton
            color="primary"
            onClick={() => {
              setCurrentCoupon(params?.row);
              setConfirmModal(true);
            }}
          >
            <CloseIcon />
          </StyledIconButton>
        </Stack>
      ),
    },
  ];

  if (couponType === 'individual_store') {
    columns.splice(1, 0, {
      id: 2,
      headerName: `STORE`,
      sortable: false,
      field: 'couponShops',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value = [] }) => (
        <Typography
          sx={{
            cursor: 'pointer',
            maxWidth: '100%',
          }}
          variant="body4"
          color="primary"
          onClick={() => {
            history.push(`/shops/details/${value[0]?._id}`);
          }}
        >
          {value[0]?.shopName}
        </Typography>
      ),
    });
  }

  if (couponType === 'individual_user') {
    columns.splice(1, 0, {
      id: 2,
      headerName: `USER`,
      sortable: false,
      field: 'couponUsers',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value = [] }) => (
        <Typography
          sx={{
            cursor: 'pointer',
            maxWidth: '100%',
          }}
          className="text-dots"
          variant="body4"
          color="primary"
          onClick={() => {
            history.push(`/users/details/${value[0]?._id}`);
          }}
        >
          {value[0]?.name}
        </Typography>
      ),
    });
  }

  return (
    <>
      <StyledBox
        padding
        sx={{
          paddingTop: '3px',
          paddingBottom: '10px',
          overflowX: 'auto',
          scrollbarWidth: 'thin',
          scrollbarHeight: 'thin',

          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
        }}
      >
        <Box
          sx={{
            minWidth: '1070px',
          }}
        >
          <StyledTable
            autoHeight
            columns={columns}
            getRowId={(row) => row?._id}
            rows={rows}
            rowHeight={71}
            components={{
              NoRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  No Coupon found
                </Stack>
              ),
            }}
          />
        </Box>
      </StyledBox>
      <ConfirmModal
        isOpen={confirmModal}
        onCancel={() => {
          setConfirmModal(false);
          setCurrentCoupon({});
        }}
        blurClose
        loading={couponDeleteMutation.isLoading}
        message="Are you sure you want to delete this coupon ?"
        onConfirm={() => {
          couponDeleteMutation.mutate(currentCoupon);
        }}
      />
    </>
  );
}
