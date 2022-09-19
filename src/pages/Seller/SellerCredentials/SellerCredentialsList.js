import React, { useEffect } from "react";
import { Container, Spinner } from "reactstrap";
import styled from "styled-components";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { getAllSellerCredentials } from "../../../store/AdminControl/Admin/adminAction";


const SellerCredentialsList = () => {

    const { loading, sellerCredentials } = useSelector((state) => state.adminReducer);
    const dispatch = useDispatch();
    const { account_type: accountType, _id: accountId } = JSON.parse(
        localStorage.getItem("admin")
    );

    useEffect(() => {
        callList(true);
    }, [])


    const callList = (refresh = false) => {
        dispatch(getAllSellerCredentials(refresh, accountId));
    }

    return (
        <React.Fragment>
            <GlobalWrapper>
                <div className="page-content" >
                    <Container fluid={true}>
                        <Breadcrumb
                            maintitle="Seller"
                            breadcrumbItem={"Credentials"}
                            loading={loading}
                            callList={callList}
                            isAddNew={true}
                            addNewRoute={"admin/create"}
                        />
                        <Card>
                            <CardBody>
                                <Row className="mb-3">
                                    <Col md={3} className="text-end" />
                                </Row>
                                <CardTitle className="h4"> Credentials List</CardTitle>
                                <Table
                                    id="tech-companies-1"
                                    className="table table__wrapper table-striped table-bordered table-hover text-center"
                                >
                                    <Thead>
                                        <Tr>
                                            <Th>Email</Th>
                                            <Th>Status</Th>
                                            <Th>Created At</Th>

                                        </Tr>
                                    </Thead>
                                    <Tbody style={{ position: "relative" }}>
                                        {sellerCredentials &&
                                            sellerCredentials.length > 0 &&
                                            sellerCredentials.map((item, index) => {
                                                return (
                                                    <Tr
                                                        key={index}
                                                        className="align-middle"
                                                        style={{
                                                            fontSize: "15px",
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        <Th>{item?.email}</Th>

                                                        <Td>{item?.status}</Td>
                                                        <Td>{item?.createdAt}</Td>

                                                    </Tr>
                                                );
                                            })}
                                    </Tbody>
                                </Table>
                                {loading && (
                                    <Spinner
                                        style={{ position: "fixed", left: "50%", top: "50%" }}
                                        animation="border"
                                        variant="info"
                                    />
                                )}
                                {!loading && sellerCredentials?.length < 1 && (
                                    <div className="text-center">
                                        <h4>No Credentials!</h4>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </Container>
                </div>
            </GlobalWrapper>
        </React.Fragment>
    );
};


const Wrapper = styled.div`


.heading{
  color: red;
}


`

export default SellerCredentialsList;
