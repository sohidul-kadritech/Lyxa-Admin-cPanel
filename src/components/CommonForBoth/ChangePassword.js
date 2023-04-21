import { TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Form } from 'reactstrap';
import { changePassword } from '../../store/auth/profile/actions';
import GlobalWrapper from '../GlobalWrapper';

function ChangePassword() {
  const [newPass, setNewPass] = useState('');
  const { loading } = useSelector((state) => state.Profile);
  const dispatch = useDispatch();
  const {
    admin: { account_type, adminType },
  } = useSelector((state) => state.Login);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      changePassword(
        newPass,
        account_type === 'admin' && adminType === 'customerService' ? 'customerService' : account_type
      )
    );
  };

  return (
    <GlobalWrapper>
      <div className="pt-2 pb-4">
        <Container fluid>
          <Form onSubmit={handleSubmit}>
            <TextField
              type="text"
              className="form-control"
              placeholder="Enter new password"
              required
              label="New Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <Button outline color="success" disabled={loading} className="w-100 mt-3" type="submit">
              {loading ? 'Loading...' : 'Change Password'}
            </Button>
          </Form>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default ChangePassword;
