import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Breadcrumb from "../../components/Common/Breadcrumb";
import GlobalWrapper from "../../components/GlobalWrapper";
import { addDefaultMsg, editDefaultMsg, getDefaultMessage, updateDefaultSearchKey } from '../../store/Settings/settingsAction';
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    Container,
    Form,
    Modal,
    Row,
    Spinner,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { TextField, Tooltip } from "@mui/material";
import Search from "../../components/Search";

const DefaultChat = () => {

    const { defualtMessages, loading, searchKey, status } = useSelector(state => state.settingsReducer);

    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [message, setMessage] = useState('');
    const [id, setId] = useState(null);

    useEffect(() => {
        callList(true);
    }, [searchKey])


    const callList = (refresh = false) => {
        dispatch(getDefaultMessage(refresh))
    }

    const addMessage = (e) => {
        e.preventDefault();
        if (id) {
            dispatch(editDefaultMsg({
                id,
                message
            }))
        } else {
            dispatch(addDefaultMsg(message))
        }
    }


    useEffect(() => {
        setMessage('');
        setOpenModal(false);
        setId(null);
    }, [status])

    return (
        <React.Fragment>
            <GlobalWrapper>

                <div className="page-content" >
                    <Container fluid={true}>
                        <Breadcrumb
                            maintitle="Drop"
                            breadcrumbItem="Default Chat Message"
                            title="Admin"
                            loading={loading}
                            callList={callList}
                        />

                        <Card>
                            <CardBody>
                                <Row className="d-flex justify-content-center align-items-center">
                                    <Col lg={8}>
                                        <Search dispatchFunc={updateDefaultSearchKey} placeholder='Search By message' />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>

                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <CardTitle className="h4"> Messages List</CardTitle>
                                    <Button onClick={() => setOpenModal(!openModal)} className='btn btn-success'>Add New</Button>
                                </div>
                                <Table
                                    id="tech-companies-1"
                                    className="table table__wrapper table-striped table-bordered table-hover text-center"
                                >
                                    <Thead>
                                        <Tr>
                                            <Th>SL</Th>
                                            <Th>Message</Th>
                                            <Th>Created Date</Th>
                                            <Th>Active</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody style={{ position: "relative" }}>
                                        {defualtMessages.map((item, index) => {
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

                                                        {index + 1}
                                                    </Th>
                                                    <Td>{item?.message}</Td>
                                                    <Td>{new Date(item?.createdAt).toDateString()}</Td>
                                                    <Td>
                                                        <div>
                                                            <Tooltip title="Edit">
                                                                <button
                                                                    className="btn btn-success me-0 me-xl-2 button"
                                                                    onClick={() => {
                                                                        setOpenModal(!openModal);
                                                                        setId(item?._id)
                                                                        setMessage(item?.message);
                                                                    }

                                                                    }
                                                                >
                                                                    <i className="fa fa-edit" />
                                                                </button>
                                                            </Tooltip>

                                                        </div>
                                                    </Td>
                                                </Tr>
                                            );
                                        })}
                                    </Tbody>
                                </Table>
                                {/* {loading && (
                                    <div className="text-center">
                                        <Spinner animation="border" variant="info" />
                                    </div>
                                )} */}
                                {!loading && defualtMessages?.length < 1 && (
                                    <div className="text-center">
                                        <h4>No Data!</h4>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </Container>
                </div>


                {/* MODAL */}

                <Modal
                    isOpen={openModal}
                    toggle={() => {
                        setOpenModal(!openModal);
                    }}
                    centered={true}
                >
                    <div className="modal-header">
                        <h5 className="modal-title mt-0">{`${id ? 'Edit' : 'Add'}  Message`}</h5>
                        <button
                            type="button"
                            onClick={() => {
                                setOpenModal(false);
                            }}
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <Form onSubmit={addMessage}>



                            <div className="my-2">
                                <TextField
                                    type="text"
                                    multiline
                                    className="form-control"
                                    placeholder="Type message"
                                    maxRows={4}
                                    required
                                    label="Message"
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                />
                            </div>


                            <div className="d-flex justify-content-center my-3">
                                <Button
                                    color="success"
                                    size="lg"
                                    className="px-5"
                                    type="submit"
                                    // style={{ width: "120px" }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Spinner color="danger" size="sm"></Spinner>
                                    ) : (
                                        id ? 'Edit' : 'Add'
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            </GlobalWrapper>
        </React.Fragment>
    );
};


const Wrapper = styled.div`


.heading{
  color: red;
}


`

export default DefaultChat;
