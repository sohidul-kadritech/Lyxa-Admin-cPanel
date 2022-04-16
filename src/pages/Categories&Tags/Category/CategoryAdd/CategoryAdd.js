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
import { useParams, useHistory } from "react-router-dom";
import requestApi from "./../../../../network/httpRequest";

import { SINGLE_CATEGORY } from "../../../../network/Api";
import { editCategory } from "./../../../../store/Category/categoryAction";

const CategoryAdd = () => {
  const options = [
    { label: "Pharmacy", value: "pharmacy" },
    { label: "Grocery", value: "grocery" },
    { label: "Food", value: "food" },
  ];

  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const { loading, status, categories } = useSelector(
    (state) => state.categoryReducer
  );

  const [name, setName] = useState("");
  const [type, setType] = useState(null);
  const [slug, setSlug] = useState("");

  useEffect(() => {
    if (id) {
      const findCat = categories.find((item) => item._id == id);
      // console.log({ findAdmin });
      if (findCat) {
        const { name, type, slug, image } = findCat;

        const findTypeObj = options.find((x) => x.value == type);
        //  console.log({adminEmail})
        setName(name);
        setType(findTypeObj);
        setSlug(slug);
      } else {
        callApi(id);
      }
    }
  }, [id]);

  // CALL API FOR SINGLE ADMIN

  const callApi = async (id) => {
    const { data } = await requestApi().request(SINGLE_CATEGORY, {
      params: {
        id,
      },
    });
    // console.log("from api", data);

    if (data.status) {
      const { name, type, slug, image } = data.data.category;
      //  console.log({adminEmail})
      const findTypeObj = options.find((x) => x.value == type);
      setName(name);
      setType(findTypeObj);
      setSlug(slug);
    } else {
      history.push("/admin/list", { replace: true });
    }
  };

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

    const newSlug = slug.split(" ").join("");

    if (id) {
      dispatch(
        editCategory({
          id,
          name,
          slug: newSlug,
          image:
            "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?cs=srgb&dl=pexels-pixabay-270348.jpg&fm=jpg",
          type: type.value,
        })
      );
    } else {
      dispatch(
        addCategory({
          name,
          slug: newSlug,
          image:
            "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?cs=srgb&dl=pexels-pixabay-270348.jpg&fm=jpg",
          type: type.value,
        })
      );
    }
  };

  useEffect(() => {
    if (status) {
      if (id) {
        history.goBack();
      } else {
        setName("");
        setSlug("");
        setType(null);
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
                      options={options}
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
                        placeholder="Enter Category Name"
                        value={slug}
                        onChange={(event) => setSlug(event.target.value)}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="pt-3">
                  <Col className="col-12">
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
                  </Col>
                </Row>

                <div className="my-4 d-flex justify-content-center">
                  <Button
                    color="primary"
                    className="px-5"
                    onClick={handleSubmit}
                  >
                    {loading ? (
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
