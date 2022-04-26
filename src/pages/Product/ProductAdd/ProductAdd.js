import React, { useEffect, useMemo, useState } from "react";
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
import { addProduct, editProduct } from "../../../store/Product/productAction";
import { getAllShop } from "../../../store/Shop/shopAction";
import { useParams, useHistory, useLocation } from "react-router-dom";
import requestApi from "../../../network/httpRequest";
import { SINGLE_PRODUCT } from "../../../network/Api";

const ProductAdd = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const { search, pathname } = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const { categories, subCategories } = useSelector(
    (state) => state.categoryReducer
  );
  const { shops } = useSelector((state) => state.shopReducer);

  const { loading, products, status } = useSelector(
    (state) => state.productReducer
  );

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
  const [visibility, setVisibility] = useState(false)

  const [minQty, setMinQty] = useState(0);
  const [minDeliveryTime, setMinDeliveryTime] = useState(0);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState(0);

  useEffect(() => {
    if (id) {
      const findProduct = products.find((item) => item._id == id);

      if (findProduct) {
        console.log({ findProduct });
        setProductValue(findProduct);
      } else {
        callApi(id);
      }
    }
  }, [id]);

  useEffect(()=>{
    
    if(searchParams){
      const shopId = searchParams.get("shopId");
      if(shopId){
        const findShop = shops.find(item => item._id == shopId)
        setShop(findShop)
      }
    }
  },[searchParams])

  // CALL API FOR SINGLE PRODUCT

  const callApi = async (pId) => {
    if (pId) {
      const { data } = await requestApi().request(SINGLE_PRODUCT, {
        params: {
          id: pId,
        },
      });

      if (data.status) {
        setProductValue(data.data.product);
      }
    } else {
      history.push("/products/list", { replace: true });
    }
  };

  const setProductValue = (product) => {
    const {
      category,
      name,
      orderQuantityMinimum,
      images,
      maxDeliveryTime,
      minDeliveryTime,
      previousPrice,
      price,
      productVisibility,
      seoDescription,
      seoTags,
      seoTitle,
      shop,
      sku,
      slug,
      subCategory,
      type,
    } = product;

    setShop(shop);
    setCategory(category);
    setSubCategory(subCategory);
    setName(name);
    setSlug(slug);
    setSku(sku);
    setPreviousPrice(previousPrice);
    setPrice(price);
    setType(type);
    setSeoTitle(seoTitle);
    setSeoDescription(seoDescription);
    setMinQty(orderQuantityMinimum);
    setVisibility(productVisibility)
    setMinDeliveryTime(minDeliveryTime == null ? 0 : minDeliveryTime);
    setMaxDeliveryTime(maxDeliveryTime == null ? 0 : maxDeliveryTime);
    setTags({
      ...tags,
      items: seoTags,
    });
  };

  useEffect(() => {
    dispatch(getAllCategory(true));
    dispatch(getAllShop(true));
  }, []);

  useEffect(() => {
    if (category) {
      dispatch(getAllSubCategory(true, category._id));
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
      !category ||
      !subCategory ||
      !name ||
      !slug ||
      !sku ||
      previousPrice <= 0 ||
      price <= 0 ||
      !type ||
      !seoTitle ||
      !seoDescription ||
      tags.items.length < 1 ||
      !shop ||
      minQty <= 0 
      
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

    if(type == 'food' && (minDeliveryTime <= 0 || maxDeliveryTime <= 0)){
      return toast.warn("Please Add Min And Max Delivery Time", {
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



    // console.log(parseInt(minDeliveryTime), maxDeliveryTime)

    submitData();
  };

  const submitData = () => {
    const data = {
      name,
      slug: slug.split(" ").join(""),
      sku,
      previousPrice,
      price,
      type,
      shop: shop._id,
      orderQuantityMinimum: parseInt(minQty),
      images: [
        "https://productionservices.jumia.co.ke/wp-content/uploads/2018/01/product1.jpeg",
      ],
      category: category._id,
      subCategory: subCategory._id,
      minDeliveryTime: parseInt(minDeliveryTime),
      maxDeliveryTime: parseInt(maxDeliveryTime),
      seoTitle,
      seoDescription,
      seoTags: tags.items,

    };

    // console.log({data})
    if (id) {
      dispatch(
        editProduct({
          ...data,
          id,
          productVisibility: visibility
        })
      );
    } else {
      dispatch(addProduct(data));
    }
  };

  useEffect(() => {
    if(status){
      if (id) {
        history.push("/products/list");
      } else {
        setShop(null);
        setCategory(null);
        setSubCategory(null);
        setName("");
        setSlug("");
        setSku("");
        setPreviousPrice(0);
        setPrice(0);
        setType("");
        setSeoTitle("");
        setSeoDescription("");
        setMinQty(0);
        setMinDeliveryTime(0);
        setMaxDeliveryTime(0);
        setTags({
          items: [],
          value: "",
        });
      }
    }
  },[status]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={id ? "Edit" :"Add"}
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
                        onChange={(event) => setSlug(event.target.value)}
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
                          onChange={(event) => setType(event.target.value)}
                        >
                          <MenuItem value="food">Food</MenuItem>
                          <MenuItem value="grocery">Grocery</MenuItem>
                          <MenuItem value="pharmacy">Pharmacy</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    {type == "food" && (
                      <>
                        <div className="mb-4">
                          <TextField
                            id="delivery Time"
                            label="Minimum Delivery Time(minute)"
                            variant="outlined"
                            style={{ width: "100%" }}
                            autoComplete="off"
                            value={minDeliveryTime}
                            onChange={(event) =>
                              setMinDeliveryTime(event.target.value)
                            }
                            required
                            type="number"
                          />
                        </div>
                        <div className="mb-4">
                          <TextField
                            id="delivery Time"
                            label="Maximum Delivery Time(minute)"
                            variant="outlined"
                            style={{ width: "100%" }}
                            autoComplete="off"
                            value={maxDeliveryTime}
                            onChange={(event) =>
                              setMaxDeliveryTime(event.target.value)
                            }
                            required
                            type="number"
                          />
                        </div>
                      </>
                    )}
                    {id && <div className="mb-4">
                      <FormControl fullWidth required>
                        <InputLabel id="demo-simple-select-label">
                          Visibility
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={visibility}
                          label="Type"
                          onChange={(event) => setVisibility(event.target.value)}
                        >
                          <MenuItem value="true">True</MenuItem>
                          <MenuItem value="false">False</MenuItem>

                        </Select>
                      </FormControl>
                    </div>}
                  </Col>
                  <Col lg={6}>
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
                        id="minQty"
                        label="Minimum Order Quantity"
                        variant="outlined"
                        style={{ width: "100%" }}
                        autoComplete="off"
                        value={minQty}
                        onChange={(event) => setMinQty(event.target.value)}
                        required
                        type="number"
                      />
                    </div>

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
                    {loading ? (
                      <Spinner
                        animation="border"
                        variant="info"
                        size="sm"
                      ></Spinner>
                    ) 
                       : id ? (
                        "Edit"
                      ) :
                      "Add"
                    }
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
