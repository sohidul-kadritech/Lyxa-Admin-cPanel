import React, { useEffect } from 'react';
import { Card, CardBody, CardTitle, Col, Container, Row, Spinner } from 'reactstrap';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { deleteTutorial, getAllTutorial, updateTutorialTypeKey } from '../../../store/tutorial/tutorialAction';

function TutorialList() {
  const dispatch = useDispatch();

  const { loading, tutorials, typeKey } = useSelector((state) => state.tutorialReducer);

  const callTutorialList = (refresh = false) => {
    dispatch(getAllTutorial(refresh));
  };

  useEffect(() => {
    if (typeKey) {
      callTutorialList(true);
    } else {
      callTutorialList();
    }
  }, [typeKey]);

  // DELETE TUTORIAL
  const handleDelete = (id) => {
    dispatch(deleteTutorial({ id }));
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Quicar"
            title="Tutorials"
            breadcrumbItem="List"
            loading={loading}
            callList={callTutorialList}
            isAddNew
            addNewRoute="tutorials/add"
          />

          <Card>
            <CardBody>
              <div className="d-flex justify-content-center">
                <FormControl style={{ width: '50%' }}>
                  <InputLabel id="demo-simple-select-label">Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={typeKey}
                    label="Status"
                    onChange={(event) => dispatch(updateTutorialTypeKey(event.target.value))}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="partner">Partner</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </CardBody>
          </Card>

          {/* TUTORIAL LIST TABLE */}

          <Card>
            <CardBody>
              <Row className="mb-3">
                <Col md={3} className="text-end" />
              </Row>
              <CardTitle className="h4"> Tutorial List</CardTitle>
              <Table
                id="tech-companies-1"
                className="table table__wrapper table-striped table-bordered table-hover text-center"
              >
                <Thead>
                  <Tr>
                    <Th>Thumbnil</Th>
                    <Th>Title</Th>
                    <Th>Type</Th>
                    <Th>Youtube Video ID</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody style={{ position: 'relative' }}>
                  {tutorials.map((item) => (
                    <Tr
                      key={Math.random()}
                      className="align-middle"
                      style={{
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      <Th>
                        <div style={{ width: '50px', height: '50px' }}>
                          <img
                            className="img-fluid cursor-pointer"
                            alt=""
                            src={item.thumbnail}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </div>
                      </Th>

                      <Td>{item.title}</Td>
                      <Td>{item.type}</Td>
                      <Td>{item.youtubeVideoId}</Td>
                      <Td>
                        <div>
                          <button type="button" className="btn btn-info me-3 button">
                            <i className="fa fa-edit" />
                          </button>
                          <button type="button" className="btn btn-danger button" onClick={() => handleDelete(item.id)}>
                            <i className="fa fa-trash" />
                          </button>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {loading && (
                <Spinner style={{ position: 'fixed', left: '50%', top: '60%' }} animation="border" variant="info" />
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default TutorialList;
