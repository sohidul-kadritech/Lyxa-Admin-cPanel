import React from 'react';
import { Container } from 'reactstrap';
import GlobalWrapper from '../../../components/GlobalWrapper';

const DropPayList = () => {
    return (
        <React.Fragment>
      <GlobalWrapper>

      <div className="page-content" >
        <Container fluid={true}>
            <h2>Drop Pay</h2>
        </Container>
      </div>
      </GlobalWrapper>
    </React.Fragment>
    );
};

export default DropPayList;