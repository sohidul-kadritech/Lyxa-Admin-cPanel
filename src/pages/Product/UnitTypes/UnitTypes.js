import React, { useEffect, useState } from "react";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
  Button,
  Label,
  Form,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import {
  addUnitType,
  deleteUnitType,
  editUnitType,
  getAllUnitType,
} from "../../../store/unitType/unitTypeAction";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "@mui/material";

const UnitTypes = () => {
  const dispatch = useDispatch();

  const { loading, status, unitTypes } = useSelector(
    (state) => state.unitTypeReducer
  );

  const [name, setName] = useState("");
  const [id, setId] = useState(null);

  useEffect(() => {
    callUnitList(true);
  }, []);

  const handleSubmitUnit = (e) => {
    e.preventDefault();
    if (id) {
      dispatch(
        editUnitType({
          unitId: id,
          name,
        })
      );
    } else {
      dispatch(addUnitType(name));
    }
  };

  useEffect(() => {
    setName("");
    setId(null);
  }, [status]);

  //   UPDAT UNIT

  const handleEditUnit = (id) => {
    setId(id);
    const { name } = unitTypes.find((item) => item._id === id);
    setName(name);
  };

  const callUnitList = (refreah = false) => {
    dispatch(getAllUnitType(refreah));
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Product Unit"
              loading={loading}
              callList={callUnitList}
            />

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h5>Unit Types</h5>
                    <hr />
                    <Form onSubmit={handleSubmitUnit}>
                      <div className="mb-2">
                        <Label>Name</Label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Unit Type Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="d-flex justify-content-center mt-4">
                        <Button
                          color="success"
                          disabled={loading}
                          className="px-5"
                          type="submit"
                        >
                          {loading ? (
                            <Spinner
                              animation="border"
                              variant="info"
                              size="sm"
                            />
                          ) : id ? (
                            "Update"
                          ) : (
                            "Add"
                          )}
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <CardTitle className="h4 mb-2">Unit Types List</CardTitle>

                    <Table
                      id="tech-companies-1"
                      className="table table__wrapper table-striped table-bordered table-hover text-center"
                    >
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Created At</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody style={{ position: "relative" }}>
                        {unitTypes.map((item, index) => {
                          return (
                            <Tr
                              key={index}
                              className="align-middle"
                              style={{
                                fontSize: "15px",
                                fontWeight: "500",
                              }}
                            >
                              <Th>{item?.name}</Th>
                              <Td>
                                {new Date(item?.createdAt).toLocaleDateString()}
                              </Td>
                              <Td>
                                <div>
                                  <Tooltip title="Edit">
                                    <button
                                      className="btn btn-success me-3 button"
                                      onClick={() => handleEditUnit(item._id)}
                                    >
                                      <i className="fa fa-edit" />
                                    </button>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <button
                                      className="btn btn-danger button"
                                      onClick={() =>
                                        dispatch(deleteUnitType(item._id))
                                      }
                                    >
                                      <i className="fa fa-trash" />
                                    </button>
                                  </Tooltip>
                                </div>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                    {!loading && unitTypes.length < 1 && (
                      <div className="text-center">
                        <h4>No Data...</h4>
                      </div>
                    )}
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

export default UnitTypes;
