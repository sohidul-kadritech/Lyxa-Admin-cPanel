import React from 'react';
import { Container } from 'reactstrap';
import GlobalWrapper from '../../components/GlobalWrapper';
import TextEditor from '../../components/TextEditor/TextEditor';

function DeliveryTermsAndConditions() {
  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <TextEditor title="Delivery Terms and Condtions" type="delivery" />
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default DeliveryTermsAndConditions;
