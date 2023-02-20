/* eslint-disable react/jsx-no-bind */
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Card, CardBody, CardTitle, Col, Container, Row, Spinner } from 'reactstrap';

import { FormControl } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import SweetAlert from 'react-bootstrap-sweetalert';
import Lightbox from 'react-image-lightbox';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import TableImgItem from '../../components/TableImgItem';
import ThreeDotsMenu from '../../components/ThreeDotsMenu';
import { deleteBanner, filterSelect, getBannerListAction } from '../../store/banner/bannerAction';
import { updateShopSearchKey, updateShopType } from '../../store/Shop/shopAction';
import BreadcrumbsBanner from './BreadcrumbsBanner';

function BannerPage() {
  const dispatch = useDispatch();
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState('');
  const [dynamic_description, setdynamic_description] = useState('');
  const [bannerId, setBannerId] = useState(null);

  const route = useHistory();

  const [viewStyle, setViewStyle] = useState(
    localStorage.getItem('bannerView') ? localStorage.getItem('bannerView') : 'list'
  );

  // useEffect(() => { }, []);

  const { loading, list, type } = useSelector((state) => state.bannerReducer);

  const [isZoom, setIsZoom] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [bannerImg, setBannerImg] = useState('');

  function callBanner(refresh = false) {
    dispatch(getBannerListAction(refresh));
  }

  useEffect(() => {
    if (type) {
      callBanner(true);
    } else {
      callBanner();
    }
  }, [type]);

  const handleEdit = (id) => {
    route.push(`/banner/edit/${id}`);
  };

  // DELETE BANNER
  const handleDelete = () => {
    dispatch(deleteBanner(bannerId));
  };

  useEffect(() => {
    dispatch(updateShopType({ label: 'All', value: 'all' }));
    dispatch(updateShopSearchKey(''));
  }, []);

  // HANDLE ACTION MENU
  const handleMenu = (menu, item) => {
    if (menu === 'Edit') {
      handleEdit(item?._id);
    } else {
      setconfirm_alert(true);
      setBannerId(item?._id);
    }
  };

  const listViewBanner = () => (
    <Col xl={12}>
      {isZoom ? (
        <Lightbox
          mainSrc={bannerImg}
          enableZoom
          onCloseRequest={() => {
            setIsZoom(!isZoom);
          }}
        />
      ) : null}

      <div className="table-rep-plugin">
        <div className="table-responsive mb-0" data-pattern="priority-columns">
          <Card>
            <CardBody>
              <Table id="tech-companies-1" className="table  table-hover text-center">
                <Thead>
                  <Tr>
                    <Th data-priority="1">Banner</Th>
                    <Th data-priority="1">Type</Th>
                    <Th data-priority="1">Status</Th>
                    <Th data-priority="3">Created At</Th>
                    <Th data-priority="4">Action</Th>
                  </Tr>
                </Thead>

                <Tbody style={{ verticalAlign: 'middle' }}>
                  {list.map((item, index) => (
                    <Tr key={index} className="text-capitalize">
                      <Th>
                        <TableImgItem img={item.image} name={item?.title} />
                      </Th>

                      <Td>{item?.type}</Td>
                      <Td>
                        <div className={`${item?.status === 'active' ? 'active-status' : 'inactive-status'}`}>
                          {item?.status}
                        </div>
                      </Td>
                      <Td>{moment(item?.createdAt).utc().format('YYYY-MM-DD')}</Td>
                      <Td>
                        <ThreeDotsMenu
                          handleMenuClick={(menu) => handleMenu(menu, item)}
                          menuItems={['Edit', 'Delete']}
                        />
                        {confirm_alert ? (
                          <SweetAlert
                            title="Are you sure?"
                            warning
                            showCancel
                            confirmButtonText="Yes, delete it!"
                            confirmBtnBsStyle="success"
                            cancelBtnBsStyle="danger"
                            onConfirm={() => {
                              handleDelete();
                              setconfirm_alert(false);
                              setsuccess_dlg(true);
                              setdynamic_title('Deleted');
                              setdynamic_description('Your file has been deleted.');
                            }}
                            onCancel={() => setconfirm_alert(false)}
                          >
                            You won't be able to revert this!
                          </SweetAlert>
                        ) : null}
                      </Td>
                    </Tr>
                  ))}
                  {loading && (
                    <Tr>
                      <Td>
                        <Spinner
                          style={{
                            position: 'fixed',
                            left: '50%',
                            top: '50%',
                          }}
                          animation="border"
                          color="success"
                        />
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>

              {!loading && list.length < 1 && (
                <div className="text-center">
                  <h5>No Data</h5>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </Col>
  );

  const girdViewBanner = () => (
    <Col xl={12}>
      <div className="table-rep-plugin">
        <div className="table-responsive mb-0" data-pattern="priority-columns">
          <Card>
            <CardBody>
              <CardTitle className="h4"> Banner List</CardTitle>
              <hr />
              {loading && (
                <div className="d-flex justify-content-center">
                  <Spinner animation="border" variant="info" />
                </div>
              )}
              <Row>
                {list.map((item) => (
                  <Col key={item._id} xl={4} md={6} sm={12}>
                    <Card className="align-items-center">
                      <ImageView>
                        <>
                          <img
                            src={item.image}
                            className="img-thumbnail img__view"
                            style={{ width: '100%', height: '100%' }}
                            alt="Banner"
                          />
                          <div className="button__wrapper">
                            <button type="button" className="btn btn-info me-2" onClick={() => handleEdit(item._id)}>
                              <i className="fa fa-edit" />
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger "
                              onClick={() => {
                                setconfirm_alert(true);
                                setBannerId(item._id);
                              }}
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </div>
                          {confirm_alert ? (
                            <SweetAlert
                              title="Are you sure?"
                              warning
                              showCancel
                              confirmButtonText="Yes, delete it!"
                              confirmBtnBsStyle="success"
                              cancelBtnBsStyle="danger"
                              onConfirm={() => {
                                handleDelete();
                                setconfirm_alert(false);
                                setsuccess_dlg(true);
                                setdynamic_title('Deleted');
                                setdynamic_description('Your file has been deleted.');
                              }}
                              onCancel={() => setconfirm_alert(false)}
                            >
                              You won't be able to revert this!
                            </SweetAlert>
                          ) : null}
                        </>
                      </ImageView>
                      <h4>{item.title}</h4>
                    </Card>
                  </Col>
                ))}
              </Row>

              {!loading && list.length < 1 && (
                <div className="text-center">
                  <h5>No Data</h5>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </Col>
  );

  return (
    <div className="page-content">
      <Container fluid>
        {success_dlg ? (
          <SweetAlert
            success
            title={dynamic_title}
            onConfirm={() => {
              setsuccess_dlg(false);
            }}
          >
            {dynamic_description}
          </SweetAlert>
        ) : null}
        <Row>
          <BreadcrumbsBanner
            maintitle="Banner"
            breadcrumbItem="Banner list"
            callBanner={callBanner}
            loading={loading}
            lisener={(vStyle) => {
              setViewStyle(vStyle);
            }}
          />

          <Col lg={6} className="mb-3">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                label="Age"
                onChange={(event) => dispatch(filterSelect(event.target.value))}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="shop">Shop</MenuItem>
                <MenuItem value="food">Food</MenuItem>
                <MenuItem value="pharmacy">Pharmacy</MenuItem>
                <MenuItem value="grocery">Grocery</MenuItem>
                <MenuItem value="home">Home</MenuItem>
              </Select>
            </FormControl>
          </Col>

          {viewStyle === 'list' ? listViewBanner() : girdViewBanner()}
        </Row>
      </Container>
    </div>
  );
}

const ImageView = styled.div`
  width: 300px;
  height: 150px;
  position: relative;

  .img__view {
    opacity: 1;
    transition: 0.5s ease;
    backface-visibility: hidden;
  }

  .button__wrapper {
    transition: 0.5s ease;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    text-align: center;

    .remove__btn {
      /* background-color: yellow; */
      font-size: 18px;
      color: red;
    }
  }

  &:hover {
    .img_view {
      opacity: 0.3;
    }
    .button__wrapper {
      opacity: 1;
    }
  }
`;

export default BannerPage;
