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
        id
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
      history.push("/categories/list", { replace: true });
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
                        placeholder="Enter Category Slug"
                        value={slug}
                        onChange={(event) => setSlug(event.target.value)}
                      />
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
