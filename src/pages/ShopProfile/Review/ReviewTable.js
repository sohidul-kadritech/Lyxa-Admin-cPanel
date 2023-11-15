/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import { Delete } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import Rating from '../../../components/Common/Rating';
import TableDateTime from '../../../components/Common/TableDateTime';
import TablePagination from '../../../components/Common/TablePagination';
import UserAvatar from '../../../components/Common/UserAvatar';

import ConfirmModal from '../../../components/Common/ConfirmModal';
import StyledIconButton from '../../../components/Styled/StyledIconButton';
import StyledSwitch from '../../../components/Styled/StyledSwitch';
import StyledTable from '../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../context';
import localDatePagination from '../../../helpers/localDataPaginations';
import { successMsg } from '../../../helpers/successMsg';
import * as API_URL from '../../../network/Api';
import AXIOS from '../../../network/axios';
import TablePageSkeleton from '../../Notification2/TablePageSkeleton';

export default function ReviewTable({ reviews, onViewDetail, setFilteredReviews, loading }) {
  const [currentPage, setCurrentPage] = useState(1);

  const [currentReview, setCurrentReview] = useState({});

  const [open, setOpen] = useState(false);

  const [actionType, setActionType] = useState('');

  const { currentUser } = useGlobalContext();

  const { admin } = currentUser;

  const { adminType } = admin;

  const queryClient = useQueryClient();

  const deleteReviewsQuery = useMutation((data) => AXIOS.post(API_URL.DELETE_USER_REVIEW, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg('Review deleted succesfully', 'success');
        setFilteredReviews((prev) => {
          const updatedReview = prev.filter((review) => review._id !== currentReview?._id);

          return updatedReview;
        });
        // queryClient.invalidateQueries(API_URL.SINGLE_SHOP);
        setOpen(false);
      } else {
        successMsg(data?.message, 'error');
      }
    },
  });

  const updateVisibilityReviewsQuery = useMutation((data) => AXIOS.post(API_URL.UPDATE_VISIBILITY_USER_REVIEW, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg('Review updated succesfully', 'success');
        setFilteredReviews((prev) => {
          const index = prev.findIndex((item) => item?._id === currentReview?._id);
          if (index >= 0) prev[index].reviewVisibility = !prev[index].reviewVisibility;
          return [...prev];
        });
        // queryClient.invalidateQueries(API_URL.SINGLE_SHOP);
        setOpen(false);
      } else {
        successMsg(data?.message, 'error');
      }
    },
  });

  const columns = [
    {
      id: 1,
      headerName: 'REVIEW',
      field: 'reviewDes',
      sortable: false,
      flex: 1,
      renderCell: ({ row }) => {
        let text = row?.reviewDes ? `${row?.reviewDes}, ` : '';
        // eslint-disable-next-line no-unsafe-optional-chaining
        text += row?.reviewTags?.join(', ');
        return <Typography variant="body4">{text || '_'}</Typography>;
      },
    },
    {
      id: 2,
      headerName: 'CUSTOMER',
      field: 'user',
      flex: 2,
      sortable: false,
      renderCell: ({ row }) => (
        <UserAvatar
          imgAlt="user"
          imgStyle="circle"
          imgUrl={row?.user?.profile_photo}
          name={row?.user?.name}
          subTitle={row?.order?.orderId}
          subTitleProps={{
            sx: { color: 'primary.main', cursor: 'pointer' },
            onClick: () => {
              console.log(row);
              onViewDetail(row?.order);
            },
          }}
        />
      ),
    },
    {
      id: 3,
      headerName: 'RATING',
      align: 'left',
      flex: 1,
      headerAlign: 'left',
      field: 'rating',
      sortable: false,
      renderCell: ({ value }) => <Rating amount={value} />,
    },
    {
      id: 4,
      headerName: 'DATE',
      align: 'right',
      flex: 1,
      headerAlign: 'right',
      field: 'createdAt',
      sortable: false,
      renderCell: ({ value }) => <TableDateTime date={value} />,
    },
  ];

  if (adminType === 'admin') {
    const newColumn = {
      id: 5,
      headerName: 'ACTION',
      align: 'right',
      flex: 1,
      headerAlign: 'right',
      field: 'action',
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" gap={3}>
          <StyledSwitch
            checked={row?.reviewVisibility}
            onClick={() => {
              setActionType(`${row?.reviewVisibility ? 'hide' : 'show'}`);
              setOpen(true);
              setCurrentReview(row);
            }}
          />
          <StyledIconButton
            sx={{
              '&.Mui-disabled': {
                color: '#c1c1c1',
                backgroundColor: '#F3F6F9',
              },
            }}
            color="primary"
            onClick={() => {
              setActionType('delete');
              setOpen(true);
              setCurrentReview(row);
            }}
          >
            <Delete />
          </StyledIconButton>
        </Stack>
      ),
    };

    columns.push(newColumn);
  }

  if (loading) {
    return (
      <Box
        sx={{
          pr: 5,
          pl: 3.5,
          pt: 1,
          pb: 1,
          border: '1px solid #EEEEEE',
          borderRadius: '7px',
          background: '#fff',
          marginTop: '30px',
        }}
      >
        <TablePageSkeleton row={5} column={4} />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          pr: 5,
          pl: 3.5,
          pt: 1,
          pb: 1,
          border: '1px solid #EEEEEE',
          borderRadius: '7px',
          background: '#fff',
          marginTop: '30px',
        }}
      >
        <StyledTable
          rows={localDatePagination(reviews, currentPage, 15)}
          columns={columns}
          // reviews={localDatePagination(reviews, currentPage, 5)}
          getRowId={(row) => row?._id}
          rowHeight={71}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                No reviews found
              </Stack>
            ),
          }}
        />
      </Box>
      <TablePagination
        currentPage={currentPage}
        lisener={(page) => {
          setCurrentPage(page);
        }}
        totalPage={Math.ceil(reviews.length / 15)}
      />

      <ConfirmModal
        isOpen={open}
        message={`Do you want to ${
          actionType === 'delete' ? 'delete this review' : `${actionType} this review from mobile apps`
        } ?`}
        loading={deleteReviewsQuery?.isLoading || updateVisibilityReviewsQuery?.isLoading}
        onCancel={() => {
          setOpen(false);
        }}
        onConfirm={() => {
          if (actionType === 'delete') {
            deleteReviewsQuery.mutate({ reviewId: currentReview?._id });
            return;
          }
          updateVisibilityReviewsQuery.mutate({ reviewId: currentReview?._id });
        }}
      />
    </>
  );
}
