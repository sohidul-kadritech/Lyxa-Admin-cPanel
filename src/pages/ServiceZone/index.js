import { Add, Close, Edit } from '@mui/icons-material';
import { Box, Button, Fade, Grid, Modal, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PageTop from '../../components/Common/PageTop';
// eslint-disable-next-line no-unused-vars
import StyledFormField from '../../components/Form/StyledFormField';

import AppPagination from '../../components/Common/AppPagination2';
import ConfirmModal from '../../components/Common/ConfirmModal';
import TabPanel from '../../components/Common/TabPanel';
import FilterSelect from '../../components/Filter/FilterSelect';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import StyledTable from '../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import AddZoneStatus from './AddZoneStatus';
import CreateZone from './CreateZone';
import EditZone from './EditZone';
import MapOverview from './MapOverview';
import ServiceZonePageSkeleton from './ServiceZonePageSkeleton';
import SidebarZone from './SidebarZone';
import useGeoLocation from './useGeoLocation';

const dateFormation = (date) => moment(date).format('MMMM D, YYYY');

// eslint-disable-next-line no-unused-vars
const fieldContainerSx = {
  padding: '0px 0px',
};

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '/settings',
  },
  {
    label: 'Zone',
    to: '#',
  },
];

// eslint-disable-next-line no-unused-vars
const statusOptions = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
];

const listFilterOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
  {
    label: 'Busy',
    value: 'busy',
  },
];
function AddMenuButton({ ...props }) {
  return (
    <Button variant="contained" color="primary" size="small" startIcon={<Add />} {...props}>
      Add
    </Button>
  );
}

