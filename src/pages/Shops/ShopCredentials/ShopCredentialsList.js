import React, { useEffect } from "react";
import { Container, Spinner } from "reactstrap";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { getAllSellerCredentials, getAllShopCredentials } from "../../../store/AdminControl/Admin/adminAction";
import CredentialsTable from "../../../components/CredentialsTable";


const ShopCredentialsList = () => {

    const { loading, shopCredentials } = useSelector((state) => state.adminReducer);
    const dispatch = useDispatch();
    const { account_type: accountType, _id: accountId } = useSelector(store => store.Login.admin);

    useEffect(() => {
        callList(true);
    }, [])


    const callList = (refresh = false) => {
        dispatch(getAllShopCredentials(refresh, accountId));
    }

    return (
        <React.Fragment>
            <GlobalWrapper>
                <div className="page-content" >
                    <Container fluid={true}>
                        <Breadcrumb
                            maintitle="Shop"
                            breadcrumbItem={"Credentials"}
                            loading={loading}
                            callList={callList}
                            isAddNew={true}
                            addNewRoute={"admin/create"}
                        />
                        <CredentialsTable data={shopCredentials} loading={loading} type='shop' />
                    </Container>
                </div>
            </GlobalWrapper>
        </React.Fragment>
    );
};




export default ShopCredentialsList;
