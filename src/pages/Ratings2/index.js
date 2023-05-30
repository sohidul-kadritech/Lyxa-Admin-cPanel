import { Add } from '@mui/icons-material';
import { Box, Button, Chip, Drawer, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import TableLoader from '../../components/Common/TableLoader';
import StyledTable from '../../components/Styled/StyledTable3';
import minInMiliSec from '../../helpers/minInMiliSec';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import AddRating from './AddRating';

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '/settings',
  },
  {
    label: 'Ratings',
    to: '#',
  },
];

function AddMenuButton({ ...props }) {
  return (
    <Button variant="contained" color="primary" size="small" startIcon={<Add />} {...props}>
      Add
    </Button>
  );
}

function RatingSettings2() {
  const [currentTab, setCurrentTab] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [ratingType, setRatingType] = useState('shop');
  // eslint-disable-next-line no-unused-vars
  const [currentRating, setCurrentRating] = useState({});

  // ratings query
  const ratingsQuery = useQuery(
    [API_URL.GET_ALL_RATINGS, { type: ratingType }],
    () =>
      AXIOS.get(API_URL.GET_ALL_RATINGS, {
        params: {
          type: ratingType,
        },
      }),
    {
      staleTime: minInMiliSec(3),
      // eslint-disable-next-line prettier/prettier
    }
  );
  // get stars
  const getStars = (stars) => {
    let str = '';

    for (let i = 0; i < stars; i++) {
      str += '★';
    }
    return str;
  };

  // columns
  const columns = [
    {
      id: 1,
      headerName: 'Comments',
      field: 'tags',
      flex: 4,
      disableColumnFilter: true,
      sortable: false,
      renderCell: ({ value }) => (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            pt: 3,
            pb: 3,
          }}
        >
          {value.map((item, index) => (
            <Chip key={index} label={item} color="info" variant="contained" />
          ))}
        </Box>
      ),
    },
    {
      id: 2,
      headerName: 'Rating',
      field: 'rating',
      headerAlign: 'left',
      align: 'left',
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: ({ value }) => (
        <Typography variant="body1" className="text-capitalize">
          {getStars(value)}
        </Typography>
      ),
    },
    {
      id: 3,
      field: 'createdAt',
      headerName: 'Created',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography variant="body1">{new Date(params?.value || undefined).toLocaleDateString()}</Typography>
      ),
    },
  ];

  return (
    <Box>
      <PageTop
        // title="Zone"
        backButtonLabel="Back to Settings"
        breadcrumbItems={breadcrumbItems}
        backTo="/settings"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />

      <Box sx={{ marginBottom: '30px' }}>
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setCurrentTab(newValue);
            setRatingType(() => (newValue === 0 ? 'shop' : 'deliveryBoy'));
            // setIsSideBarOpen(false);
          }}
        >
          <Tab label="Shop"></Tab>
          <Tab label="Rider"></Tab>
        </Tabs>

        <Stack direction="row" justifyContent="end" sx={{ marginBottom: '30px' }}>
          <AddMenuButton
            onClick={() => {
              setCurrentRating({});
              setIsEdit(false);
              setIsRightBarOpen(true);
            }}
          />
        </Stack>
      </Box>
      <Box>
        <StyledTable
          columns={columns}
          rows={
            ratingsQuery?.data?.data?.ratingSetting
              ?.filter((item) => item?.tags?.length)
              // eslint-disable-next-line no-unsafe-optional-chaining
              .sort((a, b) => a?.rating - b?.rating) || []
          }
          getRowId={(row) => row?._id}
          onRowClick={({ row }) => {
            setCurrentRating(row);
            setIsEdit(true);
            setIsRightBarOpen(true);
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              cursor: 'pointer',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
            },
          }}
          components={{
            NoRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                {ratingsQuery?.isLoading ? <TableLoader /> : 'No Rating Found'}
              </Stack>
            ),
          }}
        />
      </Box>

      <Drawer open={isRightBarOpen} anchor="right">
        <AddRating
          isEdit={isEdit}
          rating={isEdit ? currentRating : { rating: '4', tags: [], type: ratingType }}
          refetchFlags={() => {
            ratingsQuery.refetch();
          }}
          onClose={() => setIsRightBarOpen(false)}
        />
      </Drawer>
    </Box>
  );
}

export default RatingSettings2;
