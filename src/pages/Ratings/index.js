/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
// mui
import ReplayIcon from '@mui/icons-material/Replay';
import { Box, Button, Chip, Paper, Stack, Tooltip, Typography, Unstable_Grid2 as Grid, useTheme } from '@mui/material';
// third party
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// project import
import BreadCrumbs from '../../components/Common/BreadCrumb2';
import CloseButton from '../../components/Common/CloseButton';
import ConfirmModal from '../../components/Common/ConfirmModal';
import TableLoader from '../../components/Common/TableLoader';
import FilterButton from '../../components/Filter/FilterButton';
import GlobalWrapper from '../../components/GlobalWrapper';
import StyledTable from '../../components/StyledTable';
import ThreeDotsMenu from '../../components/ThreeDotsMenu';
import { deleteChatReason } from '../../store/ChatReason/chatReasonActions';
import { addNewRating, getAllRatings, updateRatings } from '../../store/ratings/ratingActions';
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
  const dispatch = useDispatch();

  const { ratings, loading } = useSelector((store) => store.ratingReducer);

  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // const [query, setQuery] = useState([]);

  const [currentTab, setCurrentTab] = useState(0);
  const [currentFaq, setCurrentFaq] = useState({});
  const [deleteFaq, setDeleteFaq] = useState({});

  // get all ratings
  const callGetAllRating = () => {
    dispatch(getAllRatings());
  };

  // add faq
  const callAddRating = (tags) => {
    dispatch(addNewRating(tags));
  };

  // update faq
  const callUpdateFaq = (item) => {
    console.log(item);
    dispatch(updateRatings(item));
  };

  // delete faq
  const callDeleteFaq = () => {
    if (deleteFaq.type === 'orderSupport' || deleteFaq.type === 'accountSupport') {
      dispatch(deleteChatReason(deleteFaq?._id));
      return;
    }

    dispatch(deleteFaq(deleteFaq?._id));
  };

  // dynamic titile
  const rightBarTitle = (curTab) => {
    if (curTab === 0) {
      return 'Edit';
    }
    return 'Add New';
  };

  // three dot handler
  const threeDotHandler = (menu, item) => {
    if (menu === 'Edit') {
      setIsRightBarOpen(true);
      setCurrentTab(0);
      setCurrentFaq(item);
    }

    if (menu === 'Delete') {
      setIsConfirmModalOpen(true);
      setDeleteFaq(item);
    }
  };

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
    {
      id: 4,
      field: 'action',
      headerName: 'Action',
      headerAlign: 'right',
      align: 'right',
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <ThreeDotsMenu
          menuItems={['Edit']}
          handleMenuClick={(menu) => {
            threeDotHandler(menu, params?.row);
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    if (ratings?.length === 0) {
      callGetAllRating();
    }
  }, []);

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
                <Stack direction="row" pt={10} pb={3} justifyContent="space-between">
                  <Tooltip title="Refresh">
                    <Box>
                      <FilterButton
                        label="Refresh"
                        className={`${loading ? 'refresh-animate' : ''}`}
                        endIcon={<ReplayIcon />}
                        onClick={() => {
                          callGetAllRating();
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
                      setCurrentTab(1);
                    }}
                  >
                    Add New
                  </Button>
                </Stack>
                <Box sx={{ flexGrow: 1, height: '100%', width: '100%', position: 'relative' }}>
                  <StyledTable
                    columns={columns}
                    rows={ratings.map((items) => items).sort((a, b) => a?.rating - b?.rating)}
                    getRowId={(params) => params?._id}
                    rowHeight={60}
                    getRowHeight={() => 'auto'}
                    components={{
                      NoRowsOverlay: () => (
                        <Stack height="100%" alignItems="center" justifyContent="center">
                          {loading ? '' : 'No Rating found'}
                        </Stack>
                      ),
                    }}
                  />
                  {/* loading */}
                  {loading ? <TableLoader /> : null}
                </Box>
              </Paper>
            </Grid>
          </Grid>
          {/* right */}
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
            className={`${isRightBarOpen ? '' : 'd-none'}`}
          >
            <Grid xs={12}>
              <Paper>
                <Stack direction="row" justifyContent="space-between" alignItems="center" pt={9} pb={10}>
                  <Typography variant="h2">{rightBarTitle(currentTab)}</Typography>
                  <Box>
                    <CloseButton
                      onClick={() => {
                        setIsRightBarOpen(false);
                      }}
                    />
                  </Box>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" pr={1}>
                  <Box>
                    {/* tab headers */}
                    {/* <Tabs
                      value={currentTab}
                      onChange={(event, value) => {
                        setCurrentTab(value);
                      }}
                    >
                      <Tab label="Edit" className={`${currentFaq?._id ? '' : 'd-none'}`} />
                      <Tab label="Add New" />
                    </Tabs> */}
                  </Box>
                </Stack>
                {/* tab bodies */}
                <Box>
                  {currentTab === 0 && (
                    <AddRatings
                      isEdit
                      rating={currentFaq}
                      submitHandler={callUpdateFaq}
                      closeHandler={() => {
                        setIsRightBarOpen(false);
                      }}
                    />
                  )}
                  {currentTab === 1 && <AddRatings submitHandler={callAddRating} closeHandler={() => {}} />}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        {/* modal */}
        <ConfirmModal
          message="Do you want to delete this Q&A ?"
          isOpen={isConfirmModalOpen}
          blurClose
          onCancel={() => {
            setIsConfirmModalOpen(false);
          }}
          onConfirm={() => {
            callDeleteFaq();
            setIsConfirmModalOpen(false);
          }}
        />
      </Box>
    </GlobalWrapper>
  );
}
