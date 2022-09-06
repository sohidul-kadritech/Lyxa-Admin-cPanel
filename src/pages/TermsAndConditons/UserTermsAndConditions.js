import React from "react";
import { useSelector } from "react-redux";
import Breadcrumb from "../../components/Common/Breadcrumb";
import GlobalWrapper from "../../components/GlobalWrapper";
import TextEditor from "../../components/TextEditor/TextEditor";
import { Container } from "reactstrap";

const UserTermsAndConditions = () => {
  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <TextEditor title="User Terms and Condtions" type="user" />
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default UserTermsAndConditions;
