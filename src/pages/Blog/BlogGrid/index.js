import React from 'react';
import MetaTags from 'react-meta-tags';
import { Container, Row } from 'reactstrap';

// Import Breadcrumb
import Breadcrumbs from '../../../components/Common/Breadcrumb';

import RightBar from '../BlogList/RightBar';
import BlogGrid from './BlogGrid';

const index = () => (
  <div className="page-content">
    <MetaTags>
      <title>Blog Grid | Veltrix - Responsive Bootstrap 5 Admin Dashboard</title>
    </MetaTags>
    <Container fluid>
      <Breadcrumbs maintitle="Veltrix" title="Blog" breadcrumbItem="Blog Grid" />
      <Row>
        <BlogGrid />
        <RightBar />
      </Row>
    </Container>
  </div>
);

export default index;
