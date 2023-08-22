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

export default function ReviewTable({ reviews, onViewDetail }) {
  const [currentPage, setCurrentPage] = useState(1);

  const [currentReview, setCurrentReview] = useState({});

  const [open, setOpen] = useState(false);

  const { currentUser } = useGlobalContext();

  const { admin } = currentUser;

  const { adminType } = admin;

  const queryClient = useQueryClient();

  const deleteReviewsQuery = useMutation((data) => AXIOS.post(API_URL.DELETE_USER_REVIEW, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg('Review deleted succesfully', 'success');
        queryClient.invalidateQueries(API_URL.SINGLE_SHOP);
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
          // checked={row?.status === 'active'}
          // onClick={() => {
          //   updateStatusQuery.mutate({ id: row._id, status: row?.status === 'active' ? 'inactive' : 'active' });
          // }}
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
          rows={reviews}
          columns={columns}
          reviews={localDatePagination(reviews, currentPage, 5)}
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
        totalPage={Math.ceil(reviews.length / 5)}
      />

      <ConfirmModal
        isOpen={open}
        message="Do you want to remove this review?"
        loading={deleteReviewsQuery?.isLoading}
        onCancel={() => {
          setOpen(false);
        }}
        onConfirm={() => {
          deleteReviewsQuery.mutate({ reviewId: currentReview?._id });
        }}
      />
    </>
  );
}
