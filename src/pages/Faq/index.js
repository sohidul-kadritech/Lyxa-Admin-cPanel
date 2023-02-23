/* eslint-disable react/no-unstable-nested-components */
// mui
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  Unstable_Grid2 as Grid,
  useTheme,
} from '@mui/material';

// third party
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// project import
import { faqType } from '../../assets/staticData';
import BreadCrumbs from '../../components/BreadCrumb2';
import CircularLoader from '../../components/CircularLoader';
import FilterSelect from '../../components/filterSelect';
import GlobalWrapper from '../../components/GlobalWrapper';
import StyledGrid from '../../components/StyledGrid';
import TabPanel from '../../components/TabPanel';
import ThreeDotsMenu from '../../components/ThreeDotsMenu';
import { addFaq, deleteFaq, getAllFaq, updateFaq } from '../../store/faq/faqActions';
import AddFaq from './addFaq';

export default function Faq() {
  const theme = useTheme();

  const dispatch = useDispatch();
  const { faq: faqData, loading } = useSelector((store) => store.faqReducer);

  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [faq, setFaq] = useState([]);

  const [currentTab, setCurrentTab] = useState(0);
  const [currentFaq, setCurrentFaq] = useState({});
  const [deleteFaqId, setDeleteFaqId] = useState('');

  // filters
  const [type, setType] = useState('');

  const filterType = (e) => {
    setType(e.target.value);
    const filteredFaqs = faqData.filter((item) => item?.type === e.target.value);
    setFaq(filteredFaqs);
  };

  // breadcrumb items
  const breadcrumbItems = [
    {
      to: '/',
      label: 'Lyxa',
    },
    {
      to: '/faq',
      label: 'FAQ',
    },
  ];

  // get all faqs
  const callGetAllFaq = () => {
    dispatch(getAllFaq());
  };

  // update faq
  const callUpdateFaq = (item) => {
    dispatch(updateFaq(item));
  };

  // add faq
  const callAddFaq = (item) => {
    dispatch(addFaq(item));
  };

  // delete faq
  const callDeleteFaq = () => {
    dispatch(deleteFaq(deleteFaqId));
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
      setDeleteFaqId(item?._id);
    }
  };

  // columns
  const columns = [
    {
      id: 1,
      headerName: 'Q&A',
      field: 'question',
      flex: 1,
      disableColumnFilter: true,
      sortable: false,
      renderCell: (params) => (
        <Stack spacing={1}>
          <span>{params?.value}</span>
          <span>{params?.row?.ans}</span>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: 'Type',
      field: 'type',
      sortable: false,
      minWidth: 200,
      renderCell: (params) => <span className="text-capitalize">{params?.value}</span>,
    },
    {
      id: 3,
      field: 'createdAt',
      headerName: 'Created',
      minWidth: 200,
      sortable: false,
      valueFormatter: (params) => {
        if (!params?.value) {
          return '';
        }
        return new Date(params?.value).toLocaleDateString();
      },
    },
    {
      id: 4,
      field: 'action',
      headerName: 'Action',
      minWidth: 200,
      headerAlign: 'right',
      align: 'right',
      sortable: false,
      renderCell: (params) => (
        <ThreeDotsMenu
          menuItems={['Edit', 'Delete']}
          handleMenuClick={(menu) => {
            threeDotHandler(menu, params?.row);
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    if (faqData?.length > 0) {
      setFaq(faqData);
    }
  }, [faqData]);

  useEffect(() => {
    callGetAllFaq();
  }, []);

  return (
    <GlobalWrapper>
      <Box className="page-content">
        <Grid container sx={{ height: 'calc(100vh - 140px)' }}>
          {/* left */}
          <Grid md={isRightBarOpen ? 8 : 12} pr={isRightBarOpen ? 3 : 0} container>
            <Grid md={12}>
              <BreadCrumbs
                items={breadcrumbItems}
                sx={{
                  pb: 0,
                }}
              />
              <Paper
                sx={{
                  paddingLeft: '12px',
                  paddingRight: '12px',
                }}
              >
                <Stack direction="row" spacing={3} pt={8} pb={4} justifyContent="space-between">
                  <FilterSelect items={faqType} placeholder="Type" value={type} onChange={filterType} />
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
                  <StyledGrid
                    columns={columns}
                    rows={faq}
                    getRowId={(params) => params?._id}
                    components={{
                      NoRowsOverlay: () => (
                        <Stack height="100%" alignItems="center" justifyContent="center">
                          {loading ? '' : 'No Q&A found'}
                        </Stack>
                      ),
                    }}
                  />
                  {/* loading */}
                  {loading ? (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        background: 'rgba(255, 255, 255, 0.7)',
                        left: '0',
                        top: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9,
                      }}
                    >
                      <CircularLoader />
                    </Box>
                  ) : null}
                </Box>
              </Paper>
            </Grid>
          </Grid>
          {/* right */}
          <Grid
            container
            md={4}
            className={`${isRightBarOpen ? '' : 'd-none'}`}
            pl={3}
            sx={{
              borderLeft: `1px solid ${theme.palette.grey[500]}`,
            }}
          >
            <Grid xs={12}>
              <Paper>
                <Typography variant="h1" pt={5} pb={2}>
                  {rightBarTitle(currentTab)}
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" pr={1}>
                  <Box>
                    {/* tab headers */}
                    <Tabs
                      value={currentTab}
                      onChange={(event, value) => {
                        setCurrentTab(value);
                      }}
                    >
                      <Tab label="Edit FAQ" className={`${currentFaq?._id ? '' : 'd-none'}`} />
                      <Tab label="Add New" />
                    </Tabs>
                  </Box>
                  <Box>
                    <IconButton
                      color="primary"
                      sx={{
                        color: '#000',
                      }}
                      onClick={() => {
                        setIsRightBarOpen(false);
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Stack>
                {/* tab bodies */}
                <Box>
                  <TabPanel index={0} value={currentTab}>
                    <AddFaq isEdit faq={currentFaq} submitHandler={callUpdateFaq} />
                  </TabPanel>
                  <TabPanel index={1} value={currentTab}>
                    <AddFaq submitHandler={callAddFaq} />
                  </TabPanel>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        {/* modal */}
        <Modal
          open={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
          }}
          sx={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Paper>
            <Box padding={2}>
              <Stack direction="row" spacing={2} mt={3}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    callDeleteFaq();
                    setIsConfirmModalOpen(false);
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Modal>
      </Box>
    </GlobalWrapper>
  );
}
