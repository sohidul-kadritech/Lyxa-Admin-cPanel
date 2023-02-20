import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import Lightbox from 'react-image-lightbox';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Card, CardBody, Col, Container, Row, Spinner } from 'reactstrap';
import noPhoto from '../../../assets/images/noPhoto.jpg';
import { DealsFilterOptions } from '../../../assets/staticData';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import TableImgItem from '../../../components/TableImgItem';
import ThreeDotsMenu from '../../../components/ThreeDotsMenu';
import { deleteDeal, getAllDeal, updateShopFilter } from '../../../store/Deal/dealAction';

function DealsList() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading, deals, type } = useSelector((state) => state.dealReducer);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg] = useState(null);
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState('');
  const [dynamic_description, setdynamic_description] = useState('');
  const [dealId, setDealId] = useState('');

  const callDealList = (refresh = false) => {
    dispatch(getAllDeal(refresh));
  };

  useEffect(() => {
    if (type) {
      callDealList(true);
    }
  }, [type]);

  // DELETE DEAL
  const handleDelete = () => {
    console.log({ dealId });
    dispatch(deleteDeal(dealId));
  };

  // MENU ITEMS
  const handleMenu = (menu, item) => {
    if (menu === 'Edit') {
      history.push(`/deals/edit/${item._id}`);
    } else {
      setconfirm_alert(true);
      setDealId(item?._id);
    }
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem="List"
            title="Deal"
            loading={loading}
            callList={callDealList}
            isAddNew
            addNewRoute="deals/add"
          />

          {isOpen && (
            <Lightbox
              mainSrc={selectedImg}
              enableZoom
              imageCaption="img"
              onCloseRequest={() => {
                setIsOpen(!isOpen);
              }}
            />
          )}

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

          <Card>
            <CardBody>
              <Row>
                <Col md={4}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={type}
                      label="Status"
                      onChange={(event) => dispatch(updateShopFilter(event.target.value))}
                    >
                      {DealsFilterOptions.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Table id="tech-companies-1" className="table  table-hover text-center">
                <Thead>
                  <Tr>
                    <Th>Deal</Th>
                    <Th>Shop Type</Th>
                    <Th>Deal Type</Th>
                    <Th>Status</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody style={{ position: 'relative' }}>
                  {deals?.map((item) => (
                    <Tr
                      key={item?.autoGenId}
                      className="align-middle"
                      style={{
                        fontSize: '15px',
                        fontWeight: '500',
                      }}
                    >
                      <Th>
                        <TableImgItem
                          img={`${item?.image ? item?.image : noPhoto}`}
                          name={item?.name}
                          id={item?.autoGenId}
                        />
                      </Th>
                      <Td>{item?.type}</Td>
                      <Td className="text-capitalize">{`${item?.percentage ?? ''} ${(item?.option || '')
                        .split('_')
                        .join(' ')}`}</Td>
                      <Td>
                        <div className={`${item?.status === 'active' ? 'active-status' : 'inactive-status'}`}>
                          {`${item?.status === 'active' ? 'Active' : 'Inactive'}`}
                        </div>
                      </Td>
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
                            You want to delete this Deal.
                          </SweetAlert>
                        ) : null}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {loading && (
                <div className="text-center">
                  <Spinner animation="border" variant="info" />
                </div>
              )}
              {!loading && deals.length < 1 && (
                <div className="text-center">
                  <h4>No Data</h4>
                </div>
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default DealsList;
