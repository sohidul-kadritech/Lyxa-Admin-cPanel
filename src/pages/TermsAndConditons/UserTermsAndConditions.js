import React from 'react';
import { Container } from 'reactstrap';
import GlobalWrapper from '../../components/GlobalWrapper';
import TextEditor from '../../components/TextEditor/TextEditor';

function UserTermsAndConditions() {
  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <TextEditor title="User Terms and Condtions" type="user" />
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default UserTermsAndConditions;
