import React, { useEffect } from "react";
import { Container, Spinner } from "reactstrap";
import styled from "styled-components";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { getAllSellerCredentials } from "../../../store/AdminControl/Admin/adminAction";
import CredentialsTable from "../../../components/CredentialsTable";


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
                        <CredentialsTable data={sellerCredentials} loading={loading} type='seller' />
                    </Container>
                </div>
            </GlobalWrapper>
        </React.Fragment>
    );
};




export default SellerCredentialsList;
