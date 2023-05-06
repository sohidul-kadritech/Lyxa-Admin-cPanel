import { Add } from '@mui/icons-material';
import { Box, Button, Drawer, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageTop from '../../components/Common/PageTop';
import StyledSearchBar from '../../components/Styled/StyledSearchBar';
import { successMsg } from '../../helpers/successMsg';
import { addShopCredential, getAllShopCredentials } from '../../store/AdminControl/Admin/adminAction';
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
  const { loading, shopCredentials } = useSelector((state) => state.adminReducer);
  const dispatch = useDispatch();
  const { _id: accountId } = useSelector((store) => store.Login.admin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  console.log(email, ' and ', password);
  const callList = (refresh = false) => {
    dispatch(getAllShopCredentials(refresh, accountId));
  };
  const updateData = (data) => {
    const { email, password, repeated_password } = data;
    setEmail(email);
    setPassword(password);

    // get data for shop credentials

    if (password !== repeated_password) {
      successMsg('Pasword not match please check again !');
    } else {
      dispatch(
        addShopCredential({
          email,
          password,
          shopId: accountId,
          // eslint-disable-next-line prettier/prettier
        }),
      );
      callList(true);
    }
  };

  useEffect(() => {
    callList(true);
  }, []);

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
        <StyledSearchBar sx={{ width: '319px' }} />
        <AddMenuButton onClick={() => setOpen(true)} />
      </Stack>

      <Box>
        <UsersTable data={shopCredentials} loading={loading} />
      </Box>
      <Drawer open={open} anchor="right">
        <AddUser addUser={updateData} onClose={() => setOpen(false)} />
      </Drawer>
    </Box>
  );
}

export default Users2;
