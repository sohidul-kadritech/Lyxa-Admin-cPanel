/* eslint-disable no-unused-vars */
// third party
import ReplayIcon from '@mui/icons-material/Replay';
import { Box, Paper, Stack, Tab, Tabs, Tooltip, Typography, Unstable_Grid2 as Grid, useTheme } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';

// project import
import AppPagination from '../../components/Common/AppPagination2';
import BreadCrumbs from '../../components/Common/BreadCrumb2';
import CloseButton from '../../components/Common/CloseButton';
import FilterButton from '../../components/Filter/FilterButton';
import FilterSelect from '../../components/Filter/FilterSelect';
import FlagDetails from '../../components/FlagDetails';
import FlaggedOrdersTable from '../../components/FlaggedOrdersTable';
import GlobalWrapper from '../../components/GlobalWrapper';
import minInMiliSec from '../../helpers/minInMiliSec';
import * as Api from '../../network/Api';
import Axios from '../../network/axios';

// breadcrumb items
const breadcrumbItems = [
  {
    to: '/',
    label: 'Lyxa',
  },
  {
    to: '/orders/list/flagged',
    label: 'Flags Orders',
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
    label: 'Shop',
    value: 'shop',
  },
  {
    label: 'Refused',
    value: 'refused',
  },
  {
    label: 'Auto Cancel',
    value: 'auto',
  },
  {
    label: 'Delay',
    value: 'delay',
  },
];

// api
const fetchFlags = async (sortBy, flagTypeKey, resolveType, currentPage) => {
  const { data, status } = await Axios.get(Api.GET_ALL_FLAGS, {
    params: {
      model: '',
      type: flagTypeKey,
      resolved: resolveType,
      sortBy,
      page: currentPage,
      pageSize: 25,
    },
  });

  return status ? data : {};
};

const createdModifiedFlagList = (flagList) => {
  if (flagList?.length > 0) {
    return flagList.map((item) => {
      if (item?.orderId) {
        item.orderType = 'regular';
        return item;
      }

      item.orderType = 'butler';
      item.orderId = item?.butlerId;
      return item;
    });
  }

  return [];
};

export default function FlaggedOrders() {
  const theme = useTheme();

  // rightbar
  const [isRightBarOpen, setIsRightBarOpen] = useState(false);

  // filtering
  const [sortBy, setSortBy] = useState('desc');
  const [flagTypeKey, setFlagTypeKey] = useState('');
  const [resolveType, setResolveType] = useState('false');
  const [filterIsApplied, setFilterIsApplied] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  // tabs
  const [currentTab, setCurrentTab] = useState(0);

  // resolve modal
  const [currentFlag, setCurrentFlag] = useState({});

  const flagsQuery = useQuery(
    ['flagged_orders', { sortBy, flagTypeKey, resolveType, currentPage }],
    () => fetchFlags(sortBy, flagTypeKey, resolveType, currentPage),
    {
      staleTime: minInMiliSec(3),
      onSuccess: (data) => {
        setTotalPage(data?.paginate?.metadata?.page?.totalPage);
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
        break;

      case 'page':
        setCurrentPage(payload);
        break;

      case 'refresh':
        flagsQuery.refetch();
        break;

      default:
    }
  };

  return (
    <GlobalWrapper padding>
      <Box className="page-content2" sx={{ height: '100vh' }}>
        <Grid container sx={{ height: 'calc(100vh - 130px)', overflowY: 'hidden' }}>
          <Grid container sx={{ height: '100%', overflowY: 'scroll' }} xs={12}>
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
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
                  <Tabs
                    value={currentTab}
                    onChange={(event, value) => {
                      setCurrentTab(value);
                      setResolveType(value === 0 ? 'false' : 'true');
                    }}
                  >
                    <Tab label="Unresolved" />
                    <Tab label="Resolved" />
                  </Tabs>
                </Box>
                <Box>
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
                  <Box sx={{ flexGrow: 1, minHeight: 'calc(100vh - 422px)', width: '100%', position: 'relative' }}>
                    <FlaggedOrdersTable
                      flagsList={createdModifiedFlagList(flagsQuery?.data?.list)}
                      flagsLoading={flagsQuery.isLoading || flagsQuery.isFetching}
                      onRowClick={({ row }) => {
                        setCurrentFlag(row);
                        setIsRightBarOpen(true);
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    pt: 7.5,
                    pb: 7.5,
                  }}
                >
                  <AppPagination
                    currentPage={currentPage}
                    lisener={(page) => {
                      updateFilter('page', page);
                    }}
                    totalPage={totalPage}
                  />
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
        </Grid>
      </Box>
    </GlobalWrapper>
  );
}
