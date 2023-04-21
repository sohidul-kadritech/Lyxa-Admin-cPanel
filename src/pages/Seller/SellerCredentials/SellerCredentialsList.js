import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import CredentialsTable from '../../../components/CredentialsTable';
import GlobalWrapper from '../../../components/GlobalWrapper';
import { getAllSellerCredentials } from '../../../store/AdminControl/Admin/adminAction';

function SellerCredentialsList() {
  const { loading, sellerCredentials } = useSelector((state) => state.adminReducer);
  const dispatch = useDispatch();
  const { _id: accountId } = useSelector((store) => store.Login.admin);

  const callList = (refresh = false) => {
    dispatch(getAllSellerCredentials(refresh, accountId));
  };

  useEffect(() => {
    callList(true);
  }, []);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Seller"
            breadcrumbItem="Credentials"
            loading={loading}
            callList={callList}
            isAddNew
            addNewRoute="admin/create"
          />
          <CredentialsTable data={sellerCredentials} loading={loading} type="seller" />
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default SellerCredentialsList;
