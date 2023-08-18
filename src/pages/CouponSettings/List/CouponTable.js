/* eslint-disable prettier/prettier */
/* eslint-disable import/no-named-as-default */
// project import
import { Edit } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import ConfirmModal from '../../../components/Common/ConfirmModal';
import TableSkeleton from '../../../components/Skeleton/TableSkeleton';
import StyledIconButton from '../../../components/Styled/StyledIconButton';
import StyledSwitch from '../../../components/Styled/StyledSwitch';
import StyledTable from '../../../components/Styled/StyledTable3';
import StyledBox from '../../../components/StyledCharts/StyledBox';
import { useGlobalContext } from '../../../context';
import { successMsg } from '../../../helpers/successMsg';
import * as Api from '../../../network/Api';
import AXIOS from '../../../network/axios';
import { couponShopTypeOptions } from '../AddCoupon/helpers';
import { getFormatedDuration, isCouponIsExpired } from '../helpers';

export default function CouponTable({ rows = [], onEdit, couponType, loading }) {
  const queryClient = useQueryClient();
  const history = useHistory();
  const theme = useTheme();
  const routeMatch = useRouteMatch();

  const { general } = useGlobalContext();
  const currency = general?.currency?.symbol;

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
      },
    },
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
          currentCoupon.hidden = true;
          setCurrentCoupon({});
          setConfirmModal(false);
          queryClient.invalidateQueries([Api.GET_COUPON]);
        }
      },
    },
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
      renderCell: ({ row }) => (
        <Stack gap={1}>
          {row?.couponType === 'custom_coupon' && (
            <Typography
              variant="body4"
              color="primary.main"
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                history.push({
                  pathname: `/users/${row?.couponInfluencer?._id}`,
                  state: { from: routeMatch?.path, backToLabel: 'Back to coupons' },
                });
              }}
            >
              {row?.couponInfluencer?.name}
            </Typography>
          )}
          <Typography variant="body4">
            Get {row?.couponDiscountType === 'fixed' ? `${currency}` : ''}
            {row?.couponValue}
            {row?.couponDiscountType === 'percentage' ? '%' : ''} off
          </Typography>
          <Typography variant="body4" color="text.secondary2">
            {row?.couponName}
          </Typography>
        </Stack>
      ),
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
      renderCell: ({ row }) => {
        const isExpired = isCouponIsExpired(row);
        // getFormatedDuration(moment(), row?.couponDuration?.end);

        return (
          <Stack gap={1.5}>
            <Typography variant="body4">
              {getFormatedDuration(row?.couponDuration?.start, row?.couponDuration?.end)}
            </Typography>
            <Typography variant="body4" color={isExpired ? '#737373' : theme.palette.error.main}>
              {isExpired ? `${isExpired} left` : 'expired'}
            </Typography>
          </Stack>
        );
      },
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
      renderCell: ({ value, row }) => (
        <Typography variant="body4">{value ? `${row?.couponTotalUsageOrders}/${value}` : '_'}</Typography>
      ),
    },
    {
      id: 6,
      headerName: `AMOUNT LIMIT (${currency})`,
      sortable: false,
      field: 'couponAmountLimit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value, row }) => (
        <Typography variant="body4">{value ? `${row?.couponTotalUsageAmount || 0}/${value}` : '_'}</Typography>
      ),
    },
    {
      id: 7,
      headerName: `ORDER LIMIT PER USER`,
      sortable: false,
      field: 'couponUserLimit',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value || '_'}</Typography>,
    },
    {
      id: 7,
      headerName: `NEW ACCOUNTS`,
      sortable: false,
      field: 'couponUsedNewAccount',
      flex: 0.7,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value }) => <Typography variant="body4">{value}</Typography>,
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
      headerName: `STORE/CATEGORY`,
      sortable: false,
      field: 'couponShops',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      renderCell: ({ value = [], row }) => {
        let title = '';
        if (value?.length) {
          title = value?.map((shop) => shop?.shopName).join(', ');
        } else {
          title = row?.couponShopTypes
            ?.map((value) => couponShopTypeOptions?.find((option) => option?.value === value)?.label)
            .join(', ');
        }

        return (
          <Box maxWidth="100%">
            {value?.length ? (
              <Typography title={title} className="text-dots" variant="body4">
                {title}
              </Typography>
            ) : (
              <Typography title={title} className="text-dots" maxWidth="100%" variant="body4">
                {title}
              </Typography>
            )}
          </Box>
        );
      },
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
            history.push({
              pathname: `/users/${value[0]?._id}`,
              state: { from: routeMatch?.path, backToLabel: 'Back to coupons' },
            });
          }}
        >
          {value[0]?.name}
        </Typography>
      ),
    });
  }

  if (loading) return <TableSkeleton rows={6} columns={['text', 'text', 'text', 'text', 'text', 'text']} />;

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
            rows={rows?.filter((row) => !row?.hidden)}
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
