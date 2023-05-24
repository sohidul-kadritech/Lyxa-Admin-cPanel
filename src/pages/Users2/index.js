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

const createCurrentUesrItem = (currentUser, userType) => {
  const user = currentUser[userType];
  return { _id: user?._id, name: user?.name ? user?.name : user?.account_name, email: user?.email, isParentUser: true };
};

const userTypeToApiMap = { shop: API_URL.GET_SHOP_CREDENTIALS, seller: API_URL.GET_SELLER_CREDENTIALS };

export default function Users({ userType }) {
  const { currentUser } = useGlobalContext();
  const [open, setOpen] = useState(null);
  const [user, setUser] = useState({});
  const [isConfirm, setIsConfirm] = useState(false);
  const [searchFilteredData, setSearchFilteredData] = useState([]);

  const { data, refetch } = useQuery(
    [userTypeToApiMap[userType], { id: currentUser[userType]?._id }],
    () =>
      AXIOS.get(userTypeToApiMap[userType], {
        params: {
          id: currentUser[userType]?._id,
        },
      }),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setSearchFilteredData([
            createCurrentUesrItem(currentUser, userType),
            ...(data?.data?.credentials?.credentials || []),
          ]);
        } else {
          successMsg(data.message, 'error');
        }
      },
    }
  );

  const deleteUserMutation = useMutation((data) => AXIOS.post(API_URL.REMOVE_SHOP_CREDENTIAL, data), {
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

  const onChangeSearchHandler = (e) => {
    if (e.target.value !== '') {
      setSearchFilteredData(
        searchFilteredData.filter(
          (user) =>
            user?.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            user?.email.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    } else {
      setSearchFilteredData([createCurrentUesrItem(currentUser, userType), ...data.data.credentials.credentials]);
    }
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
        <StyledSearchBar sx={{ width: '319px' }} onChange={onChangeSearchHandler} placeholder="Search" />
        <Button variant="contained" color="primary" size="small" startIcon={<Add />} onClick={() => setOpen('add')}>
          Add user
        </Button>
      </Stack>
      <Table
        rows={searchFilteredData}
        onEdit={(row) => {
          setUser(row);
          setOpen('edit');
        }}
        onDelete={(row) => {
          setUser(row);
          setIsConfirm(true);
        }}
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
        message="Are you confirm to remove the user?"
        isOpen={isConfirm}
        loading={deleteUserMutation.isLoading}
        blurClose
        onCancel={() => {
          setIsConfirm(false);
          setUser({});
        }}
        onConfirm={() => {
          // removeCredential(removedUserId);
          // setIsConfirmModalOpen(false);
        }}
      />
    </Box>
  );
}

//  Users2;
