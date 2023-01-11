import React, { useEffect, useState } from "react";
import GlobalWrapper from "../../components/GlobalWrapper";
import { Button, Card, CardBody, CardTitle, Col, Container, Row, Spinner, Modal } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Breadcrumb from "../../components/Common/Breadcrumb";
import {
  getAllDatabaseCollections,
  createDatabaseCollectionBackup,
  restoreCollectionLastBackup,
  restoreAllCollectionsLastBackup,
  deleteDatabaseCollection,
  deleteDatabaseAllCollection,
} from "../../store/Settings/settingsAction";
import { useDispatch, useSelector } from "react-redux";
import { AvForm, AvField } from "availity-reactstrap-validation";

const DatabaseSettings = () => {
  const dispatch = useDispatch();
  const { loading, error, databaseCollections } = useSelector((store) => store.settingsReducer);
  const [cofirmationModal, setConfirmationModal] = useState(false);
  const [authModal, setAuthModal] = useState(true);
  const [actionObj, setActionObj] = useState({ action: () => {}, actionMsg: "" });

  const formHandler = (event, v) => {
    if (event.target.password.value === '1234') {
      setAuthModal(false);
    }
  };

  useEffect(() => {
    dispatch(getAllDatabaseCollections());
  }, []);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid>
            <Breadcrumb maintitle="Drop" breadcrumbItem="Database Collection" title="Admin" loading={loading} />
            {/* auth modaol */}
            <Modal isOpen={authModal} centered={true}>
              <div className="card mb-0">
                <div className="card-body">
                  <AvForm
                    className="form-horizontal"
                    onValidSubmit={(e, v) => {
                      formHandler(e, v);
                    }}
                  >
                    <h5 className="mb-4">Please enter your password before procedding</h5>
                    <div className="mb-3">
                      <AvField name="password" value="" type="password" required placeholder="Enter Password" />
                    </div>
                    <Button className="btn btn-dark w-md waves-effect waves-light" type="submit">
                      Submit
                    </Button>
                  </AvForm>
                </div>
              </div>
            </Modal>
            {/* confirmation modal */}
            <Modal
              isOpen={cofirmationModal}
              toggle={() => {
                setConfirmationModal(false);
              }}
              centered={true}
            >
              <div className="card mb-0">
                <div className="card-body">
                  <h4 className="mb-5 text-black">Are you sure you want to {actionObj.actionMsg} ?</h4>
                  <div className="d-flex gap-3">
                    <Button
                      className="btn btn-primary mr-3"
                      onClick={() => {
                        setConfirmationModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="btn btn-success"
                      onClick={() => {
                        dispatch(actionObj.action());
                        setConfirmationModal(false);
                      }}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            </Modal>
            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <CardTitle className="h4">Database Collection</CardTitle>
                  <div className="d-flex align-items-center gap-2">
                    {/* backup all button */}
                    <Button
                      className="btn btn-success"
                      disabled={loading}
                      onClick={() => {
                        setConfirmationModal(true);
                        setActionObj({
                          action: () => createDatabaseCollectionBackup([], true),
                          actionMsg: "Backup all collections",
                        });
                      }}
                    >
                      Backup All
                    </Button>
                    {/* restore all backup button */}
                    <Button
                      className="btn btn-primary"
                      disabled={loading}
                      onClick={() => {
                        setConfirmationModal(true);
                        setActionObj({
                          action: () => restoreAllCollectionsLastBackup(),
                          actionMsg: "Restore all collections",
                        });
                      }}
                    >
                      Restore All
                    </Button>
                    {/* delete all collections button */}
                    <Button
                      className="btn btn-danger"
                      disabled={loading}
                      onClick={() => {
                        setConfirmationModal(true);
                        setActionObj({
                          action: () => deleteDatabaseAllCollection(),
                          actionMsg: "Delete all collections",
                        });
                      }}
                    >
                      Delete All
                    </Button>
                  </div>
                </div>
                <Table className="table table-hover text-center">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Size</Th>
                      <Th>Last Backup Time</Th>
                      <Th className="d-flex justify-content-center align-items-center">
                        <label>Action</label>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {databaseCollections?.map((item, index) => {
                      return (
                        <Tr
                          key={Math.random() + index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Td className="text-capitalize d-flex align-items-center">{item.name}</Td>
                          <Td>{(item.size / 1000).toFixed(2)} Mb</Td>
                          <Td>{item.modifyTime || "Not Backed"}</Td>
                          <Td>
                            <div className="d-flex gap-2 align-items-center justify-content-end">
                              <Button
                                className="btn btn-success"
                                disabled={loading}
                                onClick={() => {
                                  setConfirmationModal(true);
                                  setActionObj({
                                    action: () => createDatabaseCollectionBackup([item.fileName]),
                                    actionMsg: "Backup this collection",
                                  });
                                }}
                              >
                                Backup
                              </Button>

                              {item.modifyTime && (
                                <Button
                                  disabled={loading}
                                  onClick={() => {
                                    setConfirmationModal(true);
                                    setActionObj({
                                      action: () => restoreCollectionLastBackup(item.fileName),
                                      actionMsg: "Restore this collection",
                                    });
                                  }}
                                >
                                  Restore
                                </Button>
                              )}
                              <Button
                                className="btn-danger"
                                onClick={() => {
                                  setConfirmationModal(true);
                                  setActionObj({
                                    action: () => deleteDatabaseCollection(item.fileName),
                                    actionMsg: "Delete this collection",
                                  });
                                }}
                                disabled={loading}
                              >
                                Delete
                              </Button>
                            </div>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="success" />
                  </div>
                )}
                {error && <div className="text-center">{error?.message || "Someting went wrong"}</div>}
              </CardBody>
            </Card>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default DatabaseSettings;
