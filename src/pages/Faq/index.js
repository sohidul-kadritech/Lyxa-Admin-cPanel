/* eslint-disable react/no-unstable-nested-components */
// mui
import { Box, Button, Paper, Stack, Tab, Tabs, Typography, Unstable_Grid2 as Grid, useTheme } from '@mui/material';

// third party
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// project import
import { faqType } from '../../assets/staticData';
import BreadCrumbs from '../../components/Common/BreadCrumb2';
import CloseButton from '../../components/Common/CloseButton';
import ConfirmModal from '../../components/Common/ConfirmModal';
import TableLoader from '../../components/Common/TableLoader';
import FilterSelect from '../../components/Filter/FilterSelect';
import GlobalWrapper from '../../components/GlobalWrapper';
import StyledTable from '../../components/StyledTable';
import TabPanel from '../../components/TabPanel';
import ThreeDotsMenu from '../../components/ThreeDotsMenu';
import { addFaq, deleteFaq, getAllFaq, updateFaq } from '../../store/faq/faqActions';
import AddFaq from './addFaq';

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
    <GlobalWrapper padding>
      <Box className="page-content">
        <Grid container sx={{ height: 'calc(100vh - 130px)', overflowY: 'hidden' }}>
          {/* left */}
          <Grid
            container
            md={isRightBarOpen ? 8 : 12}
            pr={isRightBarOpen ? 10 : 0}
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
                <Stack direction="row" spacing={3} pt={10} pb={3} justifyContent="space-between">
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
                  <StyledTable
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
                  {loading ? <TableLoader /> : null}
                </Box>
              </Paper>
            </Grid>
          </Grid>
          {/* right */}
          <Grid
            container
            md={4}
            pl={10}
            sx={{
              borderLeft: `2px solid ${theme.palette.grey[500]}`,
              height: '100%',
              overflowY: 'scroll',
              pb: 4,
            }}
            className={`${isRightBarOpen ? '' : 'd-none'}`}
          >
            <Grid xs={12}>
              <Paper>
                <Typography variant="h2" pt={9} pb={2}>
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
                    <CloseButton
                      onClick={() => {
                        setIsRightBarOpen(false);
                      }}
                    />
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
