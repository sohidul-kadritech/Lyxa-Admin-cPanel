/* eslint-disable no-unsafe-optional-chaining */
// mui
import ReplayIcon from '@mui/icons-material/Replay';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  Unstable_Grid2 as Grid,
  useTheme,
} from '@mui/material';
// third party
import { useState } from 'react';

// project import
import { useQuery } from 'react-query';
import BreadCrumbs from '../../components/Common/BreadCrumb2';
import CloseButton from '../../components/Common/CloseButton';
import TableLoader from '../../components/Common/TableLoader';
import FilterButton from '../../components/Filter/FilterButton';
import GlobalWrapper from '../../components/GlobalWrapper';
import StyledTable from '../../components/StyledTable';
import * as Api from '../../network/Api';
import AXIOS from '../../network/axios';
import AddRatings from './addRating';

// breadcrumb items
const breadcrumbItems = [
  {
    to: '/',
    label: 'Lyxa',
  },
  {
    to: '/settings/ratings',
    label: 'Ratings',
  },
];

export default function RatingSettings() {
  const theme = useTheme();
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);

  const [currentTab, setCurrentTab] = useState(0);
  const [currentRightTab, setCurrentRightTab] = useState('');
  const [currentRating, setCurrentRating] = useState({});

  // type
  // eslint-disable-next-line no-unused-vars
  const [ratingType, setRatingType] = useState('shop');

  // ratings query
  const ratingsQuery = useQuery(['ratings', { type: ratingType }], () =>
    AXIOS.get(Api.GET_ALL_RATINGS, {
      params: {
        type: ratingType,
      },
    })
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
    <GlobalWrapper padding>
      <Box className="page-content2">
        <Grid container sx={{ height: 'calc(100vh - 130px)', overflowY: 'hidden' }}>
          {/* left */}
          <Grid
            container
            md={isRightBarOpen ? 8 : 12}
            pr={{
              xl: isRightBarOpen ? 10 : 0,
              lg: isRightBarOpen ? 5 : 0,
            }}
            sx={{
              height: '100%',
              overflowY: 'scroll',
              pb: 9,
            }}
          >
            <Grid md={12}>
              <BreadCrumbs
                items={breadcrumbItems}
                sx={{
                  pb: 0,
                }}
              />
              <Paper>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', pt: 6 }}>
                  <Tabs
                    value={currentTab}
                    onChange={(event, value) => {
                      setCurrentTab(value);
                      setRatingType(value === 0 ? 'shop' : 'deliveryBoy');
                    }}
                    aria-label="basic tabs example"
                  >
                    <Tab label="Shop" />
                    <Tab label="Rider" />
                  </Tabs>
                </Box>
                <Stack direction="row" pt={10} pb={3} justifyContent="space-between">
                  <Tooltip title="Refresh">
                    <Box>
                      <FilterButton
                        label="Refresh"
                        className={`${ratingsQuery.isLoading || ratingsQuery.isFetching ? 'refresh-animate' : ''}`}
                        endIcon={<ReplayIcon />}
                        onClick={() => {
                          ratingsQuery.refetch();
                        }}
                        sx={{
                          gap: '8px',
                          '& .MuiButton-endIcon': {
                            marginLeft: '0px',
                          },
                        }}
                      />
                    </Box>
                  </Tooltip>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setIsRightBarOpen(true);
                      setCurrentRightTab('add');
                    }}
                  >
                    Add New
                  </Button>
                </Stack>
                <Box sx={{ flexGrow: 1, height: '100%', width: '100%', position: 'relative' }}>
                  <StyledTable
                    columns={columns}
                    rows={
                      ratingsQuery?.data?.data?.ratingSetting
                        ?.filter((item) => item?.tags?.length)
                        .sort((a, b) => a?.rating - b?.rating) || []
                    }
                    getRowId={(params) => params?._id}
                    rowHeight={60}
                    getRowHeight={() => 'auto'}
                    components={{
                      NoRowsOverlay: () => (
                        <Stack height="100%" alignItems="center" justifyContent="center">
                          {ratingsQuery.isLoading || ratingsQuery.isFetching ? '' : 'No Rating found'}
                        </Stack>
                      ),
                    }}
                    sx={{
                      '& .MuiDataGrid-cell': {
                        cursor: 'pointer',
                      },
                    }}
                    onRowClick={({ row }) => {
                      setCurrentRating(row);
                      setCurrentRightTab('edit');
                      setIsRightBarOpen(true);
                    }}
                  />
                  {/* loading */}
                  {ratingsQuery.isLoading || ratingsQuery.isFetching ? <TableLoader /> : null}
                </Box>
              </Paper>
            </Grid>
          </Grid>
          {/* right */}
          {isRightBarOpen && (
            <Grid
              container
              md={4}
              pl={{
                xl: 10,
                lg: 5,
              }}
              sx={{
                borderLeft: `2px solid ${theme.palette.grey[200]}`,
                height: '100%',
                overflowY: 'scroll',
                pb: 4,
              }}
            >
              <Grid xs={12}>
                <Paper>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" pt={9} pb={9}>
                    <Typography variant="h2">{currentRightTab === 'edit' ? 'Edit' : 'Add New'}</Typography>
                    <Box>
                      <CloseButton
                        onClick={() => {
                          setIsRightBarOpen(false);
                        }}
                      />
                    </Box>
                    {console.log(currentRightTab)}
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" pr={1}></Stack>
                  {/* tab bodies */}
                  <Box>
                    {currentRightTab === 'edit' ? (
                      <AddRatings
                        isEdit
                        rating={currentRating}
                        refetchFlags={() => {
                          ratingsQuery.refetch();
                        }}
                        closeHandler={() => {
                          setIsRightBarOpen(false);
                        }}
                      />
                    ) : (
                      <>
                        {/* do not remove span !library bug: does not unmount component */}
                        <span></span>
                        <AddRatings
                          isEdit={false}
                          closeHandler={() => {
                            setIsRightBarOpen(false);
                          }}
                          refetchFlags={() => {
                            ratingsQuery.refetch();
                          }}
                        />
                      </>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </GlobalWrapper>
  );
}
