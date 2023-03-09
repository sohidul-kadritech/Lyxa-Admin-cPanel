/* eslint-disable consistent-return */
// third party
import ReplayIcon from '@mui/icons-material/Replay';
import { Box, Chip, Paper, Stack, Tooltip, Typography, Unstable_Grid2 as Grid, useTheme } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import Axios from '../network/axios';

// project import
import { successMsg } from '../helpers/successMsg';
import * as Api from '../network/Api';
import BreadCrumbs from './Common/BreadCrumb2';
import CloseButton from './Common/CloseButton';
import ConfirmModal from './Common/ConfirmModal';
import TableLoader from './Common/TableLoader';
import FilterButton from './Filter/FilterButton';
import FilterSelect from './Filter/FilterSelect';
import FlagDetails from './FlagDetails';
import GlobalWrapper from './GlobalWrapper';
import StyledTable from './StyledTable';
import ThreeDotsMenu from './ThreeDotsMenu';

// breadcrumb items
const breadcrumbItems = [
  {
    to: '/',
    label: 'Lyxa',
  },
  {
    to: '/butler/list/flagged',
    label: 'Butler Flags',
  },
];
// filter options
const sortByOptions = [
  {
    label: 'Desc',
    value: 'desc',
  },
  {
    label: 'Asc',
    value: 'asc',
  },
];

const flagTypeOptions = [
  {
    label: 'User',
    value: 'user',
  },
  {
    label: 'Rider',
    value: 'delivery',
  },
  {
    label: 'Refused',
    value: 'refused',
  },
  {
    label: 'Auto',
    value: 'auto',
  },
];

const resolveTypeOptions = [
  {
    label: 'True',
    value: 'true',
  },
  {
    label: 'False',
    value: 'false',
  },
];

// get flag types
const getFlagTypes = (flag, model) => {
  const types = [];

  if (flag?.isAutomatic) {
    types.push('Auto');
    return types;
  }

  if (flag?.isRefused) {
    types.push('Refused');
    return types;
  }

  if (flag?.user) {
    types.push('User');
  }

  if (model === 'butler' && flag?.butlerId) {
    types.push('Butler');
  }

  if (model === 'order' && flag?.deliveryId) {
    types.push('Rider');
  }

  return types;
};

// api
const fetchFlags = async (model, flagTypeKey, resolveType, sortBy) => {
  const { data, status } = await Axios.get(Api.GET_ALL_FLAGS, {
    params: {
      model,
      type: flagTypeKey,
      resolved: resolveType,
      sortBy,
    },
  });

  return status ? data : {};
};

