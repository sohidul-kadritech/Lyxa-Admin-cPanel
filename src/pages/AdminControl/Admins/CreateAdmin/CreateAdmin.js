import React from "react";
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../../components/GlobalWrapper";
import {
  Card,
  Col,
  Container,
  Row,
  Modal,
  Button,
  CardTitle,
  CardBody,
  Spinner,
} from "reactstrap";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const CreateAdmin = () => {
  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Create"}
              title="Admin"
              // loading={loading}
              // callList={callCarList}
              isRefresh={false}
            />

            <Card>
              <CardBody>
              <div className="py-3">
                  <h5>Admin Informations</h5>
                  <hr />
                </div>
                <Row>
                  <Col xl={6}>
                    <TextField
                      id="name"
                      label="Name"
                      variant="outlined"
                      style={{ width: "100%" }}
                      autoComplete="off"
                      required
                    />
                  </Col>
                  <Col xl={6} className="mt-3 mt-xl-0">
                    <TextField
                      // id="email"
                      label="Email"
                      variant="outlined"
                      style={{ width: "100%" }}
                      required
                    />
                  </Col>
                </Row>
                <Row className="mt-xl-4 mt-3">
                  <Col xl={6}>
                    <TextField
                      // id="password"
                      label="Password"
                      variant="outlined"
                      style={{ width: "100%" }}
                      required
                    />
                  </Col>
                  <Col xl={6} className="mt-3 mt-xl-0">
                    <FormControl fullWidth required>
                      <InputLabel id="demo-simple-select-label">Role</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={age}
                        label="Role"
                        // onChange={handleChange}
                      >
                        <MenuItem value={10}>Admin</MenuItem>
                        <MenuItem value={20}>Seller</MenuItem>
                        <MenuItem value={30}>Delivery Man</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                </Row>

                <div className="pt-3 mt-3 d-flex justify-content-center">
                  <Button color="primary" className="px-5">
                    Create
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

export default CreateAdmin;
