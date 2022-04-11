import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Col,
  Container,
  Row,
  Spinner,
  CardBody,
  Card,
  CardTitle
} from "reactstrap";
import styled from "styled-components";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { useSelector, useDispatch } from "react-redux";
import {
  imageFolderCreateAction,
  imageFolderListAction
} from "../../store/action/imageFolder.action";
import moment from "moment";
import { toast } from "react-toastify";

const ImageFolder = () => {
  const [folderName, setFolderName] = useState("");

  const dispatch = useDispatch();

  const { loading, folderList } = useSelector(state => state.imageReducer);
  const { idLoading, message, error } = useSelector(
    state => state.createFolder
  );

  const createFolder = () => {
    if (folderName != "") {
      dispatch(imageFolderCreateAction(folderName));
    } else {
      toast.warn("enter a folder name ", {
        // position: "bottom-right",
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    }
  };

  useEffect(
    () => {
      if (error) {
        toast.warn(error, {
          // position: "bottom-right",
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      }
    },
    [error]
  );

  useEffect(() => {
    console.log(idLoading);

    dispatch(imageFolderListAction());
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Breadcrumbs
              maintitle="Gallery"
              breadcrumbItem="Image Folder"
              hideSettingBtn={true}
            />

            <Col xl={4}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">Add Folder</CardTitle>

                  <Row className="mb-3">
                    <div className="">
                      <Input
                        // style={{ border: '1px solid red' }}
                        onChange={even => {
                          setFolderName(even.target.value);
                        }}
                        className="form-control"
                        type="text"
                        placeholder="Enter a Folder Name"
                        defaultValue={folderName}
                        required
                      />
                    </div>
                  </Row>

                  <Row>
                    <Button
                      onClick={createFolder}
                      disabled={idLoading ? true : false}
                      color="primary"
                    >
                      {" "}{idLoading ? "Loading" : "Create Folder"}
                    </Button>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col xl={8}>
              <div className="table-rep-plugin">
                <div
                  className="table-responsive mb-0"
                  data-pattern="priority-columns"
                >
                  <Card>
                    <CardBody>
                      <CardTitle className="h4"> Folder List</CardTitle>
                      <Table
                        id="tech-companies-1"
                        className="table table-striped table-bordered"
                      >
                        <Thead>
                          <Tr>
                            <Th>Serial No</Th>
                            <Th data-priority="1">Folder Name</Th>
                            <Th data-priority="3">Created At</Th>
                          </Tr>
                        </Thead>

                        <Tbody>
                          {folderList.map((folder, index) => {
                            return (
                              <Tr key={index}>
                                <Th>
                                  {index + 1}
                                </Th>
                                <Td>
                                  {folder.name}
                                </Td>
                                <Td>
                                  {moment(folder.createdAt)
                                    .utc()
                                    .format("YYYY-MM-DD hh:mm:ss")}
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>

                      {loading &&
                        <div className="d-flex justify-content-center">
                          <Spinner animation="border" variant="info" />
                        </div>}
                    </CardBody>
                  </Card>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

const Wrapper = styled.div``;

export default ImageFolder;
