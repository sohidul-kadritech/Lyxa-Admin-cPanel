/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Drawer, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import PageTop from '../../components/Common/PageTop';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import TablePageSkeleton from '../Notification2/TablePageSkeleton';
import AddAdmin from './AddAdmin';
import AddSellersForAccountManager from './AddSellersForAccountManager';
import AdminTeamList from './AdminTeamList';
import { SearchBarForAdminList } from './SearchBarForAdminList';

const adminTypeIndexTracker = {
  0: 'admin',
  1: 'sales',
  2: 'accountManager',
  3: 'customerService',
};

function AdminControl() {
  const queryClient = useQueryClient();

  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [openSellersModal, setOpenSellersModal] = useState(false);

  const [currentTab, setCurrentTab] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [adminType, setAdminType] = useState('admin');

  const [page, setPage] = useState(1);

  const getAllAdminQuery = useQuery([API_URL.GET_ALL_ADMIN, { searchKey, adminType, page }], () =>
    AXIOS.get(API_URL.GET_ALL_ADMIN, {
      params: { searchKey, adminType, page, pageSize: 10 },
    }),
  );

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
            setPage(1);
          }}
        >
          <Tab label="Super Admin" />
          <Tab label="Sales Manger" />
          <Tab label="Account Manager" />
          <Tab label="Customer Support & Operations" />
        </Tabs>
      </Box>
      <SearchBarForAdminList
        setIsEdit={setIsEdit}
        setOpen={setOpen}
        setSearchKey={setSearchKey}
        setCurrentAdmin={setCurrentAdmin}
      />
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
            page={page}
            setPage={setPage}
            totalPage={getAllAdminQuery?.data?.data?.paginate?.metadata?.page?.totalPage}
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
        {(adminType === 'accountManager' || adminType === 'sales') && (
          <AddSellersForAccountManager
            editAdminQuery={editAdminQuery}
            currentAdmin={currentAdmin}
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
