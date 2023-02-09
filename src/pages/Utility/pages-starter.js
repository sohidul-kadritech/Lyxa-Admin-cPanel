import React from 'react';
import MetaTags from 'react-meta-tags';
import { Container } from 'reactstrap';

// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

function PagesStarter() {
  return (
    <div className="page-content">
      <MetaTags>
        <title>Starter Page | Veltrix - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>
      <Container fluid>
        {/* Render Breadcrumbs */}
        <Breadcrumbs maintitle="Veltrix" title="Extra Pages" breadcrumbItem="Starter Page" />
      </Container>
    </div>
  );
}

export default PagesStarter;
