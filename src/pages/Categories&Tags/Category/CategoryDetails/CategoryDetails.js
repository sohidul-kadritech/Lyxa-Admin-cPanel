import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../../components/GlobalWrapper";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
  Button,
  Label,
  Form,
} from "reactstrap";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import requestApi from "../../../../network/httpRequest";
import { SINGLE_CATEGORY } from "../../../../network/Api";
import Lightbox from "react-image-lightbox";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Tooltip from "@mui/material/Tooltip";
import Select from "react-select";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import {
  addSubCategory,
  getAllSubCategory,
  editSubCategory,
} from "../../../../store/Category/categoryAction";
import AppPagination from "../../../../components/AppPagination";

const CategoryDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const { loading, categories, subCategories, status, subPaging,
    subHasNextPage,
    subHasPreviousPage,
    subCurrentPage} = useSelector(
    (state) => state.categoryReducer
  );

  const [category, setCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [image, setImage] = useState("");
  const [subCatId, setSubCatId] = useState(null);

  const options = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  useEffect(() => {
    if (id) {
      const findCategory = categories.find((cat) => cat._id == id);
      console.log({ findCategory });
      if (findCategory) {
        setCategory(findCategory);
      } else {
        console.log("api------------");
        callApi(id);
      }
    }
  }, [id]);

  // Call Api for single Category

  const callApi = async (catId) => {
    const { data } = await requestApi().request(SINGLE_CATEGORY, {
      params: {
        id: catId,
      },
    });
    console.log("from api", data);

    if (data.status) {
      setCategory(data.data.category);
    } else {
      history.push("/categories/list", { replace: true });
    }
  };

  //   GET ALL SUB CATEGORY

  useEffect(() => {
    // console.log("call----------");
 
      callSubCategoryList(true, 1, id);
    
  }, []);

  const callSubCategoryList = (refresh = false, page = 1, catId) => {
    dispatch(getAllSubCategory(refresh, page, catId));
  };

  // EDIT SUB CATEGORY

  const handleEditSubCategory = (subId) => {
    // console.log({subId})
    setSubCatId(subId);
    const findSubCategory = subCategories.find((sub) => sub._id == subId);
    // console.log({findSubCategory})
    const {
      name,
      slug,
      status,
      image
    } = findSubCategory;
    const findStatus = options.find((op) => op.value == status);
    // console.log({ name });
    setName(name);
    setSlug(slug);
    setImage(image);
    setActiveStatus(findStatus);
    
    window.scroll(0, 0);
  };

  //   SUBMIT SUB CATEGORY

  const submitSubCategory = () => {
    if (!name) {
      return toast.warn("Please Enter  Name", {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (!slug) {
      return toast.warn("Please Enter Slug", {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    if (!activeStatus) {
      return toast.warn("Please  Select Status", {
        // position: "bottom-right",
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // if(!image) {
    //     return toast.warn("Please  Select Image", {
    //         // position: "bottom-right",
    //         position: toast.POSITION.TOP_RIGHT,
    //         autoClose: 3000,
    //         hideProgressBar: true,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //       });
    // }

    const newSlug = slug.split(" ").join("");

    if (subCatId) {
      dispatch(
        editSubCategory({
          id: subCatId,
          name,
          status: activeStatus.value,
          slug: newSlug,
          image:"https://media.istockphoto.com/photos/table-top-view-of-spicy-food-picture-id1316145932?b=1&k=20&m=1316145932&s=170667a&w=0&h=feyrNSTglzksHoEDSsnrG47UoY_XX4PtayUPpSMunQI=",
          category: id,
        })
      );
    } else {
      dispatch(
        addSubCategory({
          name,
          status: activeStatus.value,
          slug: newSlug,
          image:
            "https://media.istockphoto.com/photos/table-top-view-of-spicy-food-picture-id1316145932?b=1&k=20&m=1316145932&s=170667a&w=0&h=feyrNSTglzksHoEDSsnrG47UoY_XX4PtayUPpSMunQI=",
          categoryId: id,
        })
      );
    }
  };

  // SUCCESS

  useEffect(() => {
    if (status) {
      setName("");
      setSlug("");
      setActiveStatus("");
      setSubCatId(null);
    }
  }, [status]);

  

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Details"}
              title="Category"
              loading={loading}
              callList={callSubCategoryList}
            />

            {isOpen && (
              <Lightbox
                mainSrc={selectedImg}
                enableZoom={true}
                imageCaption="img"
                onCloseRequest={() => {
                  setIsOpen(!isOpen);
                }}
              />
            )}

            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <div
                      className="d-flex justify-content-between pb-2 w-100"
                      style={{ borderBottom: "1px solid lightgray" }}
                    >
                      <h5>Category Details</h5>
                      <button
                        onClick={() => history.push(`/categories/edit/${id}`)}
                        className="btn btn-success"
                      >
                        Edit
                      </button>
                    </div>

                    <Row className="pt-3">
                      <Col
                        md={6}

                        // style={{  borderRight: width > 1200 ?  "1px solid lightgray" : "none"}}
                      >
                        {category ? (
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
                        ) : null}
                      </Col>
                      <Col md={6} className=" mt-5 mt-md-0">
                        <div className="ps-4 ">
                          <Details>
                            <h5>Name:</h5>
                            <Value>{category?.name}</Value>
                          </Details>
                          <Details>
                            <h5>Slug:</h5>
                            <Value>{category?.slug}</Value>
                          </Details>
                          <Details>
                            <h5>Type:</h5>
                            <Value>{category?.type}</Value>
                          </Details>
                          <Details>
                            <h5>Status:</h5>
                            <Value>{category?.status}</Value>
                          </Details>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <h5>{subCatId ? "Edit" : "Add"} Sub Category</h5>
                    <hr />
                    <div>
                      <div className="mb-2">
                        <Label>Name</Label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Sub Category Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="mb-2">
                        <Label>Slug</Label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter Sub Category Slug"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                        />
                      </div>
                      <div className="mb-2">
                        <Label>Status</Label>
                        <Select
                          onChange={(event) => {
                            setActiveStatus(event);
                          }}
                          value={activeStatus}
                          defaultValue={""}
                          palceholder="Select Shop Type"
                          options={options}
                          classNamePrefix="select2-selection"
                          required
                        />
                      </div>
                      <div>
                        <Label>Upload Image</Label>
                        <div className="mb-5">
                          <Form>
                            <Dropzone
                              onDrop={(acceptedFiles) => {
                                // handleAcceptedFiles(acceptedFiles);
                              }}
                            >
                              {({ getRootProps, getInputProps }) => (
                                <div className="dropzone">
                                  <div
                                    className="dz-message needsclick"
                                    {...getRootProps()}
                                    // onClick={() => setmodal_fullscreen(true)}
                                  >
                                    <input {...getInputProps()} />
                                    <div className="mb-3">
                                      <i className="mdi mdi-cloud-upload display-4 text-muted"></i>
                                    </div>
                                    <h4>Drop files here or click to upload.</h4>
                                  </div>
                                </div>
                              )}
                            </Dropzone>
                            <div
                              className="dropzone-previews mt-3"
                              id="file-previews"
                            >
                              {/* {selectedFiles.map((f, i) => {
                          return (
                            <Card
                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                            >
                              <div className="p-2">
                                <Row className="align-items-center position-relative">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      // height="80"
                                      style={{
                                        maxWidth: "80px",
                                      }}
                                      className=" bg-light"
                                      alt={f.name}
                                      src={f.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {f.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{f.formattedSize}</strong>
                                    </p>
                                  </Col>

                                  <div
                                    className="position-absolute"
                                    style={{
                                      left: "0px",
                                      top: "0px",
                                      width: "100%",
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <i
                                      // onClick={() => removeSelection(i)}
                                      className="mdi mdi-delete text-danger "
                                      style={{
                                        fontSize: "25px",
                                        cursor: "pointer",
                                      }}
                                    ></i>
                                  </div>
                                </Row>
                              </div>
                            </Card>
                          );
                        })} */}
                            </div>
                          </Form>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center">
                        <Button
                          onClick={submitSubCategory}
                          color="success"
                          className="px-5"
                        >
                          {loading ? (
                            <Spinner
                              animation="border"
                              variant="info"
                              size="sm"
                            />
                          ) : subCatId ? (
                            "Edit"
                          ) : (
                            "Add"
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Card>
              <CardBody>
                <CardTitle className="h4 mb-2">Sub Category List</CardTitle>

                <Table
                  id="tech-companies-1"
                  className="table table__wrapper table-striped table-bordered table-hover text-center"
                >
                  <Thead>
                    <Tr>
                      <Th>Image</Th>
                      <Th>Name</Th>
                      <Th>Slug</Th>
                      <Th>Status</Th>
                      <Th>Created At</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody style={{ position: "relative" }}>
                    {subCategories.map((item, index) => {
                      return (
                        <Tr
                          key={index}
                          className="align-middle"
                          style={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          <Th>
                            <div style={{ height: "50px" }}>
                              <img
                                onClick={() => {
                                  //   setIsZoom(true);
                                  //   setCatImg(item.image);
                                }}
                                className="img-fluid cursor-pointer"
                                alt=""
                                src={item.image}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                          </Th>

                          <Td>{item.name}</Td>
                          <Td>{item.slug}</Td>
                          <Td>{item.status}</Td>
                          <Td>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </Td>
                          <Td>
                            <div>
                              <Tooltip title="Edit">
                                <button
                                  className="btn btn-success me-3 button"
                                  onClick={() => handleEditSubCategory(item._id)}
                                >
                                  <i className="fa fa-edit" />
                                </button>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <button
                                  className="btn btn-danger button"
                                  // onClick={() => handleEditSubCategory(item._id)}
                                >
                                  <i className="fa fa-trash" />
                                </button>
                              </Tooltip>
                            </div>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
                {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="info" />
                  </div>
                )}
              </CardBody>
            </Card>
            <Row>
              <Col xl={12}>
                <div className="d-flex justify-content-center">
                  <AppPagination
                    paging={subPaging}
                    hasNextPage={subHasNextPage}
                    hasPreviousPage={subHasPreviousPage}
                    currentPage={subCurrentPage}
                    lisener={(page) => dispatch(callSubCategoryList(true, page, id))}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

const Details = styled.div`
  display: flex;
  /* justify-content: space-between; */
`;

const Value = styled.h5`
  color: lightcoral;
  font-style: italic;
  font-weight: 500;
  margin-left: 4px;
  /* padding-left: 5px; */
`;

export default CategoryDetails;
