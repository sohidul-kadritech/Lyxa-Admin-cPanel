import React, { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";

import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllSeller } from "../../../store/Seller/sellerAction";
import {
  getAllCategory,
  getAllSubCategory,
} from "../../../store/Category/categoryAction";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { addProduct } from "../../../store/Product/productAction";
import { getAllShop } from "../../../store/Shop/shopAction";

const ProductAdd = () => {
  const shopTypeOptions = [
    { label: "Food", value: "food" },
    { label: "Grocery", value: "grocery" },
    { label: "Pharmacy", value: "pharmacy" },
  ];

  const dispatch = useDispatch();

  const { sellers } = useSelector((state) => state.sellerReducer);
  const { categories, subCategories } = useSelector(
    (state) => state.categoryReducer
  );
  const {
    shops,

  } = useSelector((state) => state.shopReducer);

  const [seller, setSeller] = useState(null);
  const [searchSellerKey, setSearchSellerKey] = useState("");
  const [shop, setShop] = useState(null);
  const [searchShopKey, setSearchShopKey] = useState("");
  const [category, setCategory] = useState(null);
  const [searchCategoryKey, setSearchCategoryKey] = useState("");
  const [subCategory, setSubCategory] = useState(null);
  const [searchSubCatKey, setSearchSubCatKey] = useState("");
  const [tags, setTags] = useState({
    items: [],
    value: "",
  });
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [previousPrice, setPreviousPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [type, setType] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  useEffect(() => {
    dispatch(getAllSeller(true));
    dispatch(getAllCategory(true));
    dispatch(getAllShop(true));
  }, []);

  useEffect(() => {
    if (category) {
      dispatch(getAllSubCategory(true, 0, category._id));
    }
  }, [category]);

  // TAGS

  const handleTagAdd = (evt) => {
    // console.log(evt.key);
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();

      let value = tags.value.trim();

      if (value) {
        setTags({
          items: [...tags.items, tags.value],
          value: "",
        });
      }
    }
  };

  const handleTagChange = (evt) => {
    setTags({
      ...tags,
      value: evt.target.value,
    });
    // console.log(tags);
  };

  const handleTagDelete = (item) => {
    setTags({
      ...tags,
      items: tags.items.filter((i) => i != item),
    });
  };

  const submitProduct = () => {
    if (
      !seller ||
      !category ||
      !subCategory ||
      !name ||
      !slug ||
      !sku ||
      !previousPrice ||
      !price ||
      !type ||
      !seoTitle ||
      !seoDescription ||
      tags.items.length < 1 || !shop
    ) {
      return toast.warn("Please Fillup All Fields", {
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

    submitData();
  };

  const submitData = () => {



    const data = {
      name,
      slug : slug.split(" ").join(""),
      sku,
      previousPrice,
      price,
      type,
      seller: seller._id,
      shop: shop._id,
    //   orderQuantityMinimum: 200,
      images: [
        "https://productionservices.jumia.co.ke/wp-content/uploads/2018/01/product1.jpeg",
      ],
      category: category._id,
      subCategory: subCategory._id,
    //   minDeliveryTime: 30,
    //   maxDeliveryTime: 80,
      seoTitle,
      seoDescription,
      seoTags: tags.items,
    };

    dispatch(addProduct(data));
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Add"}
              title="Product"
              //   loading={loading}
              //   callList={callShopList}
              isRefresh={false}
            />

            <Card>
              <CardBody>
                <CardTitle>Product Informations</CardTitle>
                <hr />
                <Row>
                  <Col lg={6}>
                    <div className="mb-4">
                      <TextField
                        id="name"
                        label="Name"
                        variant="outlined"
                        style={{ width: "100%" }}
                        autoComplete="off"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        id="slug"
                        label="Slug"
                        variant="outlined"
                        style={{ width: "100%" }}
                        autoComplete="off"
                        value={slug}
                        onChange={(event) =>
                          setSlug(event.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        id="sku"
                        label="SKU"
                        variant="outlined"
                        style={{ width: "100%" }}
                        autoComplete="off"
                        value={sku}
                        onChange={(event) => setSku(event.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        id="previousPrice"
                        label="Previous Price"
                        variant="outlined"
                        style={{ width: "100%" }}
                        autoComplete="off"
                        value={previousPrice}
                        onChange={(event) =>
                          setPreviousPrice(event.target.value)
                        }
                        required
                        type="number"
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        id="netPrice"
                        label="Net Price"
                        variant="outlined"
                        style={{ width: "100%" }}
                        autoComplete="off"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        required
                        type="number"
                      />
                    </div>
                    <div className="mb-4">
                      <FormControl fullWidth required>
                        <InputLabel id="demo-simple-select-label">
                          Type
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={type}
                          label="Type"
                          onChange={(event) =>
                            setType(event.target.value)
                          }
                        >
                          <MenuItem value="food">Food</MenuItem>
                          <MenuItem value="grocery">Grocery</MenuItem>
                          <MenuItem value="pharmacy">Pharmacy</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </Col>
                  <Col lg={6}>
                    <div className="mb-4">
                      <Autocomplete
                        className="cursor-pointer"
                        value={seller}
                        onChange={(event, newValue) => {
                          setSeller(newValue);
                          // console.log("new", newValue);
                        }}
                        getOptionLabel={(option) =>
                          option.name ? option.name : ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option._id == value._id
                        }
                        inputValue={searchSellerKey}
                        onInputChange={(event, newInputValue) => {
                          setSearchSellerKey(newInputValue);
                          // console.log("input value", newInputValue);
                        }}
                        id="controllable-states-demo"
                        options={sellers.length > 0 ? sellers : []}
                        sx={{ width: "100%" }}
                        renderInput={(params) => (
                          <TextField {...params} label="Select a Seller" />
                        )}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                            {...props}
                          >
                            <img
                              loading="lazy"
                              width="60"
                              src={option.profile_photo}
                              alt=""
                            />
                            {option.name}
                          </Box>
                        )}
                      />
                    </div>
                    <div className="mb-4">
                      <Autocomplete
                        className="cursor-pointer"
                        value={shop}
                        onChange={(event, newValue) => {
                          setShop(newValue);
                          // console.log("new", newValue);
                        }}
                        getOptionLabel={(option) =>
                          option.shopName ? option.shopName : ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option._id == value._id
                        }
                        inputValue={searchShopKey}
                        onInputChange={(event, newInputValue) => {
                          setSearchShopKey(newInputValue);
                          // console.log("input value", newInputValue);
                        }}
                        id="controllable-states-demo"
                        options={shops.length > 0 ? shops : []}
                        sx={{ width: "100%" }}
                        renderInput={(params) => (
                          <TextField {...params} label="Select a Shop" />
                        )}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                            {...props}
                          >
                            <img
                              loading="lazy"
                              width="60"
                              src={option.shopBanner}
                              alt=""
                            />
                            {option.shopName}
                          </Box>
                        )}
                      />
                    </div>

                    <div className="mb-4">
                      <Autocomplete
                        className="cursor-pointer"
                        value={category}
                        onChange={(event, newValue) => {
                          setCategory(newValue);
                          // console.log("new", newValue);
                        }}
                        getOptionLabel={(option) =>
                          option.name ? option.name : ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option._id == value._id
                        }
                        inputValue={searchCategoryKey}
                        onInputChange={(event, newInputValue) => {
                          setSearchCategoryKey(newInputValue);
                          // console.log("input value", newInputValue);
                        }}
                        id="controllable-states-demo"
                        options={categories.length > 0 ? categories : []}
                        sx={{ width: "100%" }}
                        renderInput={(params) => (
                          <TextField {...params} label="Select a Category" />
                        )}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                            {...props}
                          >
                            <img
                              loading="lazy"
                              width="60"
                              src={option.image}
                              alt=""
                            />
                            {option.name}
                          </Box>
                        )}
                      />
                    </div>
                    {category && (
                      <div className="mb-4">
                        <Autocomplete
                          className="cursor-pointer"
                          value={subCategory}
                          onChange={(event, newValue) => {
                            setSubCategory(newValue);
                            // console.log("new", newValue);
                          }}
                          getOptionLabel={(option) =>
                            option.name ? option.name : ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.id == value.id
                          }
                          inputValue={searchSubCatKey}
                          onInputChange={(event, newInputValue) => {
                            setSearchSubCatKey(newInputValue);
                            // console.log("input value", newInputValue);
                          }}
                          id="controllable-states-demo"
                          options={
                            subCategories.length > 0 ? subCategories : []
                          }
                          sx={{ width: "100%" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select a Sub Category"
                            />
                          )}
                          renderOption={(props, option) => (
                            <Box
                              component="li"
                              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                              {...props}
                            >
                              <img
                                loading="lazy"
                                width="60"
                                src={option.image}
                                alt=""
                              />
                              {option.name}
                            </Box>
                          )}
                        />
                      </div>
                    )}
                    <div className="mb-4">
                      <TextField
                        id="seo"
                        label="SEO Title"
                        variant="outlined"
                        style={{ width: "100%" }}
                        autoComplete="off"
                        value={seoTitle}
                        onChange={(event) => setSeoTitle(event.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        id="seoTag"
                        label="SEO Tags"
                        variant="outlined"
                        style={{ width: "100%" }}
                        autoComplete="off"
                        onKeyDown={handleTagAdd}
                        onChange={handleTagChange}
                        value={tags.value}
                        //   onChange={(event) => setName(event.target.value)}
                        required
                      />
                      {tags.items.length > 0 && (
                        <Paper className="mt-4 p-3">
                          {tags.items.map((item, index) => (
                            <TagWrapper className="tag-item" key={index}>
                              {item}
                              <button
                                type="button"
                                className="button"
                                onClick={() => handleTagDelete(item)}
                              >
                                &times;
                              </button>
                            </TagWrapper>
                          ))}
                        </Paper>
                      )}
                    </div>

                    <div className="mb-4">
                      <TextField
                        id="seo"
                        label="SEO Drescription"
                        variant="outlined"
                        style={{ width: "100%" }}
                        autoComplete="off"
                        value={seoDescription}
                        onChange={(event) =>
                          setSeoDescription(event.target.value)
                        }
                        required
                        multiline
                        rows={4}
                      />
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Label>Product Images</Label>
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

                <div className="my-5 d-flex justify-content-center">
                  <Button
                    onClick={submitProduct}
                    color="primary"
                    className="px-5"
                  >
                    {/* {loading ? (
                      <Spinner
                        animation="border"
                        variant="info"
                        size="sm"
                      ></Spinner>
                    ) : id ? (
                      "Edit"
                    ) : (
                      "Add"
                    )} */}
                    Add
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

const TagWrapper = styled.div`
  background-color: #d4d5d6;
  display: inline-block;
  font-size: 14px;
  border-radius: 30px;
  height: 30px;
  padding: 0 4px 0 1rem;
  display: inline-flex;
  align-items: center;
  margin: 0 0.3rem 0.3rem 0;

  .button {
    background-color: white;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font: inherit;
    margin-left: 10px;
    font-weight: bold;
    padding: 0;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export default ProductAdd;
