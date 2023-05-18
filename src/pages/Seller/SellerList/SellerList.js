import React, { useEffect, useState } from 'react';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';

import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import Lightbox from 'react-image-lightbox';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import noPhoto from '../../../assets/images/noPhoto.jpg';
import { shopTypeOptions, sortByOptions, statusOptions } from '../../../assets/staticData';
import AppPagination from '../../../components/AppPagination';
import CircularLoader from '../../../components/CircularLoader';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import Search from '../../../components/Search';
import TableImgItem from '../../../components/TableImgItem';
import ThreeDotsMenu from '../../../components/ThreeDotsMenu';
import { useGlobalContext } from '../../../context/GlobalContext';
import {
  getAllSeller,
  setSellerStatusFalse,
  updateSellerSearchKey,
  updateSellerSortByKey,
  updateSellerStatusKey,
  updateSellerType,
} from '../../../store/Seller/sellerAction';

function SellerList() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isZoom, setIsZoom] = useState(false);
  const [sellerImg] = useState('');
  const { dispatchCurrentUser } = useGlobalContext();

  const {
    loading,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    sellers,
    sortByKey,
    searchKey,
    statusKey,
    typeKey,
  } = useSelector((state) => state.sellerReducer);
  const { currentUser } = useGlobalContext();
  const { userType, adminType } = currentUser;

  useEffect(() => {
    dispatch(setSellerStatusFalse());
  }, []);

  const callSellerList = (refresh = false) => {
    dispatch(getAllSeller(refresh));
  };

  useEffect(() => {
    if (sortByKey || searchKey || statusKey || typeKey) {
      callSellerList(true);
    } else {
      callSellerList();
    }
  }, [sortByKey, searchKey, statusKey, typeKey]);

  const handleMenu = (menu, item) => {
    // console.log(menu === 'View as Admin');

    if (menu === 'Edit') {
      history.push(`/seller/edit/${item._id}`);
    }

    if (menu === 'View as Admin') {
      history?.push(`/seller/${item._id}`);
      dispatchCurrentUser({ type: 'seller', payload: { seller: item } });
    }
  };

  const goToDetails = (id) => {
    history.push(`/seller/details/${id}`);
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem="List"
            title="Seller"
            loading={loading}
            callList={callSellerList}
            isAddNew={adminType === 'admin' && userType === 'admin'}
            addNewRoute="seller/add"
          />

          {isZoom ? (
            <Lightbox
              mainSrc={sellerImg}
              enableZoom
              onCloseRequest={() => {
                setIsZoom(!isZoom);
              }}
            />
          ) : null}

          <Card>
            <CardBody>
              <Row>
                <Col lg={4}>
                  <div className="mb-4">
                    <label className="control-label">Sort By</label>
                    <Select
                      palceholder="Select Status"
                      options={sortByOptions}
                      classNamePrefix="select2-selection"
                      value={sortByKey}
                      onChange={(e) => dispatch(updateSellerSortByKey(e))}
                    />
                  </div>
                </Col>

                <Col lg={4}>
                  <div className="mb-4">
                    <label className="control-label">Type</label>
                    <Select
                      palceholder="Select Status"
                      options={shopTypeOptions}
                      classNamePrefix="select2-selection"
                      required
                      value={typeKey}
                      onChange={(e) => dispatch(updateSellerType(e))}
                      defaultValue=""
                    />
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="mb-4">
                    <label className="control-label">Status</label>
                    <Select
                      palceholder="Select Status"
                      options={statusOptions}
                      classNamePrefix="select2-selection"
                      required
                      value={statusKey}
                      onChange={(e) => dispatch(updateSellerStatusKey(e))}
                      defaultValue=""
                    />
                  </div>
                </Col>
              </Row>
              <Row className="d-flex justify-content-center">
                <Col lg={8}>
                  <Search
                    dispatchFunc={updateSellerSearchKey}
                    placeholder="Search by id or company name or email or phone number or NID"
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Table id="tech-companies-1" className="table table__wrapper  table-hover text-center">
                <Thead>
                  <Tr>
                    <Th>Company</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    <Th>Status</Th>
                    <Th>Created At</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody style={{ position: 'relative' }}>
                  {sellers.map((item) => (
                    <Tr
                      key={Math.random()}
                      className="align-middle cursor-pointer"
                      style={{
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      <Th className="d-flex" onClick={() => goToDetails(item?._id)}>
                        <TableImgItem
                          img={`${item?.profile_photo ? item?.profile_photo : noPhoto}`}
                          altImg={RoomOutlinedIcon}
                          name={item?.company_name}
                          id={item?.autoGenId}
                        />
                      </Th>

                      <Td onClick={() => goToDetails(item?._id)}>{item?.email}</Td>
                      <Td onClick={() => goToDetails(item?._id)}>{item?.phone_number}</Td>
                      <Td onClick={() => goToDetails(item?._id)}>
                        <div className={`${item?.status === 'active' ? 'active-status' : 'inactive-status'}`}>
                          {`${item?.status === 'active' ? 'Active' : 'Inactive'}`}
                        </div>
                      </Td>
                      <Td onClick={() => goToDetails(item?._id)}>{new Date(item?.createdAt).toLocaleDateString()}</Td>
                      <Td>
                        <ThreeDotsMenu
                          handleMenuClick={(menu) => handleMenu(menu, item)}
                          menuItems={['View as Admin', 'Edit']}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {loading && <CircularLoader />}
              {!loading && sellers.length < 1 && (
                <div className="text-center">
                  <h4>No Data!</h4>
                </div>
              )}
            </CardBody>
          </Card>

          <Row>
            <Col xl={12}>
              <div className="d-flex justify-content-center">
                <AppPagination
                  paging={paging}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={hasPreviousPage}
                  currentPage={currentPage}
                  lisener={(page) => dispatch(getAllSeller(true, page))}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default SellerList;
