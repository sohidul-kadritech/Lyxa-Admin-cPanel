import React from 'react';
import { Container } from 'reactstrap';
import ChatMessageTable from '../../components/ChatMessageTable';
import Breadcrumb from '../../components/Common/Breadcrumb';
import GlobalWrapper from '../../components/GlobalWrapper';

function DefaultChat() {
  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Default Chat Message" isRefresh={false} />
          <ChatMessageTable />
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default DefaultChat;
