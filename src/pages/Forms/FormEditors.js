import React from 'react';
import MetaTags from 'react-meta-tags';

import { Card, CardBody, CardSubtitle, CardTitle, Col, Container, Form, Row } from 'reactstrap';

// Form Editor
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

function FormEditors() {
  return (
    <div className="page-content">
      <MetaTags>
        <title>Form Editors | Veltrix - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>
      <Container fluid>
        <Breadcrumbs maintitle="Veltrix" title="Form" breadcrumbItem="Form Editors" />

        <Row>
          <Col>
            <Card>
              <CardBody>
                <CardTitle className="h4">react-draft-wysiwyg</CardTitle>
                <CardSubtitle className="mb-3">
                  Bootstrap-wysihtml5 is a javascript plugin that makes it easy to create simple, beautiful wysiwyg
                  editors with the help of wysihtml5 and Twitter Bootstrap.
                </CardSubtitle>

                <Form method="post">
                  <Editor
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                  />
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default FormEditors;
