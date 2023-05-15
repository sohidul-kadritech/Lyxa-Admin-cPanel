import { Add, Close, Edit } from '@mui/icons-material';
import { Box, Button, Modal, Stack, Typography, useTheme } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import PageTop from '../../components/Common/PageTop';
// eslint-disable-next-line no-unused-vars
import StyledFormField from '../../components/Form/StyledFormField';

import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import StyledSwitch from '../../components/Styled/StyledSwitch';
import StyledTable from '../../components/Styled/StyledTable3';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import CreateZone from './CreateZone';

const dateFormation = (date) => moment(date).format('MMMM D, YYYY');

// eslint-disable-next-line no-unused-vars
const fieldContainerSx = {
  padding: '0px 0px',
};

const breadcrumbItems = [
  {
    label: 'Settings',
    to: '#',
  },
  {
    label: 'Zone',
    to: '#',
  },
];

// eslint-disable-next-line no-unused-vars
const rows = [
  {
    _id: 1,
    name: 'Zone A',
    area: 'McDonalt',
    created: 'June 1, 2023',
  },
  {
    _id: 2,
    name: 'Zone B',
    area: 'McDonalt',
    created: 'July 1, 2023',
  },
  {
    _id: 3,
    name: 'Zone C',
    area: 'McDonalt',
    created: 'April 1, 2023',
  },
];

// eslint-disable-next-line no-unused-vars
const statusOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
];

// styled button
// eslint-disable-next-line no-unused-vars
function AddMenuButton({ ...props }) {
  return (
    <Button variant="contained" color="primary" size="small" startIcon={<Add />} {...props}>
      Add
    </Button>
  );
}

function ServiceZone() {
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(false);
  const { account_type } = useSelector((store) => store?.Login?.admin);

  const apiurl = account_type === 'admin' ? API_URL.GET_ALL_ZONE : '';
  const getAllZones = useQuery([apiurl], () => AXIOS.get(apiurl));

  console.log(getAllZones?.data?.data?.zones);
  const columns = [
    {
      id: 0,
      headerName: 'Zone Name',
      field: 'zoneName',
      sortable: false,
      density: 'comfortable',
      minWidth: 400,
      renderCell: ({ value }) => (
        <Box sx={{ flex: '3' }}>
          <Typography>{value}</Typography>
        </Box>
      ),
    },
    {
      id: 1,
      headerName: 'Area',
      field: 'area',
      sortable: false,
      minWidth: 300,
      renderCell: ({ value }) => <Typography>{value || 'no area added'}</Typography>,
    },
    {
      id: 1,
      headerName: 'Date Created',
      field: 'createdAt',
      sortable: false,
      minWidth: 220,
      renderCell: ({ value }) => <Typography>{dateFormation(value)}</Typography>,
    },
    {
      id: 2,
      sortable: false,
      minWidth: 220,
      renderCell: (value) => (
        <Stack flexDirection="row" gap="16px">
          <StyledSwitch
            checked={value?.row?.zoneStatus === 'active'}
            onChange={() => {
              console.log('value; ', value?.row?.zoneStatus);
            }}
          />
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
            onClick={() => console.log(value?.row)}
          >
            <Edit sx={{ fontSize: '14px' }} />
          </Button>

          <Button
            onClick={() => console.log(value?.row)}
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
    <Box>
      <PageTop
        // title="Zone"
        backButtonLabel="Back to Settings"
        breadcrumbItems={breadcrumbItems}
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />

      <Stack direction="row" justifyContent="start" gap="17px">
        <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" />
        <StyledFormField
          // label="Status *"
          intputType="select"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            name: 'zoneStatus',
            value: 'active',
            items: statusOptions,
            size: 'sm2',
            //   items: categories,
            // onChange: editedDataOnChangeHandler,
            //   readOnly: Boolean(newProductCategory) || productReadonly,
          }}
        />
        <AddMenuButton onClick={() => setOpen(true)} />
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
          marginTop: '30px',
          // height: 550,
          // width: '100%',
        }}
      >
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
      </Box>
      <Modal open={open} centered>
        <CreateZone
          onClose={() => {
            setOpen(!open);
          }}
        />
      </Modal>
    </Box>
  );
}

export default ServiceZone;
