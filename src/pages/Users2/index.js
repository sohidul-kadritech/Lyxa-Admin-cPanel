/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable default-param-last */
import { Add } from '@mui/icons-material';
import { Box, Button, Drawer, Stack } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import ConfirmModal from '../../components/Common/ConfirmModal';
import PageTop from '../../components/Common/PageTop';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { useGlobalContext } from '../../context';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import AddUser from './AddUser';
import EditUser from './EditUser';
import Table from './Table';

const createCurrentUesrItem = (allCredentials = [], currentUser, userType) => {
  const user = currentUser[userType];
  const credentialUserId = currentUser?.credentialUserId;

  const allUsers = allCredentials?.map((u) => {
    if (u?._id === credentialUserId) return { ...u, isNotEditable: false, isNotDeletable: true };
    return u;
  });

  console.log({ user, currentUser, allCredentials }, credentialUserId, user?._id, user?._id === credentialUserId);

  allUsers.unshift({
    _id: user?._id,
    name: user?.name ? user?.name : user?.account_name,
    email: user?.email,
    isNotEditable: user?._id !== credentialUserId,
    isNotDeletable: true,
    isParentUser: true,
  });
  return allUsers;
};

const userTypeToApiMap = {
  shop: { get: API_URL.GET_SHOP_CREDENTIALS, delete: API_URL.REMOVE_SHOP_CREDENTIAL },
  seller: {
    get: API_URL.GET_SELLER_CREDENTIALS,
    delete: API_URL.REMOVE_SELLER_CREDENTIAL,
  },
};

// user type shop || seller
export default function Users({ userType }) {
  const { currentUser } = useGlobalContext();
  const [open, setOpen] = useState(null);
  const [user, setUser] = useState({});
  const [isConfirm, setIsConfirm] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [render, setRender] = useState(false);

  const { data, refetch, isLoading } = useQuery(
    [userTypeToApiMap[userType]?.get, { id: currentUser[userType]?._id }],
    () =>
      AXIOS.get(userTypeToApiMap[userType]?.get, {
        params: {
          id: currentUser[userType]?._id,
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setAllUsers(createCurrentUesrItem(data?.data?.credentials?.credentials, currentUser, userType));
        } else {
          successMsg(data.message, 'error');
        }
      },
    },
  );

  const deleteUserMutation = useMutation((data) => AXIOS.post(userTypeToApiMap[userType]?.delete, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg(data.message, 'success');
        setIsConfirm(false);
        refetch();
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  const searchUser = (key) => {
    if (key) {
      let isMatch;
      allUsers.forEach((user) => {
        isMatch =
          user?.name.toLowerCase().includes(key.toLowerCase()) || user?.email.toLowerCase().includes(key.toLowerCase());
        user.hidden = !isMatch;
      });
    } else {
      allUsers.forEach((user) => {
        user.hidden = false;
      });
    }
    setRender((prev) => !prev);
  };

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
      <Stack direction="row" justifyContent="start" gap="17px" pb={9}>
        <StyledSearchBar
          sx={{ width: '319px' }}
          onChange={(e) => {
            searchUser(e.target.value);
          }}
          placeholder="Search"
        />
        <Button variant="contained" color="primary" size="small" startIcon={<Add />} onClick={() => setOpen('add')}>
          Add user
        </Button>
      </Stack>
      <Table
        rows={allUsers.filter((user) => user.hidden !== true)}
        loading={isLoading}
        onEdit={(row) => {
          setUser(row);
          setOpen('edit');
        }}
        onDelete={(row) => {
          setUser(row);
          setIsConfirm(true);
        }}
        showFor={userType}
      />
      <Drawer open={Boolean(open)} anchor="right">
        {open === 'add' && <AddUser onClose={() => setOpen(null)} userType={userType} refetch={refetch} />}
        {open === 'edit' && (
          <EditUser
            onClose={() => {
              setOpen(null);
              setUser({});
            }}
            editUser={user}
            userType={userType}
            refetch={refetch}
          />
        )}
      </Drawer>
      <ConfirmModal
        message="Are you sure to remove this user?"
        isOpen={isConfirm}
        loading={deleteUserMutation.isLoading}
        blurClose
        onCancel={() => {
          setIsConfirm(false);
          setUser({});
        }}
        onConfirm={() => {
          setIsConfirm(false);
          deleteUserMutation.mutate({ [userType === 'shop' ? 'shopId' : 'sellerId']: user._id });
        }}
      />
    </Box>
  );
}
