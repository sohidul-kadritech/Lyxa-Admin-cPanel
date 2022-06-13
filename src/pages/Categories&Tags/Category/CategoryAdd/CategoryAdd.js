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
import { IMAGE_UPLOAD } from './../../../../network/Api';
import { shopTypeOptions2 } from "../../../../assets/staticData";
import formatBytes from "../../../../common/imageFormatBytes";

const CategoryAdd = () => {
  

  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const { loading, status, categories } = useSelector(
    (state) => state.categoryReducer
  );

  const [name, setName] = useState("");
  const [type, setType] = useState(null);
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const findCat = categories.find((item) => item._id == id);
      // console.log({ findAdmin });
      if (findCat) {
         setCategoryData(findCat)
        
      } else {
        callApi(id);
      }
    }
  }, [id]);

  // CALL API FOR SINGLE ADMIN

  const callApi = async (id) => {
    const { data } = await requestApi().request(SINGLE_CATEGORY, {
      params: {
        id
      },
    });
    // console.log("from api", data);

    if (data.status) {
      setCategoryData(data.data.category)
    } else {
      history.push("/categories/list", { replace: true });
    }
  };

  // SET DATA TO STATE

  const setCategoryData = (item) => {
    const { name, type, slug, image } = item;

    const findTypeObj = shopTypeOptions2.find((x) => x.value == type);
    //  console.log({adminEmail})
    setName(name);
    setType(findTypeObj);
    setSlug(slug);
    setImage(image)
  }

  // HANDLE SUBMIT

  const handleSubmit = () => {
    if (!name || !type || !slug) {
      return toast.warn("Please Fill Up All Fields", {
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

    uploadImage()

    
  };

  const uploadImage = async () => {
    
    if(typeof image === 'string') {
      submitData(image);
    }else{
      try {
        setIsLoading(true)
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
          setIsLoading(false)
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

  const submitData = (url) =>{
    const newSlug = slug.split(" ").join("");
    if (id) {
      dispatch(
        editCategory({
          id,
          name,
          slug: newSlug,
          image: url,
          type: type.value,
        })
      );
    } else {
      dispatch(
        addCategory({
          name,
          slug: newSlug,
          image: url,
          type: type.value,
        })
      );
    }
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

  useEffect(() => {
    if (status) {
      if (id) {
        history.goBack();
      } else {
        setName("");
        setSlug("");
        setType(null);
        setImage(null)
        window.scroll(0, 0);
      }
    }
  }, [status]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={id ? "Update" : "Add"}
              title="Category"
              // loading={loading}
              // callList={callCarList}
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
                  <Col lg={6} className="mt-3 mt-lg-0">
                    <Label>Shop Type</Label>
                    <Select
                      // value={country}
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
                </Row>

                <Row className="mt-3">
                  <Col lg={6}>
                    <div>
                      <Label>Slug</Label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Category Slug"
                        value={slug}
                        onChange={(event) => setSlug(event.target.value)}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="my-4">
                  <Col>
                    <Label>Category Image</Label>
                    <div >
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
