import React from 'react';
import Select from 'react-select';
import { Button, Card, CardBody, Col, Container, Label, Row } from 'reactstrap';
import Breadcrumb from '../../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../../components/GlobalWrapper';

function TagAdd() {
  const options = [
    { label: 'Mustard', value: 'Mustard' },
    { label: 'Ketchup', value: 'Ketchup' },
    { label: 'Relish', value: 'Relish' },
  ];

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="Add" title="Tags" isRefresh={false} />

          <Card>
            <CardBody>
              <div className="mb-3">
                <h5>Tag Informations</h5>
                <hr />
              </div>
              <Row>
                <Col lg={6}>
                  <div className="mb-4">
                    <Label>Tag Name</Label>
                    <input className="form-control" type="text" placeholder="Enter Category Name" />
                  </div>
                </Col>
                <Col lg={6}>
                  <Label>Shop Type</Label>
                  <Select
                    palceholder="Select Shop Type"
                    options={options}
                    classNamePrefix="select2-selection"
                    required
                  />
                </Col>
              </Row>

              <div className="my-4 d-flex justify-content-center">
                <Button color="primary" className="px-5">
                  Add
                </Button>
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default TagAdd;
