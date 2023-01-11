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

const DatabaseSettings = () => {
  const dispatch = useDispatch();
  const { loading, error, databaseCollections } = useSelector((store) => store.settingsReducer);
  const [openModal, setOpenModal] = useState(false);
  const [actionObj, setActionObj] = useState({ action: () => {}, actionMsg: "" });

  useEffect(() => {
    dispatch(getAllDatabaseCollections());
  }, []);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid>
            <Breadcrumb maintitle="Drop" breadcrumbItem="Database Collection" title="Admin" loading={loading} />
            <Modal
              isOpen={openModal}
              toggle={() => {
                setOpenModal(false);
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
                        setOpenModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="btn btn-success"
                      onClick={() => {
                        dispatch(actionObj.action());
                        setOpenModal(false);
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
                        setOpenModal(true);
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
                        setOpenModal(true);
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
                        setOpenModal(true);
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
                                  setOpenModal(true);
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
                                    setOpenModal(true);
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
                                  setOpenModal(true);
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
