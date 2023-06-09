import { Box, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import Rating from '../../../components/Common/Rating';
import TableDateTime from '../../../components/Common/TableDateTime';
import TablePagination from '../../../components/Common/TablePagination';
import UserAvatar from '../../../components/Common/UserAvatar';
import StyledTable from '../../../components/Styled/StyledTable3';
import localDatePagination from '../../../helpers/localDataPaginations';

export default function ReviewTable({ reviews, onViewDetail }) {
  const [currentPage, setCurrentPage] = useState(1);

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
    </>
  );
}
