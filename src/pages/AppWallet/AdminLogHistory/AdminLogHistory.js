import React from 'react';
import { Container } from 'reactstrap';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import TableForList from '../../../components/TableForList';

function AdminLogHistory() {
  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Admin Log History" />
          <div>
            <TableForList />
          </div>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default AdminLogHistory;
