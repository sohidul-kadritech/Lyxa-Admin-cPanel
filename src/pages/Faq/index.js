/* eslint-disable react/no-unstable-nested-components */
// mui
import ReplayIcon from '@mui/icons-material/Replay';
import { Box, Button, Chip, Paper, Stack, Tooltip, Typography, Unstable_Grid2 as Grid, useTheme } from '@mui/material';

// third party
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faqType } from '../../assets/staticData';

// project import
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
import { addFaq, getAllFaq, updateFaq } from '../../store/faq/faqActions';
import AddFaq from './AddFaq';

// const
const supportTypeOptions = [
  {
    value: 'accountSupport',
    label: 'Account Support',
  },
  {
    value: 'orderSupport',
    label: 'Order Support',
  },
  {
    value: 'faq',
    label: 'FAQ',
  },
];

// breadcrumb items
const breadcrumbItems = [
  {
    to: '/',
    label: 'Lyxa',
  },
  {
    to: '/settings/support-reasons',
    label: 'Support Reasons',
  },
];

// type value
const getTypeValue = (type) => {
  switch (type) {
    case 'user':
      return 'User FAQ';

    case 'shop':
      return 'Shop FAQ';

    case 'deliveryBoy':
      return 'Rider FAQ';

    case 'accountSupport':
      return 'Account Support';

    case 'orderSupport':
      return 'Order Support';

    default:
      return '';
  }
};

// select status
const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export default function Faq() {
  const theme = useTheme();

  const dispatch = useDispatch();
  const { faq: faqQueries, loading: faqLoading } = useSelector((store) => store.faqReducer);
  const { chatReasons: chatReasonQueries, loading: chatReasonLoading } = useSelector(
    (store) => store.chatReasonReducer
  );

  const [isRightBarOpen, setIsRightBarOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [query, setQuery] = useState([]);

  const [currentTab, setCurrentTab] = useState(0);
  const [currentFaq, setCurrentFaq] = useState({});
  const [deleteFaq, setDeleteFaq] = useState({});

  // filters
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [childType, setChildType] = useState('');

  // faq validation
  const queryValidation = (item) => {
    switch (false) {
      case Boolean(item?.type):
        successMsg('Q&A type cannot be empty');
        return false;

      case Boolean(item?.ans?.trim()):
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
    dispatch(getAllFaq());
  };

  // get all chatReason
  const callGetAllChatReason = () => {
    dispatch(getAllChatReason());
  };

  // update faq
  const callUpdateFaq = (item) => {
    if (!queryValidation(item)) {
      return;
    }

    if (item.type === 'orderSupport' || item.type === 'accountSupport') {
      dispatch(updateChatReason({ ...item, answer: item.ans }));
      return;
    }

    dispatch(updateFaq(item));
  };

  // add faq
  const callAddFaq = (item) => {
    if (!queryValidation(item)) {
      return;
    }

    if (item.type === 'orderSupport' || item.type === 'accountSupport') {
      dispatch(addChatReason({ ...item, answer: item.ans }));
      return;
    }

    dispatch(addFaq(item));
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

  const filterReasons = () => {
    let data = query;

    if (type !== '') {
      data = data.filter(
        (item) =>
          (type === 'faq' && item.type !== 'accountSupport' && item.type !== 'orderSupport') || item.type === type
      );
    }

    if (childType !== '') {
      data = data.filter((item) => item.type === childType);
    }

    if (status !== '') {
      data = data.filter((item) => item.status === status);
    }

    return data;
  };

  // columns
  const columns = [
    {
      id: 1,
      headerName: 'Q&A',
      field: 'question',
      flex: 4,
      disableColumnFilter: true,
      sortable: false,
      renderCell: (params) => (
        <Stack width="100%" spacing={2}>
          <Typography variant="body1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
            {params?.value}
          </Typography>
          <Typography
            variant="body3"
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', lineHeight: '1.5' }}
          >
            {params?.row?.ans}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: 'Type',
      field: 'type',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body1" className="text-capitalize">
          {getTypeValue(params?.value)}
        </Typography>
      ),
    },
    {
      id: 3,
      headerName: 'Status',
      field: 'status',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
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
      id: 5,
      field: 'action',
      headerName: 'Action',
      headerAlign: 'right',
      align: 'right',
      sortable: false,
      flex: 1,
      minWidth: 100,
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
    if (faqQueries?.length === 0) {
      callGetAllFaq();
    }
    if (chatReasonQueries?.length === 0) {
      callGetAllChatReason();
    }
  }, []);

  useEffect(() => {
    const convertedChatReasons = chatReasonQueries.map((item) => ({ ...item, ans: item.answer }));

    setQuery([...faqQueries, ...convertedChatReasons]);
  }, [faqQueries, chatReasonQueries]);

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
                  <Stack direction="row" spacing={3}>
                    <Tooltip title="Support Type">
                      <Box>
                        <FilterSelect
                          items={supportTypeOptions}
                          placeholder="Type"
                          value={type}
                          onChange={(e) => {
                            setType(e.target.value);
                            setIsFilterApplied(true);

                            if (e.target.value !== 'faq') {
                              setChildType('');
                            }
                          }}
                        />
                      </Box>
                    </Tooltip>
                    {type === 'faq' && (
                      <Tooltip title="Faq Type">
                        <Box>
                          <FilterSelect
                            items={faqType}
                            placeholder="Type"
                            value={childType}
                            onChange={(e) => {
                              setChildType(e.target.value);
                              setIsFilterApplied(true);
                            }}
                          />
                        </Box>
                      </Tooltip>
                    )}
                    <Tooltip title="Status Type">
                      <Box>
                        <FilterSelect
                          items={statusOptions}
                          placeholder="Status"
                          value={status}
                          onChange={(e) => {
                            setStatus(e.target.value);
                            setIsFilterApplied(true);
                          }}
                        />
                      </Box>
                    </Tooltip>
                    <Tooltip className={`${isFilterApplied ? '' : 'd-none'}`} title="Clear Filter">
                      <Box>
                        <FilterButton
                          label="Clear"
                          sx={{
                            background: 'rgb(63,63,63)',
                            color: '#fff',
                            '&:hover': {
                              background: 'rgb(78,78,78)',
                            },
                          }}
                          onClick={() => {
                            setType('');
                            setChildType('');
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
                          className={`${faqLoading || chatReasonLoading ? 'refresh-animate' : ''}`}
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
                    rows={filterReasons()}
                    getRowId={(params) => params?._id}
                    rowHeight={60}
                    components={{
                      NoRowsOverlay: () => (
                        <Stack height="100%" alignItems="center" justifyContent="center">
                          {faqLoading || chatReasonLoading ? '' : 'No Q&A found'}
                        </Stack>
                      ),
                    }}
                  />
                  {/* loading */}
                  {faqLoading || chatReasonLoading ? <TableLoader /> : null}
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
                <Stack direction="row" justifyContent="space-between" alignItems="center" pt={9} pb={2}>
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
                      <Tab label="Edit FAQ" className={`${currentFaq?._id ? '' : 'd-none'}`} />
                      <Tab label="Add New" />
                    </Tabs> */}
                  </Box>
                </Stack>
                {/* tab bodies */}
                <Box>
                  <TabPanel index={0} value={currentTab}>
                    <AddFaq
                      isEdit
                      faq={currentFaq}
                      submitHandler={callUpdateFaq}
                      closeHandler={() => {
                        setIsRightBarOpen(false);
                      }}
                    />
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
