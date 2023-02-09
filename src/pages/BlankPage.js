import React from 'react';
import { Container } from 'reactstrap';
import GlobalWrapper from '../components/GlobalWrapper';

function BlankPage() {
  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid></Container>
      </div>
    </GlobalWrapper>
  );
}

export default BlankPage;
