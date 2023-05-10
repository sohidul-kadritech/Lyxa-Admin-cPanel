import { Add } from '@mui/icons-material';
import { Box, Button, Drawer, Stack } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import PageTop from '../../components/Common/PageTop';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { successMsg } from '../../helpers/successMsg';
import * as API_URL from '../../network/Api';
import AXIOS from '../../network/axios';
import AddUser from './AddUser';
import UsersTable from './UsersTable';

// styled button
function AddMenuButton({ ...props }) {
  return (
    <Button variant="contained" color="primary" size="small" startIcon={<Add />} {...props}>
      Add user
    </Button>
  );
}

function Users2() {
  const [open, setOpen] = useState(false);

  const [isConfirm, setIsConfirm] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [searchFilteredData, setSearchFilteredData] = useState([]);

  const shop = useSelector((store) => store.Login.admin);

  const { data, isLoading, refetch } = useQuery(
    'get-shop-credentials',
    () =>
      // eslint-disable-next-line prettier/prettier
			AXIOS.get(`${API_URL.GET_SHOP_CREDENTIALS}?id=${shop._id}`),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setSearchFilteredData([
            ...(data?.data?.credentials?.credentials || []),
            { ...shop, name: shop.name ? shop.name : shop.account_name, isParentUser: true },
          ]);
        } else {
          successMsg(data.message, 'error');
        }
      },
      // eslint-disable-next-line prettier/prettier
		}
  );

  const closeEditSidebar = () => setIsEditOpen(false);

  const closeConfirmModal = () => setIsConfirm(false);

  const openEditSideBar = () => setIsEditOpen(true);

  const openConfirmModal = () => setIsConfirm(true);

  const addUser = useMutation((data) => AXIOS.post(API_URL.ADD_SHOP_CREDENTIAL, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg(data.message, 'success');
        refetch();
        setOpen(false);
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  const editUserAction = useMutation(
    (data) => AXIOS.post(API_URL.UPDATE_SHOP_CREDENTIAL, { isParentUser: undefined, ...data }),
    {
      onSuccess: (data, args) => {
        console.log('args: ', args);
        if (data?.status) {
          successMsg(data.message, 'success');
          closeEditSidebar();
          if (args?.isParentUser) {
            shop.name = args?.name;
          }
          refetch();
        } else {
          successMsg(data.message, 'error');
        }
      },
      // eslint-disable-next-line prettier/prettier
		}
  );

  const DeleteUser = useMutation((data) => AXIOS.post(API_URL.REMOVE_SHOP_CREDENTIAL, data), {
    onSuccess: (data) => {
      if (data?.status) {
        successMsg(data.message, 'success');
        closeConfirmModal();
        refetch();
      } else {
        successMsg(data.message, 'error');
      }
    },
  });

  const RemoveUserHandler = (data) => {
    DeleteUser.mutate(data);
  };

  const onChangeSearchHandler = (e) => {
    if (e.target.value !== '') {
      setSearchFilteredData(
        searchFilteredData.filter(
          (user) =>
            user?.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            // eslint-disable-next-line prettier/prettier
						user?.email.toLowerCase().includes(e.target.value.toLowerCase())
          // eslint-disable-next-line prettier/prettier
				)
      );
    } else if (e.target.value === '') {
      setSearchFilteredData([
        ...data.data.credentials.credentials,
        { ...shop, name: shop.name ? shop.name : shop.account_name },
      ]);
    }
  };

  const editUserHandler = (data) => {
    console.log(data);
    const { name, new_password, confirm_new_password, _id, isParentUser } = data;

    const tempNewPass = new_password || '';
    const tempconfirmPass = confirm_new_password || '';

    const newData = { id: _id, name, password: tempNewPass, isParentUser };

    if (tempNewPass === tempconfirmPass) {
      editUserAction.mutate(newData);
      // setOpen(false)
    } else successMsg("Passsword doesn't match");
  };

  const addNewUser = async (data) => {
    const { name, email, password, repeated_password } = data;

    const emailRegex = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    // get data for shop credentials

    if (!name) {
      successMsg('Please provide your name!');
      return;
    }

    if (!password) {
      successMsg('Please provide your password!');
      return;
    }

    if (!repeated_password) {
      successMsg('Please provide your repeated password!');
      return;
    }

    if (!email) {
      successMsg('Please provide your email address!');
      return;
    }

    if (password !== repeated_password) {
      successMsg('Pasword not match please check again !');
      return;
    }

    if (!emailRegex.test(email)) {
      successMsg('email is not valid!');
      return;
    }

    addUser.mutate({ shopId: shop._id, name, email, password });
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
      <Stack direction="row" justifyContent="start" gap="17px">
        <StyledSearchBar sx={{ width: '319px' }} onChange={onChangeSearchHandler} placeholder="Search" />
        <AddMenuButton onClick={() => setOpen(true)} />
      </Stack>

      <>
        <Box>
          <UsersTable
            isConfirm={isConfirm}
            isEditOpen={isEditOpen}
            closeConfirmModal={closeConfirmModal}
            closeEditSidebar={closeEditSidebar}
            openEditSideBar={openEditSideBar}
            openConfirmModal={openConfirmModal}
            RemoveUserHandler={RemoveUserHandler}
            editUserHandler={editUserHandler}
            data={searchFilteredData}
            loading={isLoading}
            editUserLoading={editUserAction?.isLoading}
            deleteUserLoading={DeleteUser?.isLoading}
          />
        </Box>
        <Drawer open={open} anchor="right">
          <AddUser loading={addUser?.isLoading} addUser={addNewUser} onClose={() => setOpen(false)} />
        </Drawer>
      </>
    </Box>
  );
}

export default Users2;
