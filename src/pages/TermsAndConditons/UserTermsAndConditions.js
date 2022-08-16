import { Container } from "@mui/material";
import React from "react";
import GlobalWrapper from "../../components/GlobalWrapper";
import TextEditor from "../../components/TextEditor/TextEditor";

const UserTermsAndConditions = () => {
  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <TextEditor
              title="User Terms and Condtions"
              type="userAppTearmsAndConditions"
            />
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default UserTermsAndConditions;
