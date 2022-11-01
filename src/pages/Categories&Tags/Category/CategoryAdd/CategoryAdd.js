import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import Breadcrumb from "../../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../../components/GlobalWrapper";
import Select from "react-select";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../../../store/Category/categoryAction";
import { useParams, useHistory, Link } from "react-router-dom";
import requestApi from "./../../../../network/httpRequest";

import { SINGLE_CATEGORY } from "../../../../network/Api";
import { editCategory } from "./../../../../store/Category/categoryAction";
import { IMAGE_UPLOAD } from "./../../../../network/Api";
import { shopTypeOptions2 } from "../../../../assets/staticData";
import formatBytes from "../../../../common/imageFormatBytes";
import { successMsg } from "../../../../helpers/successMsg";
import { callApi } from "../../../../components/SingleApiCall";

const CategoryAdd = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const { loading, status, categories } = useSelector(
    (state) => state.categoryReducer
  );

  const { account_type, shopType = '', sellerType = '' } = JSON.parse(
    localStorage.getItem("admin")
  );

  const [name, setName] = useState("");
  const [type, setType] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (account_type === "shop" || account_type === "seller") {
      const finType = shopTypeOptions2.find(
        (item) => item.value === shopType
      )
      setType(finType);
    }

    return;
  }, [account_type]);

  useEffect(async () => {
    if (id) {
      const findCat = categories.find((item) => item._id == id);

      if (findCat) {
        setCategoryData(findCat);

      } else {
        const data = await callApi(id, SINGLE_CATEGORY, 'category')
        if (data) {
          setCategoryData(data);
        } else {
          history.push("/categories/list", { replace: true });
        }
      }
    }
  }, [id]);



  // SET DATA TO STATE

  const setCategoryData = (item) => {
    const { name, type, category: { image } } = item;

    const findTypeObj = shopTypeOptions2.find((x) => x.value == type);
    setName(name);
    setType(findTypeObj);
    setImage(image);


  };

  // HANDLE SUBMIT

  const handleSubmit = () => {
    if (!name) {
      return successMsg("Enter category name", "error");
    }
    if (!type) {
      return successMsg("Enter category type", "error");
    }
    if (type.value !== 'food') {
      return successMsg("Upload Image", "error");
    }


    if (image) {
      uploadImage();
    } else {
      submitData();
    }
  };

  const uploadImage = async () => {
    if (typeof image === "string") {
      submitData(image);
    } else {
      try {
        setIsLoading(true);
        let formData = new FormData();
        formData.append("image", image);

        const { data } = await requestApi().request(IMAGE_UPLOAD, {
          method: "POST",
          data: formData,
        });

        setIsLoading(false);
        if (data.status) {
          submitData(data.data.url);
        } else {
          successMsg(data.error, 'error')
        }
      } catch (error) {
        successMsg(error.message, 'error')
      }
    }
  };

  // SUBMIT DATA

  const submitData = (url) => {
    const data = {
      name,
      image: url,
      type: type.value,
      userType: account_type
    }
    if (id) {
      dispatch(
        editCategory({
          ...data,
          id

        })
      );
    } else {
      dispatch(
        addCategory(data)
      );
    }
  };

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

  useEffect(() => {
    if (status) {
      if (id) {
        history.goBack();
      } else {
        setName("");
        setType(account_type !== "shop" ? null : type);
        setImage(null);
        window.scroll(0, 0);
      }
    }
  }, [status]);

  // HANDLE CHANGE NAME

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Lyxa"
              breadcrumbItem={id ? "Update" : "Add"}
              title="Category"
              isRefresh={false}
            />

            <Card>
              <CardBody>
                <div className="mb-3">
                  <h5>Category Informations</h5>
                  <hr />
                </div>
                <Row>
                  <Col lg={6}>
                    <div>
                      <Label>Name</Label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </Col>
                  {(account_type !== "shop" && account_type !== "seller") && (
                    <Col lg={6} className="mt-3 mt-lg-0">
                      <Label>Shop Type</Label>
                      <Select
                        onChange={(event) => {
                          setType(event);
                        }}
                        value={type}
                        defaultValue={""}
                        palceholder="Select Shop Type"
                        options={shopTypeOptions2}
                        classNamePrefix="select2-selection"
                        required
                      />
                    </Col>
                  )}
                </Row>

                {type?.value !== "food" && (
                  <Row className="my-4">
                    <Col>
                      <Label>Category Image</Label>
                      <div>
                        <Form>
                          <Dropzone
                            onDrop={(acceptedFiles) => {
                              handleAcceptedFiles(acceptedFiles);
                            }}
                            accept='.jpg, .jpeg, .png'
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
                                          image.preview ? image.preview : image
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
                    </Col>
                  </Row>
                )}

                <div className="my-4 d-flex justify-content-center">
                  <Button
                    color="primary"
                    className="px-5"
                    onClick={handleSubmit}
                    disabled={loading || isLoading}
                  >
                    {loading || isLoading ? (
                      <Spinner
                        animation="border"
                        variant="info"
                        size="sm"
                      ></Spinner>
                    ) : id ? (
                      "Update"
                    ) : (
                      "Add"
                    )}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default CategoryAdd;
