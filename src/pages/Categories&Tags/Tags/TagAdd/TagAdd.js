import React from "react";
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../../components/GlobalWrapper";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Label,
  Row,
} from "reactstrap";
import Select from "react-select";

const TagAdd = () => {

  const options = [
    { label: "Mustard", value: "Mustard" },
    { label: "Ketchup", value: "Ketchup" },
    { label: "Relish", value: "Relish" },
  ];

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Add"}
              title="Tags"
              // loading={loading}
              // callList={callCarList}
              isRefresh={false}
            />

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
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Category Name"
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <Label>Shop Type</Label>
                    <Select
                      // value={country}
                      // onChange={() => {
                      //   handleSelectGroup()
                      // }}
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
    </React.Fragment>
  );
};

export default TagAdd;
