import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardTitle, Col, Container, Input, Row } from 'reactstrap';

import { useDispatch, useSelector } from 'react-redux';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import GlobalWrapper from '../../../components/GlobalWrapper';

import Breadcrumbs from '../../../components/Common/Breadcrumb';
import {
  addAdminRole,
  deleteRole,
  editRole,
  getAllRoles,
  restoreRole,
} from '../../../store/AdminControl/Role/roleAction';

function Role() {
  const [role, setRole] = useState('');
  const [roleId, setRoleId] = useState(null);
  const [activeStatus, setActiveStatus] = useState(0);
  const [isEdit, setIsEdit] = useState(false);

  const dispatch = useDispatch();

  const { loading, roles, message } = useSelector((state) => state.roleReducer);

  const options = [
    { label: 'Active', value: 1 },
    { label: 'Deactive', value: 2 },
  ];

  //   SUBMIT DATA
  // eslint-disable-next-line consistent-return
  const handleSubmit = () => {
    if (!role || role === '') {
      return toast.warn('Enter a Role Name ', {
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

    if (roleId) {
      dispatch(
        editRole({
          id: roleId,
          name: role,
          status: activeStatus,
        })
      );
    }

    if (!roleId) {
      dispatch(addAdminRole({ name: role }));
    }
  };

  const callRoleList = (refresh = false) => {
    dispatch(getAllRoles(refresh));
  };

  useEffect(() => {
    callRoleList();
  }, []);

  // EDIT ROLE
  const handleEdit = (id) => {
    if (id) {
      setRoleId(id);
      const { status, name } = roles.find((role) => role.id === id);
      setRole(name);
      setActiveStatus(status);
      // console.log(role, activeStatus);
      setIsEdit(true);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (message) {
      setRole('');
      setActiveStatus(0);
      setRoleId(null);
    }
  }, [message]);

  // ROLE DELETE

  const handleDelete = (id) => {
    dispatch(deleteRole(id));
  };

  // RESTORE ROLE
  const handleRestore = (id) => {
    dispatch(restoreRole(id));
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs maintitle="Admin Controls" breadcrumbItem="Role" loading={loading} callList={callRoleList} />
          <Row>
            <Col xl={4}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">Add Role</CardTitle>

                  <Row className="mb-3">
                    <Col xl={12} sm={12} md={12}>
                      <Input
                        // style={{ border: '1px solid red' }}
                        id="role"
                        value={role}
                        className="form-control"
                        type="text"
                        placeholder="Enter a Role Name"
                        onChange={(event) => setRole(event.target.value)}
                        required
                      />
                    </Col>

                    {roleId && isEdit && (
                      <Col xl={12} sm={12} md={12} className="mt-3">
                        <select
                          style={{
                            width: '100%',
                            border: '1px solid lightgray',
                            padding: '8px 0px',
                            borderRadius: '6px',
                          }}
                          value={activeStatus}
                          onChange={(event) => setActiveStatus(event.target.value)}
                        >
                          {options.map((option) => (
                            <option value={option.value} key={Math.random()}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </Col>
                    )}
                  </Row>

                  <Row>
                    <Button color="primary" onClick={handleSubmit}>
                      {roleId ? 'Edit' : 'Add'}
                    </Button>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col xl={8}>
              <div className="table-rep-plugin">
                <div className="table-responsive mb-0" data-pattern="priority-columns">
                  <Card>
                    <CardBody>
                      <CardTitle className="h4"> Admin Role List</CardTitle>

                      <Table id="tech-companies-1" className="table  table-bordered  text-center">
                        <Thead>
                          <Tr>
                            <Th>Serial No</Th>
                            <Th>Role Name</Th>
                            <Th>Created at</Th>
                            <Th>Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {roles.map((role, index) => (
                            <Tr
                              key={Math.random()}
                              className="align-middle"
                              style={{
                                fontSize: '15px',
                                fontWeight: '500',
                                backgroundColor: role.deletedAt !== null && role.deletedAt ? 'lightgray' : '',
                                cursor: 'pointer',
                              }}
                            >
                              <Th>{index + 1}</Th>
                              <Td>{role.name}</Td>
                              <Td>{role.createdAt.toLocaleString()}</Td>
                              <Td>
                                <ButtonWrapper>
                                  <button
                                    type="button"
                                    className={
                                      role.deletedAt !== null && role.deletedAt ? 'btn btn-secondary' : 'btn btn-info'
                                    }
                                    onClick={() => handleEdit(role.id)}
                                    disabled={role.deletedAt !== null && role.deletedAt}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Edit"
                                  >
                                    <i className="fa fa-edit" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={role.deletedAt !== null && role.deletedAt}
                                    className={
                                      role.deletedAt !== null && role.deletedAt ? 'btn btn-secondary' : 'btn btn-danger'
                                    }
                                    // onClick={() => handleDelete(item.id)}
                                    onClick={() => {
                                      setIsEdit(false);
                                      handleDelete(role.id);
                                    }}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Delete"
                                    style={{ margin: '0px 4px' }}
                                  >
                                    <i className="fa fa-trash" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={role.deletedAt == null && !role.deletedAt}
                                    className={
                                      role.deletedAt == null && !role.deletedAt
                                        ? 'btn btn-secondary'
                                        : 'btn btn-success'
                                    }
                                    onClick={() => handleRestore(role.id)}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Restore"
                                  >
                                    <i className="fa fa-trash-restore" />
                                  </button>
                                </ButtonWrapper>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

const ButtonWrapper = styled.div`
  .btn {
    width: 30px;
    height: 30px;
    padding: 6px 0px;
    border-radius: 15px;
    text-align: center;
    font-size: 12px;
    line-height: 1.42857;
  }
`;

export default Role;