function ServiceZone() {
  const theme = useTheme();

  const currentLocation = useGeoLocation();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [zoneId, setZoneId] = useState('');
  const [open, setOpen] = useState(false);

  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const [actionType, setActionType] = useState('add');

  const [rowData, setRowData] = useState({});
  const [currentTab, setCurrentTab] = useState(0);

  const [slectedZoneStatus, setSelectedZoneStatus] = useState('all');

  const [searchedValue, setSearchedValue] = useState('');

  const [pageNo, setPageNo] = useState(1);

  // eslint-disable-next-line no-unused-vars
  const [selectedPageSize, setSelectedPageSize] = useState(5);

  // eslint-disable-next-line no-unused-vars
  const [selectedsortBy, setSelectedSortBy] = useState('desc');

  const [currentRowData, setCurrentRowData] = useState({});

  const { currentUser } = useGlobalContext();

  const queryClient = useQueryClient();

  const apiurl = currentUser?.userType === 'admin' ? API_URL.GET_ALL_ZONE : '';

  // getAllZones
  const getAllZones = useQuery(
    [apiurl, { slectedStatus: slectedZoneStatus, searchedValue, pageNo, selectedPageSize, selectedsortBy }],
    () =>
      AXIOS.get(apiurl, {
        params: {
          zoneStatus: slectedZoneStatus !== 'all' ? slectedZoneStatus : '',
          searchKey: searchedValue,
          page: pageNo,
          pageSize: selectedPageSize,
          sortBy: selectedsortBy,
        },
        // eslint-disable-next-line prettier/prettier
      }),
  );
  // add new zones
  const addNewZone = useMutation((data) => AXIOS.post(API_URL.CREATE_ZONE, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg('Succesfully Added New Zone', 'success');
        setOpen(false);
        queryClient.invalidateQueries(apiurl);
      }
    },
  });

  // delete a zones
  // eslint-disable-next-line no-unused-vars
  const deleteAZoneQuery = useMutation((data) => AXIOS.post(API_URL.DELETE_ZONE, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg('Succesfully deleted', 'success');
        queryClient.invalidateQueries(apiurl);
        setIsConfirmModalOpen(false);
      }
    },
  });

  const updateAZoneQuery = useMutation((data) => AXIOS.post(API_URL.UPDATE_ZONE, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg(data.message, 'success');
        queryClient.invalidateQueries(apiurl);
        setOpen(false);
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  // eslint-disable-next-line no-unused-vars
  const deletedAzoneById = (id) => {
    deleteAZoneQuery.mutate({ zoneId: id });
  };

  console.log(getAllZones?.data?.data?.zones);

  // eslint-disable-next-line no-unused-vars
  const onStatusChange = (value, data) => {
    // data.zoneStatus = value;

    if (value !== 'busy') {
      data.zoneStatus = value;
      updateAZoneQuery.mutate({
        zoneId: data?._id,
        zoneStatus: value,
        zoneAvailability: 'online',
        zoneBusyTitle: '',
        zoneBusyDescription: '',
      });
    } else {
      setActionType('updateZoneStatus');
      setRowData(data);
      setOpen(true);
    }

    // setRender((prev) => !prev);
    // tagsMutation.mutate(item);
  };

  const columns = [
    {
      id: 0,
      headerName: 'Zone Name',
      field: 'zoneName',
      sortable: false,
      density: 'comfortable',
      flex: 1,
      renderCell: ({ value }) => (
        <Box sx={{ flex: '3' }}>
          <Typography>{value}</Typography>
        </Box>
      ),
    },
    {
      id: 1,
      headerName: 'Area',
      field: 'zoneArea',
      sortable: false,
      flex: 3,

      renderCell: ({ value }) => (
        <Box
          sx={{
            padding: '0px 8px',
            width: '80%',
          }}
        >
          <Typography sx={{ whiteSpace: 'no-wrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {value || 'no area added'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 2,
      headerName: 'STATUS',
      field: 'status',
      sortable: false,
      flex: 1.5,

      renderCell: (params) => (
        <FilterSelect
          items={listFilterOptions}
          sx={{
            background:
              params?.row?.zoneStatus === 'active' && params?.row?.zoneAvailability !== 'busy'
                ? '#DCFCE7'
                : params?.row?.zoneStatus === 'inactive' && params?.row?.zoneAvailability !== 'busy'
                ? '#FEE2E2'
                : '#FFB01733',
            '&:hover': {
              background:
                params?.row?.zoneStatus === 'active' && params?.row?.zoneAvailability !== 'busy'
                  ? '#DCFCE7'
                  : params?.row?.zoneStatus === 'inactive' && params?.row?.zoneAvailability !== 'busy'
                  ? '#FEE2E2'
                  : '#FFB01733',
            },
            '& .MuiInputBase-input': {
              color:
                params?.row?.zoneStatus === 'active' && params?.row?.zoneAvailability !== 'busy'
                  ? '#417C45'
                  : params?.row?.zoneStatus === 'inactive' && params?.row?.zoneAvailability !== 'busy'
                  ? '#DD5B63'
                  : '#FFAB09',
            },
            '& .MuiSelect-icon': {
              color:
                params?.row?.zoneStatus === 'active' && params?.row?.zoneAvailability !== 'busy'
                  ? '#417C45'
                  : params?.row?.zoneStatus === 'inactive' && params?.row?.zoneAvailability !== 'busy'
                  ? '#DD5B63'
                  : '#FFAB09',
            },
          }}
          size="lg1"
          value={params?.row?.zoneAvailability === 'busy' ? params?.row?.zoneAvailability : params?.row?.zoneStatus}
          // readOnly={params?.row?.zoneAvailability === 'busy'}
          onChange={(e) => {
            onStatusChange(e.target.value, params.row);
          }}
        />
      ),
    },
    {
      id: 1,
      headerName: 'Date Created',
      field: 'createdAt',
      sortable: false,
      flex: 1.5,

      renderCell: ({ value }) => <Typography>{dateFormation(value)}</Typography>,
    },
    {
      id: 2,
      sortable: false,
      flex: 2,
      align: 'right',

      renderCell: (value) => (
        <Stack flexDirection="row" gap="16px">
          {/* <StyledSwitch
            checked={value?.row?.zoneAvailability === 'online'}
            disabled={value?.row?.zoneStatus !== 'active'}
            onChange={() => {
              console.log('value; ', value?.row?.zoneAvailability);
              setActionType('updateZoneStatus');
              if (value?.row.zoneAvailability !== 'busy') {
                setRowData(value?.row);
                setOpen(true);
              } else {
                updateAZoneQuery.mutate({
                  zoneId: value?.row?._id,
                  zoneAvailability: 'online',
                  zoneBusyTitle: '',
                  zoneBusyDescription: '',
                });
              }
            }}
          /> */}
          <Button
            sx={{
              minWidth: '32px',
              padding: '9px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              background: theme?.palette?.background?.secondary,
            }}
            onClick={() => {
              console.log(value?.row);
              setRowData(value?.row);
              setOpen(() => {
                setActionType('edit');
                return true;
              });
            }}
          >
            <Edit sx={{ fontSize: '14px' }} />
          </Button>

          <Button
            onClick={() => {
              setZoneId(value?.row?._id);
              setIsConfirmModalOpen(true);
            }}
            sx={{
              minWidth: '32px',
              padding: '9px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              background: theme?.palette?.background?.secondary,
            }}
          >
            <Close sx={{ fontSize: '14px' }} />
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ backgroundColor: '#FBFBFB' }}>
      <Grid container spacing={2}>
        <Grid item xs={currentTab === 1 && isSideBarOpen ? 8 : 12} md={currentTab === 1 && isSideBarOpen ? 8 : 12}>
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
                setIsSideBarOpen(false);
              }}
              sx={{
                '& .MuiTab-root': {
                  padding: '8px 12px',
                  textTransform: 'none',
                },
              }}
            >
              <Tab label="Zone List" />
              <Tab label="Map Overview" />
            </Tabs>
          </Box>
          <TabPanel index={0} value={currentTab}>
            <Stack direction="row" justifyContent="start" gap="17px">
              <StyledSearchBar
                sx={{ flex: '1' }}
                placeholder="Search"
                onChange={(e) => setSearchedValue(e.target.value)}
              />
              <StyledFormField
                intputType="select"
                containerProps={{
                  sx: fieldContainerSx,
                }}
                inputProps={{
                  name: 'zoneStatus',
                  value: slectedZoneStatus,
                  items: statusOptions,
                  size: 'sm2',

                  onChange: (e) => setSelectedZoneStatus(e.target.value),
                }}
              />
              {/* Add new zone */}
              <AddMenuButton
                onClick={() => {
                  setOpen(() => {
                    setActionType('add');
                    return true;
                  });
                }}
              />
            </Stack>

            <Box
              sx={{
                pr: 5,
                pl: 3.5,
                pt: 1,
                pb: 1,
                border: '1px solid #EEEEEE',
                borderRadius: '7px',
                background: '#fff',
                margin: '30px 0px',
                // height: 550,
                // width: '100%',
              }}
            >
              {!getAllZones?.isLoading ? (
                <StyledTable
                  columns={columns}
                  rows={getAllZones?.data?.data?.zones || []}
                  getRowId={(row) => row?._id}
                  components={{
                    NoRowsOverlay: () => (
                      <Stack height="100%" alignItems="center" justifyContent="center">
                        No zone found
                      </Stack>
                    ),
                  }}
                />
              ) : (
                <Box>
                  <ServiceZonePageSkeleton />
                </Box>
              )}
            </Box>
            <AppPagination
              currentPage={pageNo}
              lisener={(newPage) => {
                setPageNo(newPage);
              }}
              totalPage={2}
            />
            <Modal open={open} centered>
              {actionType === 'add' ? (
                <CreateZone
                  allZones={getAllZones?.data?.data?.zones || []}
                  currentLocation={currentLocation}
                  addNewZone={addNewZone}
                  onClose={() => {
                    console.log('add');
                    setOpen(!open);
                  }}
                />
              ) : actionType === 'edit' ? (
                <EditZone
                  allZones={getAllZones?.data?.data?.zones || []}
                  currentLocation={{
                    loaded: true,
                    isCurrent: null,
                    coordinates: {
                      lat: rowData?.zoneGeometry?.coordinates[0][0][1],
                      lon: rowData?.zoneGeometry?.coordinates[0][0][0],
                    },
                  }}
                  rowData={rowData || { zoneName: 'no name' }}
                  editZone={updateAZoneQuery}
                  onClose={() => {
                    console.log('edit');
                    setOpen(!open);
                  }}
                />
              ) : (
                <AddZoneStatus
                  allZones={getAllZones?.data?.data?.zones || []}
                  currentLocation={{
                    loaded: true,
                    isCurrent: null,
                    coordinates: {
                      lat: rowData?.zoneGeometry?.coordinates[0][0][1],
                      lon: rowData?.zoneGeometry?.coordinates[0][0][0],
                    },
                  }}
                  updateAZoneQuery={updateAZoneQuery}
                  rowData={rowData || { zoneName: 'no name' }}
                  onClose={() => {
                    console.log('update status');
                    setOpen(false);
                  }}
                />
              )}
            </Modal>
          </TabPanel>
          <TabPanel index={1} value={currentTab}>
            <Box>
              <MapOverview
                setCurrentRowData={setCurrentRowData}
                getAllZone={getAllZones?.data?.data?.zones || []}
                setIsSideBarOpen={setIsSideBarOpen}
              />
            </Box>
          </TabPanel>
        </Grid>
        {currentTab === 1 && isSideBarOpen && (
          <Grid item xs={4} md={4}>
            <Fade in={isSideBarOpen}>
              <Box
                sx={{
                  float: 'right',
                  width: '100%',
                  height: '100vh',
                  padding: '20px',
                  // backgroundColor: 'blue',
                  marginRight: '-50px',
                  backgroundColor: theme.palette.primary.contrastText,
                }}
              >
                <SidebarZone currentRowData={currentRowData} setIsSideBarOpen={setIsSideBarOpen} />
              </Box>
            </Fade>
          </Grid>
        )}
      </Grid>
      {/* confirmation of delete a zone */}
      <ConfirmModal
        message="Do you want to delete this zone ?"
        isOpen={isConfirmModalOpen}
        blurClose
        loading={deleteAZoneQuery?.isLoading}
        onCancel={() => {
          setIsConfirmModalOpen(false);
        }}
        onConfirm={() => {
          deletedAzoneById(zoneId);
          // setIsConfirmModalOpen(false);
        }}
      />
    </Box>
  );
}

export default ServiceZone;
