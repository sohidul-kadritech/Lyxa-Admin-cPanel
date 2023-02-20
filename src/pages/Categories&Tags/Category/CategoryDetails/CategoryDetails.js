/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import Lightbox from 'react-image-lightbox';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table';
import { Button, Card, CardBody, CardTitle, Col, Container, Label, Row, Spinner } from 'reactstrap';
import { statusOptions, statusOptions2 } from '../../../../assets/staticData';
import AppPagination from '../../../../components/AppPagination';
import Breadcrumb from '../../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../../components/GlobalWrapper';
import Info from '../../../../components/Info';
import Search from '../../../../components/Search';
import ThreeDotsMenu from '../../../../components/ThreeDotsMenu';
import { successMsg } from '../../../../helpers/successMsg';
import { SINGLE_CATEGORY } from '../../../../network/Api';
import requestApi from '../../../../network/httpRequest';
import {
  addSubCategory,
  deleteSubCategory,
  editSubCategory,
  getAllSubCategory,
  updateSubCatSearchKey,
  updateSubCatStatusKey,
} from '../../../../store/Category/categoryAction';

function CategoryDetails() {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    loading,
    categories,
    subCategories,
    status,
    subPaging,
    subHasNextPage,
    subHasPreviousPage,
    subCurrentPage,
    subStatusKey,
    subSearchKey,
  } = useSelector((state) => state.categoryReducer);

  const [category, setCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [activeStatus, setActiveStatus] = useState('');

  const [subCatId, setSubCatId] = useState(null);
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState('');
  const [dynamic_description, setdynamic_description] = useState('');

  // Call Api for single Category
  const callApi = async (catId) => {
    const { data } = await requestApi().request(SINGLE_CATEGORY, {
      params: {
        id: catId,
      },
    });

    if (data.status) {
      setCategory(data.data.category);
    } else {
      history.push('/categories/list', { replace: true });
    }
  };

  useEffect(() => {
    if (id) {
      const findCategory = categories.find((cat) => cat._id === id);
      console.log({ findCategory });
      if (findCategory) {
        setCategory(findCategory);
      } else {
        callApi(id);
      }
      //   GET ALL SUB CATEGORY
      // callSubCategoryList(true, 1, id);
    }
  }, [id]);

  // eslint-disable-next-line default-param-last
  const callSubCategoryList = (refresh = false, catId) => {
    dispatch(getAllSubCategory(refresh, catId));
  };

  // GET SUB CATEGORY LIST
  useEffect(() => {
    if (id) {
      if (subSearchKey || subStatusKey) {
        callSubCategoryList(true, id);
      }
    }
  }, [id, subSearchKey, subStatusKey]);

  // EDIT SUB CATEGORY

  const handleEditSubCategory = (subId) => {
    setSubCatId(subId);
    const findSubCategory = subCategories.find((sub) => sub._id === subId);

    const { name, slug, status } = findSubCategory;
    const findStatus = statusOptions2.find((op) => op.value === status);

    setName(name);
    setSlug(slug);
    setActiveStatus(findStatus);

    window.scroll(0, 0);
  };

  // SUBMIT DATA
  const submitData = () => {
    const newSlug = slug.split(' ').join('');

    if (subCatId) {
      dispatch(
        editSubCategory({
          id: subCatId,
          name,
          status: activeStatus.value,
          slug: newSlug,
          category: id,
        })
      );
    } else {
      dispatch(
        addSubCategory({
          name,
          status: activeStatus.value,
          slug: newSlug,
          categoryId: id,
        })
      );
    }
  };

  //   SUBMIT SUB CATEGORY
  // eslint-disable-next-line consistent-return
  const submitSubCategory = () => {
    if (!name) {
      return successMsg('Enter Name');
    }

    if (!activeStatus) {
      return successMsg('Select Status');
    }

    submitData();
  };

  // UPLOAD IMAGE

  // IMAGE

  // SUCCESS

  useEffect(() => {
    if (status) {
      setName('');
      setSlug('');
      setActiveStatus('');
      setSubCatId(null);
    }
  }, [status]);

  // DELETE SUB CATEGORY

  const handleDelete = (subId) => {
    dispatch(deleteSubCategory(subId));
  };

  // HANDLE CHANGE NAME

  const handleChangeName = (e) => {
    setName(e.target.value);

    const generateSlug = e.target.value + Math.round(Math.random() * 100);
    setSlug(generateSlug);
  };

  // HANDLE MENU

  const handleMenu = (menu, item) => {
    if (menu === 'Delete') {
      setconfirm_alert(true);
    } else {
      handleEditSubCategory(item._id);
    }
  };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb
            maintitle="Lyxa"
            breadcrumbItem="Details"
            title="Category"
            loading={loading}
            callList={callSubCategoryList}
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

          <Row>
            <Col lg={7}>
              <Card>
                <CardBody>
                  <div
                    className="d-flex justify-content-between pb-2 w-100"
                    style={{ borderBottom: '1px solid lightgray' }}
                  >
                    <h5>Category Details</h5>
                    <button
                      type="button"
                      onClick={() => history.push(`/categories/edit/${id}`)}
                      className="btn btn-success"
                    >
                      Edit
                    </button>
                  </div>

                  <Row className="pt-3">
                    {category?.image && (
                      <Col md={6}>
                        <div className="d-flex justify-content-center align-items-center flex-wrap ">
                          <img
                            className="rounded-circle avatar-xl cursor-pointer"
                            alt="partner"
                            src={category?.image}
                            onClick={() => {
                              setSelectedImg(category?.image);
                              setIsOpen(true);
                            }}
                          />
                        </div>
                      </Col>
                    )}
                    <Col md={category?.image ? 6 : 12} className=" mt-5 mt-md-0">
                      <div className="ps-4 ">
                        <Info title="Name" value={category?.name} />
                        <Info title="Type" value={category?.type} />
                        <Info title="Status" value={category?.status} />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {category?.type !== 'food' && (
            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h5>{subCatId ? 'Edit' : 'Add'} Sub Category</h5>
                    <hr />
                    <div>
                      <div className="mb-2">
                        <Label>Name</Label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Sub Category Name"
                          value={name}
                          onChange={handleChangeName}
                        />
                      </div>
                      <div className="mb-2">
                        <Label>Status</Label>
                        <Select
                          onChange={(event) => {
                            setActiveStatus(event);
                          }}
                          value={activeStatus}
                          defaultValue=""
                          palceholder="Select Shop Type"
                          options={statusOptions2}
                          classNamePrefix="select2-selection"
                          required
                        />
                      </div>
                      <div className="d-flex justify-content-center">
                        <Button onClick={submitSubCategory} color="success" className="px-5">
                          {loading ? (
                            <Spinner animation="border" variant="info" size="sm" />
                          ) : subCatId ? (
                            'Edit'
                          ) : (
                            'Add'
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col lg={4}>
                        <div className="mb-4">
                          <label className="control-label">Status</label>
                          <Select
                            palceholder="Select Status"
                            options={statusOptions}
                            classNamePrefix="select2-selection"
                            required
                            value={subStatusKey}
                            onChange={(e) => dispatch(updateSubCatStatusKey(e))}
                          />
                        </div>
                      </Col>
                      <Col lg={8}>
                        <Search dispatchFunc={updateSubCatSearchKey} />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <CardTitle className="h4 mb-2">Sub Category List</CardTitle>

                    <Table id="tech-companies-1" className="table table-hover text-center">
                      <Thead>
                        <Tr>
                          <Th>SL</Th>
                          <Th>Name</Th>
                          <Th>Status</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody style={{ position: 'relative' }}>
                        {subCategories.map((item, index) => (
                          <Tr
                            key={item._id}
                            className="align-middle"
                            style={{
                              fontSize: '15px',
                              fontWeight: '500',
                            }}
                          >
                            <Td style={{ height: '50px', maxWidth: '100px' }}>{index + 1}</Td>

                            <Th>{item?.name}</Th>
                            <Td>{item?.status}</Td>
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
                                    handleDelete(item._id);
                                    setconfirm_alert(false);
                                    setsuccess_dlg(true);
                                    setdynamic_title('Deleted');
                                    setdynamic_description('Your file has been deleted.');
                                  }}
                                  onCancel={() => setconfirm_alert(false)}
                                >
                                  Are You Sure! You want to delete this Sub Category.
                                </SweetAlert>
                              ) : null}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                    {!loading && subCategories.length < 1 && (
                      <div className="text-center">
                        <h4>No Data...</h4>
                      </div>
                    )}
                    {loading && (
                      <div className="text-center">
                        <Spinner animation="border" color="info" />
                      </div>
                    )}
                  </CardBody>
                </Card>
                <div className="d-flex justify-content-center">
                  <AppPagination
                    paging={subPaging}
                    hasNextPage={subHasNextPage}
                    hasPreviousPage={subHasPreviousPage}
                    currentPage={subCurrentPage}
                    lisener={(page) => dispatch(callSubCategoryList(true, id, page))}
                  />
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default CategoryDetails;
