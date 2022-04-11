import React from 'react';
import { Container } from 'reactstrap';
import GlobalWrapper from '../../../components/GlobalWrapper';

const AdminLogHistory = () => {
    return (
        <React.Fragment>
      <GlobalWrapper>

      <div className="page-content" >
        <Container fluid={true}>
            <h2>Admin Log History</h2>
        </Container>
      </div>
      </GlobalWrapper>
    </React.Fragment>
    );
};

export default AdminLogHistory;