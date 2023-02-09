import React from 'react';
import { Container } from 'reactstrap';
import GlobalWrapper from '../../components/GlobalWrapper';
import TextEditor from '../../components/TextEditor/TextEditor';

function ShopTermsAndConditions() {
  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <TextEditor title="Shop Terms and Condtions" type="shop" />
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default ShopTermsAndConditions;
