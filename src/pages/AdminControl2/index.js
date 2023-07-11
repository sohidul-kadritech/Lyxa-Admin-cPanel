import { Box, Drawer, Stack, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import { AddMenuButton } from '../Faq2';
import TablePageSkeleton from '../Notification2/TablePageSkeleton';
import AddSeller from '../Sellers2/AddSeller';
import AddAdmin from './AddAdmin';
import AddSellersForAccountManager from './AddSellersForAccountManager';
import AdminTeamList from './AdminTeamList';

const adminTypeIndexTracker = {
  0: 'admin',
  1: 'customerService',
  2: 'sales',
  3: 'accountManager',
};

function AdminControl() {
  const [currentTab, setCurrentTab] = useState(0);

  const [searchKey, setSearchKey] = useState('');

  const [isEdit, setIsEdit] = useState(false);

  const [isConfirmModal, setIsConfirmModal] = useState(false);

  const [currentAdmin, setCurrentAdmin] = useState(null);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [openSellersModal, setOpenSellersModal] = useState(false);

  const [adminType, setAdminType] = useState('admin');

  const queryClient = useQueryClient();

  const getAllAdminQuery = useQuery([API_URL.GET_ALL_ADMIN, { searchKey, adminType }], () =>
    AXIOS.get(API_URL.GET_ALL_ADMIN, {
      params: { searchKey, adminType },
      // eslint-disable-next-line prettier/prettier
    }),
  );

  const addSellerQuery = useMutation((data) => AXIOS.post(API_URL.ADD_SELLER, data), {
    onSuccess: (data) => {
      if (data.status) {
        setOpen(false);
        successMsg(data.message, 'success');
        // queryClient.invalidateQueries(API_URL.ALL_SELLER);
        setLoading(false);
      } else {
        successMsg(data.message);
        setLoading(false);
      }
    },
  });

  const addAdminQuery = useMutation((data) => AXIOS.post(API_URL.ADD_ADMIN, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        setOpen(false);
        setIsEdit(false);
        queryClient.invalidateQueries(API_URL.GET_ALL_ADMIN);
      } else {
        successMsg(data.message, 'warn');
      }
    },
  });

  const deleteAdminQuery = useMutation((data) => AXIOS.post(API_URL.DELETE_ADMIN, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        setOpen(false);
        setIsEdit(false);
        setIsConfirmModal(false);
        queryClient.invalidateQueries(API_URL.GET_ALL_ADMIN);
      } else {
        successMsg(data.message, 'warn');
      }
    },
  });

  const editAdminQuery = useMutation((data) => AXIOS.post(API_URL.EDIT_ADMIN, data), {
    onSuccess: (data) => {
      if (data.status) {
        successMsg(data.message, 'success');
        setOpen(false);
        setOpenSellersModal(false);
        setIsEdit(false);
        queryClient.invalidateQueries(API_URL.GET_ALL_ADMIN);
      } else {
        successMsg(data.message, 'warn');
      }
    },
  });

  return (
    <Box>
      <PageTop
        title="Users"
        sx={{
          position: 'sticky',
          top: '-2px',
          zIndex: '999',
          backgroundColor: '#fbfbfb',
          fontWeight: 700,
        }}
      />
      <Box marginBottom="30px">
        <Tabs
          value={currentTab}
          onChange={(event, newValue) => {
            setAdminType(adminTypeIndexTracker[newValue]);
            setCurrentTab(newValue);
          }}
        >
          <Tab label="Admin" />
          <Tab label="Customer Support" />
          <Tab label="Sales Manger" />
          <Tab label="Account Manager" />
        </Tabs>
      </Box>

      <Stack direction="row" justifyContent="start" gap="17px" sx={{ marginBottom: '30px' }} width="444px">
        <StyledSearchBar sx={{ flex: '1' }} placeholder="Search" onChange={(e) => setSearchKey(e.target.value)} />

        <AddMenuButton
          onClick={() => {
            setCurrentAdmin(null);
            setIsEdit(false);
            setOpen(true);
          }}
        />
      </Stack>

      {getAllAdminQuery?.isLoading ? (
        <TablePageSkeleton row={5} column={5} />
      ) : (
        <Box>
          <AdminTeamList
            adminType={adminType}
            deleteAdminQuery={deleteAdminQuery}
            editAdminQuery={editAdminQuery}
            setOpen={setOpen}
            setOpenSellersModal={setOpenSellersModal}
            setIsEdit={setIsEdit}
            isConfirmModal={isConfirmModal}
            setIsConfirmModal={setIsConfirmModal}
            setCurrentAdmin={setCurrentAdmin}
            data={getAllAdminQuery?.data?.data?.Admins}
          />
        </Box>
      )}

      <Drawer open={open} anchor="right">
        <AddAdmin
          onClose={() => {
            setOpen(false);
          }}
          isEdit={isEdit}
          addAdminQuery={isEdit ? editAdminQuery : addAdminQuery}
          adminType={adminType}
          currentAdmin={currentAdmin}
        />
      </Drawer>

      <Drawer open={openSellersModal} anchor="right">
        {adminType === 'accountManager' && (
          <AddSellersForAccountManager
            editAdminQuery={editAdminQuery}
            currentAdmin={currentAdmin}
            onClose={() => {
              setOpenSellersModal(false);
            }}
          />
        )}
        {adminType === 'sales' && (
          <AddSeller
            addSellerQuery={addSellerQuery}
            loading={loading}
            setLoading={setLoading}
            onClose={() => {
              setOpenSellersModal(false);
            }}
          />
        )}
      </Drawer>
    </Box>
  );
}

export default AdminControl;