export default function FlaggedOrders({ model }) {
  const theme = useTheme();

  // rightbar
  // eslint-disable-next-line no-unused-vars
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);

  // filtering
  const [sortBy, setSortBy] = useState('');
  const [flagTypeKey, setFlagTypeKey] = useState('');
  const [resolveType, setResolveType] = useState('');
  const [filterIsApplied, setFilterIsApplied] = useState('');

  // resolve modal
  const [resolveModal, setResolveModal] = useState(false);
  const [currentFlag, setCurrentFlag] = useState({});

  // flags query
  const flagsQuery = useQuery(['flags', { sortBy, flagTypeKey, resolveType }], () =>
    fetchFlags(model, sortBy, flagTypeKey, resolveType)
  );

  // flags resolve
  const flagResolve = useMutation(
    () =>
      Axios.post(Api.RESOLVE_FLAG, {
        id: currentFlag?._id,
        resolved: true,
      }),
    {
      onError: (error) => {
        console.log(error);
        successMsg(error, 'error');
      },

      onSuccess: (data) => {
        setResolveModal(false);
        if (data?.status) {
          successMsg(data?.message, 'success');
        } else {
          successMsg(data?.message, 'warn');
        }
      },
    }
  );

  const updateFilter = (type, payload) => {
    switch (type) {
      case 'sortBy':
        setSortBy(payload);
        setFilterIsApplied(true);
        break;

      case 'flagType':
        setFlagTypeKey(payload);
        setFilterIsApplied(true);
        break;

      case 'resolvedType':
        setResolveType(payload);
        setFilterIsApplied(true);
        break;

      case 'clearFilter':
        setFilterIsApplied(false);
        setSortBy('');
        setFlagTypeKey('');
        setResolveType('');
        break;

      case 'refresh':
        flagsQuery.refetch();
        break;

      default:
    }
  };

  const threeDotHandler = (menu, flag) => {
    console.log(flag);
    if (menu === 'Details') {
      setCurrentFlag(flag);
      setIsRightBarOpen(true);
    }

    if (menu === 'Resolve') {
      setCurrentFlag(flag);
      setResolveModal(true);
    }
  };

  // columns
  const columns = [
    {
      id: 1,
      headerName: 'Comment',
      field: 'comment',
      flex: 4,
      disableColumnFilter: true,
      sortable: false,
      renderCell: (params) => (
        <Stack width="100%" spacing={2}>
          <Typography variant="body1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
            {params?.value}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 2,
      headerName: 'Created At',
      field: 'createdAt',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      flex: 1,
      minWidth: 200,
      renderCell: ({ value }) => (
        <Stack width="100%" spacing={2} alignItems="center">
          <Typography variant="body1">{new Date(value).toLocaleDateString()}</Typography>
          <Typography variant="body3">{new Date(value).toLocaleTimeString()}</Typography>
        </Stack>
      ),
    },
    {
      id: 3,
      headerName: 'Type',
      field: 'status',
      sortable: false,
      flex: 2,
      minWidth: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {getFlagTypes(row, model).map((item, index) => (
            <Chip
              sx={{
                background: 'rgb(63,63,63)',
                color: '#fff',
                '&:hover': {
                  background: 'rgb(78,78,78)',
                },
              }}
              key={index}
              label={item}
              variant="contained"
            />
          ))}
        </Stack>
      ),
    },
    {
      id: 4,
      headerName: 'Resolved',
      field: 'isResolved',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ value }) => (
        <Chip
          label={value ? 'True' : 'False'}
          sx={value ? { background: '#e1f4d0', color: '#56ca00' } : { background: '#ffcfce', color: '#ff0000' }}
          variant="contained"
        />
      ),
    },
    {
      id: 5,
      headerName: 'Actions',
      field: 'action',
      sortable: false,
      flex: 1,
      minWidth: 100,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => (
        <ThreeDotsMenu
          handleMenuClick={(menu) => {
            threeDotHandler(menu, params.row);
          }}
          menuItems={['Details', 'Resolve']}
        />
      ),
    },
  ];

  return (
    <GlobalWrapper padding>
      <Box className="page-content2" sx={{ height: '100vh' }}>
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
              <BreadCrumbs items={breadcrumbItems} />
              {/* filters */}
              <Stack direction="row" spacing={3} pt={6.5} pb={4.5}>
                {/* sort */}
                <Tooltip title="Sort By">
                  <Box>
                    <FilterSelect
                      items={sortByOptions}
                      value={sortBy}
                      placeholder="Sort by"
                      onChange={(e, v) => {
                        updateFilter('sortBy', v.props.value);
                      }}
                    />
                  </Box>
                </Tooltip>
                {/* flag type options */}
                <Tooltip title="Flag Type">
                  <Box>
                    <FilterSelect
                      items={flagTypeOptions}
                      value={flagTypeKey}
                      placeholder="Flag type"
                      onChange={(e, v) => {
                        updateFilter('flagType', v.props.value);
                      }}
                    />
                  </Box>
                </Tooltip>
                {/* resolve options */}
                <Tooltip title="Resolved">
                  <Box>
                    <FilterSelect
                      items={resolveTypeOptions}
                      value={resolveType}
                      placeholder="Resolved type"
                      onChange={(e, v) => {
                        updateFilter('resolvedType', v.props.value);
                      }}
                    />
                  </Box>
                </Tooltip>
                {/* clear filter */}
                {filterIsApplied && (
                  <Tooltip title="Clear Filter">
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
                          updateFilter('clearFilter');
                        }}
                      />
                    </Box>
                  </Tooltip>
                )}
                {/* refresh */}
                <Tooltip title="Refresh">
                  <Box>
                    <FilterButton
                      className={`${flagsQuery.isLoading || flagsQuery.isFetching ? 'refresh-animate' : ''}`}
                      label="Refresh"
                      endIcon={<ReplayIcon />}
                      onClick={() => {
                        updateFilter('refresh');
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
              <Box sx={{ flexGrow: 1, height: '100%', width: '100%', position: 'relative' }}>
                <StyledTable
                  columns={columns}
                  rows={flagsQuery?.data?.list || []}
                  getRowId={(params) => params?._id}
                  rowHeight={60}
                  components={{
                    NoRowsOverlay: () => (
                      <Stack height="100%" alignItems="center" justifyContent="center">
                        {flagsQuery.isLoading || flagsQuery.isFetching ? '' : 'No Q&A found'}
                      </Stack>
                    ),
                  }}
                />
                {/* loading */}
                {flagsQuery.isLoading || flagsQuery.isFetching ? <TableLoader /> : null}
              </Box>
            </Grid>
          </Grid>
          {/* right */}
          {isRightBarOpen && (
            <Grid
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
              <Paper>
                <Stack direction="row" justifyContent="space-between" alignItems="center" pt={9} pb={2}>
                  <Typography variant="h2">Details</Typography>
                  <Box>
                    <CloseButton
                      onClick={() => {
                        setIsRightBarOpen(false);
                      }}
                    />
                  </Box>
                </Stack>
                <FlagDetails
                  flag={currentFlag}
                  closeSideBar={() => {
                    setIsRightBarOpen(false);
                  }}
                />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
      {/* resolve flag */}
      <ConfirmModal
        isOpen={resolveModal}
        blurClose
        loading={flagResolve.isLoading}
        message="Are you sure to resolve this flag?"
        sx={{ minWidth: 'max(300px, 25vw)' }}
        onCancel={() => {
          setResolveModal(false);
        }}
        onConfirm={() => flagResolve.mutate()}
      />
    </GlobalWrapper>
  );
}
