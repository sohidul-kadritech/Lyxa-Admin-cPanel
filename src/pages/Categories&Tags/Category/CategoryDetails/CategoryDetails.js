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
import { useParams, useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import requestApi from "../../../../network/httpRequest";
import { IMAGE_UPLOAD, SINGLE_CATEGORY } from "../../../../network/Api";
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
  updateSubCatStatusKey,
  updateSubCatSearchKey,
  deleteSubCategory,
} from "../../../../store/Category/categoryAction";
import AppPagination from "../../../../components/AppPagination";
import SweetAlert from "react-bootstrap-sweetalert";

const CategoryDetails = () => {
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
  const [selectedImg, setSelectedImg] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [image, setImage] = useState("");
  const [subCatId, setSubCatId] = useState(null);
  const [confirm_alert, setconfirm_alert] = useState(false);
  const [success_dlg, setsuccess_dlg] = useState(false);
  const [dynamic_title, setdynamic_title] = useState("");
  const [dynamic_description, setdynamic_description] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const options = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const filterOptions = [
    { label: "All", value: "all" },
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
        // console.log("api------------");
        callApi(id);
      }
      //   GET ALL SUB CATEGORY
      // callSubCategoryList(true, 1, id);
    }
  }, [id]);

  // GET SUB CATEGORY LIST

  useEffect(() => {
    if (id) {
      if (subSearchKey || subStatusKey) {
        callSubCategoryList(true, id);
      }
    }
  }, [id, subSearchKey, subStatusKey]);

  // Call Api for single Category

  const callApi = async (catId) => {
    const { data } = await requestApi().request(SINGLE_CATEGORY, {
      params: {
        id: catId,
      },
    });
    // console.log("from api", data);

    if (data.status) {
      setCategory(data.data.category);
    } else {
      history.push("/categories/list", { replace: true });
    }
  };

  const callSubCategoryList = (refresh = false, catId) => {
    dispatch(getAllSubCategory(refresh, catId));
  };

  // EDIT SUB CATEGORY

  const handleEditSubCategory = (subId) => {

    setSubCatId(subId);
    const findSubCategory = subCategories.find((sub) => sub._id == subId);

    const { name, slug, status, image } = findSubCategory;
    const findStatus = options.find((op) => op.value == status);

    setName(name);
    setSlug(slug);
    setImage(image);
    setActiveStatus(findStatus);

    window.scroll(0, 0);
  };

  // DEBOUNCE SEARCH

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      // const context = this;
      timer = setTimeout(() => {
        func(args[0]);
      }, delay);
    };
    // console.log("yes....");
  };

  const handleSearchChange = (event) => {
    // console.log("event", event.target.value)
    // setOpen(true);
    dispatch(updateSubCatSearchKey(event.target.value));
  };

  const searchKeyListener = debounce(handleSearchChange, 300);

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
    if (!image) {
      return toast.warn("Please  Select Image", {
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

    uploadImage();
  };

  // UPLOAD IMAGE

  const uploadImage = async () => {
    if (typeof image === "string") {
      submitData(image);
    } else {
      try {
        setIsLoading(true);
        let formData = new FormData();
        formData.append("image", image);
        // console.log({formData})
        const { data } = await requestApi().request(IMAGE_UPLOAD, {
          method: "POST",
          data: formData,
        });
        // console.log("image upload", data)
        if (data.status) {
          // submitData(data.data.url);
          setIsLoading(false);
          submitData(data.data.url);
        } else {
          console.log(data.error);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  // SUBMIT DATA

  const submitData = (url) => {
    const newSlug = slug.split(" ").join("");

    if (subCatId) {
      dispatch(
        editSubCategory({
          id: subCatId,
          name,
          status: activeStatus.value,
          slug: newSlug,
          image: url,
          category: id,
        })
      );
    } else {
      dispatch(
        addSubCategory({
          name,
          status: activeStatus.value,
          slug: newSlug,
          image: url,
          categoryId: id,
        })
      );
    }
  };

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  // IMAGE

  const handleAcceptedFiles = (files, type) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );

    setImage(files[0]);
  };

  // SUCCESS

  useEffect(() => {
    if (status) {
      setName("");
      setSlug("");
      setActiveStatus("");
      setSubCatId(null);
      setImage(null)
    }
  }, [status]);

  // DELETE SUB CATEGORY

  const handleDelete = (subId) => {
    dispatch(deleteSubCategory(subId));
  };

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
                      <Col md={6}>
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
            </Row>

            <Row>
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
                      <div className="mb-3">
                        <Label>Upload Image</Label>
                        <div>
                          <Form>
                            <Dropzone
                              onDrop={(acceptedFiles) => {
                                handleAcceptedFiles(acceptedFiles);
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
                              {image && (
                                <Card className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete">
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
                                          src={
                                            image.preview
                                              ? image.preview
                                              : image
                                          }
                                          alt=""
                                        />
                                      </Col>
                                      <Col>
                                        <Link
                                          to="#"
                                          className="text-muted font-weight-bold"
                                        >
                                          {image.name
                                            ? image.name
                                            : "Product Image"}
                                        </Link>
                                        <p className="mb-0">
                                          <strong>
                                            {image.formattedSize &&
                                              image.formattedSize}
                                          </strong>
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
                                          onClick={() => setImage(null)}
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
                              )}
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
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <Row>
                      <Col lg={4}>
                        <div className="mb-4">
                          <label className="control-label">Status</label>
                          <Select
                            palceholder="Select Status"
                            options={filterOptions}
                            classNamePrefix="select2-selection"
                            required
                            value={subStatusKey}
                            onChange={(e) => dispatch(updateSubCatStatusKey(e))}
                          />
                        </div>
                      </Col>
                      <Col lg={8}>
                        <label className="control-label">Search</label>
                        <SearchWrapper>
                          <div className="search__wrapper">
                            <i className="fa fa-search" />
                            <input
                              className="form-control"
                              type="search"
                              placeholder="Search Subcategory..."
                              id="search"
                              onChange={searchKeyListener}
                            />
                          </div>
                        </SearchWrapper>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

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
                          <Th>Status</Th>
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
                                      setSelectedImg(item?.image);
                                      setIsOpen(true);
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
                              <Td>{item.status}</Td>
                              <Td>
                                <div>
                                  <Tooltip title="Edit">
                                    <button
                                      className="btn btn-success me-3 button"
                                      onClick={() =>
                                        handleEditSubCategory(item._id)
                                      }
                                    >
                                      <i className="fa fa-edit" />
                                    </button>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <button
                                      className="btn btn-danger button"
                                      onClick={() => setconfirm_alert(true)}
                                    >
                                      <i className="fa fa-trash" />
                                    </button>
                                  </Tooltip>
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
                                        setdynamic_title("Deleted");
                                        setdynamic_description(
                                          "Your file has been deleted."
                                        );
                                      }}
                                      onCancel={() => setconfirm_alert(false)}
                                    >
                                      Are You Sure! You want to delete this
                                      Shop.
                                    </SweetAlert>
                                  ) : null}
                                </div>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                    {!loading && subCategories.length < 1 && (
                      <div className="text-center">
                        <h4>No Data...</h4>
                      </div>
                    )}
                    {loading && (
                      <div className="text-center">
                        <Spinner animation="border" variant="info" />
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col xl={12}>
                <div className="d-flex justify-content-center">
                  <AppPagination
                    paging={subPaging}
                    hasNextPage={subHasNextPage}
                    hasPreviousPage={subHasPreviousPage}
                    currentPage={subCurrentPage}
                    lisener={(page) =>
                      dispatch(callSubCategoryList(true, id, page))
                    }
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

const SearchWrapper = styled.div`
  border: 1px solid lightgray;
  border-radius: 6px;
  width: 100%;
  padding: 2px 7px;

  .search__wrapper {
    /* padding: 7px 10px; */
    display: flex;
    align-items: center;
    i {
      font-size: 15px;
    }
    input {
      border: none;
      color: black !important;
    }
  }
`;

export default CategoryDetails;
