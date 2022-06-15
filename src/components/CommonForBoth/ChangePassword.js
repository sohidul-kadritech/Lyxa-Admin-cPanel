import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, Container, Form } from "reactstrap";
import { changePassword } from "../../store/auth/profile/actions";
import GlobalWrapper from "../GlobalWrapper";

const ChangePassword = () => {

  const [newPass, setNewPass] = useState("");
  const {loading, status} = useSelector((state) => state.Profile);
  const dispatch = useDispatch()


  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(changePassword(newPass))

  }

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="pt-2 pb-4">
          <Container fluid={true}>
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
              <Button outline={true} color="success" disabled={loading} className="w-100 mt-3" type='submit'>
                {loading ? 'Loading...' : 'Change Password'}
              </Button>
            </Form>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default ChangePassword;
