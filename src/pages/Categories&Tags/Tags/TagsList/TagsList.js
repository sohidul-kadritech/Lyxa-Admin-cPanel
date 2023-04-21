import React from 'react';
import { Container } from 'reactstrap';
import GlobalWrapper from '../../../../components/GlobalWrapper';

function TagsList() {
  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <h2>Tag List</h2>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default TagsList;
