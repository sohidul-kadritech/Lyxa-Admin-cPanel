import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import CredentialsTable from '../../../components/CredentialsTable';
import GlobalWrapper from '../../../components/GlobalWrapper';
import { useGlobalContext } from '../../../context';
import { getAllShopCredentials } from '../../../store/AdminControl/Admin/adminAction';

function ShopCredentialsList() {
  const { loading, shopCredentials } = useSelector((state) => state.adminReducer);
  const dispatch = useDispatch();
  // const { _id: accountId } = useSelector((store) => store.Login.admin);
  const { currentUser } = useGlobalContext();
  const { shop } = currentUser;

  const callList = (refresh = false) => {
    dispatch(getAllShopCredentials(refresh, shop?._id));
  };

  useEffect(() => {
    callList(true);
  }, []);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Shop"
            breadcrumbItem="Credentials"
            loading={loading}
            callList={callList}
            isAddNew
            addNewRoute="admin/create"
          />
          <CredentialsTable data={shopCredentials} loading={loading} type="shop" />
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default ShopCredentialsList;
