import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Card, CardBody, CardTitle, Col, Container, Row } from 'reactstrap';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Lightbox from 'react-image-lightbox';
import { useHistory } from 'react-router-dom';
import noPhoto from '../../../../assets/images/noPhoto.jpg';
import { shopTypeOptions } from '../../../../assets/staticData';
import AppPagination from '../../../../components/AppPagination';
import CircularLoader from '../../../../components/CircularLoader';
import Breadcrumb from '../../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../../components/GlobalWrapper';
import TableImgItem from '../../../../components/TableImgItem';
import ThreeDotsMenu from '../../../../components/ThreeDotsMenu';
import { getAllCategory, setCatStatusFalse, updateCategoryShopType } from '../../../../store/Category/categoryAction';

function CategoryList() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { loading, categories, paging, hasNextPage, hasPreviousPage, currentPage, shopType } = useSelector(
    (state) => state.categoryReducer
  );

  const [isZoom, setIsZoom] = useState(false);
  const [catImg] = useState('');

  const { account_type, shopType: adminShopType, sellerType } = useSelector((store) => store.Login.admin);

  useEffect(() => {
    if (account_type === 'shop' || account_type === 'seller') {
      dispatch(updateCategoryShopType(adminShopType || sellerType));
    }
  }, [account_type]);

  const callCategoryList = (refresh = false) => {
    dispatch(getAllCategory(refresh, account_type));
  };

  useEffect(() => {
    if (shopType) {
      callCategoryList(true);
      dispatch(setCatStatusFalse());
    }
  }, [shopType]);

  // HANDLE MENU
  const handleMenu = (menu, item) => {
    if (menu === 'Edit') {
      history.push(`/categories/edit/${item?._id}`);
    } else {
      history.push(`/category/details/${item._id}`);
    }
  };

  console.log(categories);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem="List"
            title="Category"
            loading={loading}
            callList={callCategoryList}
            isAddNew={account_type === 'shop'}
            addNewRoute="categories/add"
          />

          {isZoom ? (
            <Lightbox
              mainSrc={catImg}
              enableZoom
              onCloseRequest={() => {
                setIsZoom(!isZoom);
              }}
            />
          ) : null}

          <Row>
            <Col lg={4}>
              <Card>
                <CardBody>
                  <FormControl fullWidth required>
                    <InputLabel id="demo-simple-select-label">Shop Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={shopType}
                      label="Shop Type"
                      disabled={account_type === 'shop' || account_type === 'seller'}
                      onChange={(event) => {
                        dispatch(updateCategoryShopType(event.target.value));
                      }}
                    >
                      {shopTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Card>
            <CardBody>
              <CardTitle className="h4"> Category List</CardTitle>
              <Table id="tech-companies-1" className="table table-hover text-center">
                <Thead>
                  <Tr>
                    <Th>Image/Name</Th>
                    <Th>Type</Th>
                    <Th>Shop</Th>
                    <Th>Status</Th>
                    {account_type === 'shop' && <Th>Action</Th>}
                  </Tr>
                </Thead>
                <Tbody style={{ position: 'relative' }}>
                  {categories.map((item, index) => (
                    <Tr
                      key={index}
                      className="align-middle"
                      style={{
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      <Th>
                        <TableImgItem
                          img={`${item?.category?.image ? item?.category?.image : noPhoto}`}
                          name={item?.category?.name}
                        />
                      </Th>

                      <Td>{item?.category?.type}</Td>
                      <Td>{!item?.shop?.shopName ? 'N/A' : item?.shop?.shopName}</Td>
                      <Td>
                        <div className={`${item?.category?.status === 'active' ? 'active-status' : 'inactive-status'}`}>
                          {item?.category?.status}
                        </div>
                      </Td>
                      {account_type === 'shop' && (
                        <Td>
                          <ThreeDotsMenu
                            handleMenuClick={(menu) => handleMenu(menu, item)}
                            menuItems={['Edit', 'Details']}
                          />
                        </Td>
                      )}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {loading && (
                <div className="text-center">
                  <CircularLoader animation="border" variant="info" />
                </div>
              )}
              {!loading && categories.length < 1 && (
                <div className="text-center">
                  <h4>No category add yet!</h4>
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
                  lisener={(page) => dispatch(getAllCategory(true, account_type, page))}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default CategoryList;
