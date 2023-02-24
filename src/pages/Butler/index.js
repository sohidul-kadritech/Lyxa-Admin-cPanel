/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unstable-nested-components */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Container } from 'reactstrap';
import Breadcrumb from '../../components/Common/Breadcrumb';
import GlobalWrapper from '../../components/GlobalWrapper';
import { getAllOrder } from '../../store/Butler/butlerActions';
import ButlerOrderTable from '../../components/ButlerOrderTable';

export default function ButlerOrderList() {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);
  const { sortByKey, orders, loading, startDate, endDate, typeKey, orderType, orderSearchKey, status } = useSelector(
    (state) => state.butlerReducer
  );

  const { account_type, _id: Id } = useSelector((store) => store.Login.admin);
  const callOrderList = (refresh = false) => {
    dispatch(
      getAllOrder(
        refresh,
        searchParams.get('shopId') ? searchParams.get('shopId') : account_type === 'shop' ? Id : null,
        account_type === 'seller' ? Id : null
      )
    );
  };
  useEffect(() => {
    if (sortByKey || startDate || endDate || typeKey || orderType || orderSearchKey || searchParams.get('shopId')) {
      callOrderList(true);
    }
  }, [sortByKey, startDate, endDate, typeKey, orderType, orderSearchKey, searchParams.get('shopId')]);

  useEffect(() => {
    if (status) {
      callOrderList(true);
    }
  }, [status]);

  return (
    <GlobalWrapper padding>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem="List"
            title="Orders"
            loading={loading}
            callList={callOrderList}
          />
          <div>
            <ButlerOrderTable orders={orders} loading={loading} />
          </div>
        </Container>
      </div>
    </GlobalWrapper>
  );
}
