import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Label,
  Row,
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import GlobalWrapper from "../../components/GlobalWrapper";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { toast } from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
import { addCuisine } from "../../store/Shop/shopAction";


const Cuisine = () => {

    const dispatch = useDispatch();

    

  const [name, setName] = useState("");

  // SUBMIT DATA
  const submitCuisine = () => {
    if (!name) {
      return toast.warn("Please Add Cuisine Name", {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    dispatch(addCuisine(name))
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Cuisines"}
              title="Product"
              //   loading={loading}
              //   callList={callSellerList}
            />

            <Row>
              <Col md={4}>
                <Card>
                  <CardBody>
                    <div className="mb-4">
                      <Label>Name</Label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Cuisine Name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="d-flex justify-content-center">
                      <Button
                        outline={true}
                        color="success"
                        onClick={submitCuisine}
                      >
                        Add
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col md={8}>
                <Card>
                  <CardBody>
                    <Row className="mb-3">
                      <Col md={3} className="text-end" />
                    </Row>
                    <CardTitle className="h4"> Shop List</CardTitle>
                    <Table
                      id="tech-companies-1"
                      className="table table__wrapper table-striped table-bordered table-hover text-center"
                    >
                      <Thead>
                        <Tr>
                          <Th>Sl</Th>
                          <Th>Name</Th>
                          <Th>Created At</Th>
                        </Tr>
                      </Thead>
                      <Tbody style={{ position: "relative" }}>
                        {/* {shops.map((item, index) => {
                          return (
                            <Tr
                              key={index}
                              className="align-middle"
                              style={{
                                fontSize: "15px",
                                fontWeight: "500",
                              }}
                            >
                              <Th>
                                <div style={{ height: "50px" }}>
                                </div>
                              </Th>

                              <Td>{item.shopName}</Td>
                              <Td>{item.shopType}</Td>
                              <Td>
                                <p>{item.shopStartTimeText}</p>
                                <p>{item.shopEndTimeText}</p>
                              </Td>
                              <Td>{item.shopStatus}</Td>
                            </Tr>
                          );
                        })} */}
                      </Tbody>
                    </Table>
                    {/* {loading && (
                      <div className="text-center">
                        <Spinner animation="border" variant="info" />
                      </div>
                    )}
                    {!loading && shops.length < 1 && (
                      <div className="text-center">
                        <h4>No Data</h4>
                      </div>
                    )} */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default Cuisine;
