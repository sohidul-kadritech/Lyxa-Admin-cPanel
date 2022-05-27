import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import GlobalWrapper from "../../components/GlobalWrapper";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  addCuisine,
  editCuisine,
  getAllCuisine,
} from "../../store/Shop/shopAction";
import { Tooltip } from "@mui/material";
import Select from "react-select";
import { activeOptions } from "./../../assets/staticData";

const Cuisine = () => {
  const dispatch = useDispatch();

  const { loading, cuisines, status } = useSelector(
    (state) => state.shopReducer
  );

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    callCuisineList();
  }, []);

  const callCuisineList = (refresh = false) => {
    dispatch(getAllCuisine(refresh));
  };

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

    submitDataToServer()
    
  };

  const submitDataToServer = () =>{
    setIsLoading(true)
    if (id) {
      dispatch(
        editCuisine({
          id,
          name,
          status: activeStatus.value,
        })
      );
    } else {
      dispatch(addCuisine(name));
    }
  } 

  const EditData = (cId, cName, cStatus) => {
    // console.log({cStatus})
    const findStatus = activeOptions.find((status) => status.value === cStatus);
    setId(cId);
    setName(cName);
    setActiveStatus(findStatus);
  };

  // SUCCESS

  useEffect(() => {
    if (status) {
      setIsLoading(false)
      setName("");
      setId("");
      setActiveStatus(null);
    }else{
      setIsLoading(false)
    }
  }, [status]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Cuisines"}
              title="Product"
              loading={loading}
              callList={callCuisineList}
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
                    {id && (
                      <div className="mb-4">
                        <label className="control-label">Status</label>
                        <Select
                          palceholder="Select Status"
                          options={activeOptions}
                          classNamePrefix="select2-selection"
                          required
                          value={activeStatus}
                          onChange={(e) => setActiveStatus(e)}
                          defaultValue={""}
                        />
                      </div>
                    )}
                    <div className="d-flex justify-content-center">
                      <Button
                        outline={true}
                        color="success"
                        onClick={submitCuisine}
                      >
                        {isLoading ? (
                          <span>Loading....</span>
                        ) : id ? (
                          "Edit"
                        ) : (
                          "Add"
                        )}
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
                    <CardTitle className="h4"> Cuisines List</CardTitle>
                    <Table
                      id="tech-companies-1"
                      className="table table__wrapper table-striped table-bordered table-hover text-center"
                    >
                      <Thead>
                        <Tr>
                          <Th>Name</Th>
                          <Th>Status</Th>
                          <Th>Created At</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody style={{ position: "relative" }}>
                        {cuisines.map((item, index) => {
                          return (
                            <Tr
                              key={index}
                              className="align-middle"
                              style={{
                                fontSize: "15px",
                                fontWeight: "500",
                              }}
                            >
                              <Th>{item.name}</Th>

                              <Td>{item.status}</Td>
                              <Td>
                                {new Date(item.createdAt).toLocaleDateString()}
                              </Td>
                              <Td>
                                <Tooltip title="Edit">
                                  <button
                                    className="btn btn-success me-2 button"
                                    onClick={() =>
                                      EditData(item._id, item.name, item.status)
                                    }
                                  >
                                    <i className="fa fa-edit" />
                                  </button>
                                </Tooltip>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                    {loading && (
                      <div className="text-center">
                        <Spinner animation="border" variant="info" />
                      </div>
                    )}
                    {!loading && cuisines.length < 1 && (
                      <div className="text-center">
                        <h4>No Data</h4>
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

export default Cuisine;
