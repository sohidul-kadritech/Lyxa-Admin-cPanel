/* eslint-disable react/no-unstable-nested-components */
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
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// project import
import { chatReasonType } from '../../assets/staticData';
import BreadCrumbs from '../../components/Common/BreadCrumb2';
import CloseButton from '../../components/Common/CloseButton';
import ConfirmModal from '../../components/Common/ConfirmModal';
import TableLoader from '../../components/Common/TableLoader';
import FilterButton from '../../components/Filter/FilterButton';
import FilterSelect from '../../components/Filter/FilterSelect';
import GlobalWrapper from '../../components/GlobalWrapper';
import StyledTable from '../../components/StyledTable';
import TabPanel from '../../components/TabPanel';
import ThreeDotsMenu from '../../components/ThreeDotsMenu';
import { successMsg } from '../../helpers/successMsg';
import {
  addChatReason,
  deleteChatReason,
  getAllChatReason,
  updateChatReason,
} from '../../store/ChatReason/chatReasonActions';
import AddFaq from './AddReason';

// breadcrumb items
const breadcrumbItems = [
  {
    to: '/',
    label: 'Lyxa',
  },
  {
    to: '/support-reasons',
    label: 'Support Reasons',
  },
];

const statusTypes = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export default function ChatReasons() {
  const theme = useTheme();

  const dispatch = useDispatch();
  const { chatReasons, loading } = useSelector((store) => store.chatReasonReducer);

  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [currentTab, setCurrentTab] = useState(0);
  const [currentChatReason, setCurrentChatReason] = useState({});
  const [deleteFaqId, setDeleteFaqId] = useState('');

  // filters
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  // faq validation
  const faqValidation = (item) => {
    switch (false) {
      case Boolean(item?.type):
        successMsg('Q&A type cannot be empty');
        return false;

      case Boolean(item?.answer?.trim()):
        successMsg('Q&A answer cannot be empty');
        return false;

      case Boolean(item?.question?.trim()):
        successMsg('Q&A question cannot be empty');
        return false;

      default:
        return true;
    }
  };

  // get all faqs
  const callGetAllFaq = () => {
    dispatch(getAllChatReason());
  };

  // update faq
  const callUpdateFaq = (item) => {
    if (faqValidation(item)) {
      dispatch(updateChatReason(item));
    }
  };

  // add faq
  const callAddFaq = (item) => {
    if (faqValidation(item)) {
      dispatch(addChatReason(item));
    }
  };

  // delete faq
  const callDeleteFaq = () => {
    dispatch(deleteChatReason(deleteFaqId));
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
      setCurrentChatReason(item);
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
        <Stack width="100%" spacing={2}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{params?.value}</span>
          <Typography variant="body3" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
            {params?.row?.answer}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: 'Type',
      field: 'type',
      sortable: false,
      minWidth: 200,
      renderCell: ({ value }) => <span>{value === 'accountSupport' ? 'Account Support' : 'Order Support'}</span>,
    },
    {
      id: 3,
      headerName: 'Status',
      field: 'status',
      sortable: false,
      minWidth: 200,
      renderCell: ({ value }) => (
        <Chip
          label={value === 'active' ? 'Active' : 'Inactive'}
          sx={
            value === 'active'
              ? { background: '#e1f4d0', color: '#56ca00' }
              : { background: '#ffcfce', color: '#ff0000' }
          }
          variant="contained"
        />
      ),
    },
    {
      id: 4,
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
      id: 5,
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
    if (chatReasons?.length === 0) {
      callGetAllFaq();
    }
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
                <Stack direction="row" pt={10} pb={3} justifyContent="space-between">
                  <Stack direction="row" spacing={3}>
                    <Tooltip title="Select Type">
                      <Box>
                        <FilterSelect
                          items={chatReasonType}
                          placeholder="Type"
                          value={type}
                          onChange={(e) => {
                            setType(e.target.value);
                            setIsFilterApplied(true);
                          }}
                        />
                      </Box>
                    </Tooltip>
                    <Tooltip title="Select Status">
                      <Box>
                        <FilterSelect
                          items={statusTypes}
                          placeholder="Status"
                          value={status}
                          onChange={(e) => {
                            setStatus(e.target.value);
                            setIsFilterApplied(true);
                          }}
                        />
                      </Box>
                    </Tooltip>
                    <Tooltip title="Clear Filter">
                      <Box>
                        <FilterButton
                          className={`${isFilterApplied ? '' : 'd-none'}`}
                          label="Clear"
                          sx={{
                            background: `${isFilterApplied ? theme.palette.grey[400] : theme.palette.grey[200]}`,
                          }}
                          onClick={() => {
                            setType('');
                            setStatus('');
                            setIsFilterApplied(false);
                          }}
                        />
                      </Box>
                    </Tooltip>
                    <Tooltip title="Refresh">
                      <Box>
                        <FilterButton
                          label="Refresh"
                          className={`${loading === true ? 'refresh-animate' : ''}`}
                          endIcon={<ReplayIcon />}
                          onClick={() => {
                            callGetAllFaq();
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
                  </Stack>
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
                    rows={chatReasons
                      .filter((item) => item.type === type || type === '')
                      .filter((item) => item.status === status || status === '')}
                    getRowId={(params) => params?._id}
                    rowHeight={60}
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
              borderLeft: `2px solid ${theme.palette.grey[200]}`,
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
                      <Tab label="Edit FAQ" className={`${currentChatReason?._id ? '' : 'd-none'}`} />
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
                    <AddFaq
                      isEdit
                      chatReason={currentChatReason}
                      submitHandler={callUpdateFaq}
                      closeHandler={() => {
                        setIsRightBarOpen(false);
                      }}
                    />
                  </TabPanel>
                  <TabPanel index={1} value={currentTab}>
                    <AddFaq
                      submitHandler={callAddFaq}
                      closeHandler={() => {
                        setIsRightBarOpen(false);
                      }}
                    />
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
