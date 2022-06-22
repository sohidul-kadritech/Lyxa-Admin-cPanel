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

import {
  getAllCategory,
  getAllSubCategory,
  updateCategoryShopType,
} from "../../../store/Category/categoryAction";

import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { addProduct, editProduct } from "../../../store/Product/productAction";
import {
  getAllShop,
  updateShopSearchKey,
} from "../../../store/Shop/shopAction";
import { useParams, useHistory, useLocation, Link } from "react-router-dom";
import requestApi from "../../../network/httpRequest";
import { IMAGE_UPLOAD, SINGLE_PRODUCT } from "../../../network/Api";
import { foodTypeOptions2, shopTypeOptions2 } from "../../../assets/staticData";
import { updateShopType } from "./../../../store/Shop/shopAction";
import formatBytes from "../../../common/imageFormatBytes";
import ShopAutocompleted from "../../../components/ShopAutocompleted";
import { successMsg } from "../../../helpers/successMsg";
import SelectOption from "../../../components/SelectOption";

const ProductAdd = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const { search } = useLocation();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const { categories, subCategories } = useSelector(
    (state) => state.categoryReducer
  );
  const { shops, searchKey, typeKey } = useSelector(
    (state) => state.shopReducer
  );

  const { loading, products, status } = useSelector(
    (state) => state.productReducer
  );

  const [shop, setShop] = useState(null);
  const [cuisines, setCuisines] = useState(null);
  const [cuisineSearchKey, setCuisineSearchKey] = useState("");
  const [searchShopKey, setSearchShopKey] = useState("");
  const [category, setCategory] = useState(null);
  const [searchCategoryKey, setSearchCategoryKey] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [searchSubCatKey, setSearchSubCatKey] = useState("");
  const [tags, setTags] = useState({
    items: [],
    value: "",
  });
  const [name, setName] = useState("");
  const [foodType, setFoodType] = useState("");
  const [discount, setDiscount] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [activeStatus, setActiveStatus] = useState("");
  const [image, setImage] = useState(null);
  const [isNeedAddon, setIsNeedAddon] = useState(false);
  const [addons, setAddons] = useState([]);
  const [productSearchKey, setProductSearchKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNeedAttribute, setIsNeedAttribute] = useState(false);
  const [attributeName, setAttributeName] = useState("");
  const [isRequiredAttribute, setIsRequiredAttribute] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [attributeItems, setAttributeItems] = useState([
    {
      name: "",
      extraPrice: 0,
    },
  ]);

  useEffect(() => {
    if (id) {
      const findProduct = products.find((item) => item._id == id);

      if (findProduct) {
        setProductValue(findProduct);
      } else {
        callApi(id);
      }
    }
  }, [id]);

  useEffect(() => {
    if (searchParams) {
      const shopId = searchParams.get("shopId");
      if (shopId) {
        const findShop = shops.find((item) => item._id == shopId);

        setType(findShop.shopType);
        setShop(findShop);
      }
    }
  }, [searchParams]);

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

  // SET PRODUCT VALUE
  const setProductValue = (product) => {
    const {
      category,
      name,
      images,
      price,
      productVisibility,
      seoDescription,
      tags,
      seoTitle,
      shop,
      subCategory,
      type,
      foodType,
      addons,
      attributes,
      status,
      discount,
    } = product;

    setShop(shop);
    setCategory(category);
    setSubCategory(subCategory);
    setName(name);
    setDiscount(discount);
    setPrice(price);
    setType(type);
    setSeoTitle(seoTitle);
    setSeoDescription(seoDescription);
    setVisibility(productVisibility);
    setFoodType(foodType ?? "");
    setTags({
      ...tags,
      items: tags,
    });
    setImage(images[0]);
    setAddons(addons);
    setAttributes(attributes);
    setActiveStatus(status);
  };

  // ALL CATEGORY LIST

  useEffect(() => {
    if (type) {
      dispatch(getAllCategory(true));
    }
  }, [type]);

  // ALL SHOP LIST
  useEffect(() => {
    if (type || typeKey || searchKey) {
      dispatch(getAllShop(true));
    }
  }, [type, typeKey, searchKey]);

  // ALL SUB CATEGORY LIST

  useEffect(() => {
    if (category) {
      dispatch(getAllSubCategory(true, category._id));
    }
  }, [category]);

  // TAGS

  const handleTagAdd = (evt) => {
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

  // TAG CHANGE

  const handleTagChange = (evt) => {
    setTags({
      ...tags,
      value: evt.target.value,
    });
  };

  const handleTagDelete = (item) => {
    setTags({
      ...tags,
      items: tags.items.filter((i) => i != item),
    });
  };

  // VALIDATION

  const submitProduct = (e) => {
    e.preventDefault();

    if (tags.items.length < 1) {
      return successMsg("Please add at least one tag", "error");
    }

    if (!image) {
      return successMsg("Please Upload Image", "error");
    }

    uploadImage();
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
          return successMsg(data.error, "error");
        }
      } catch (error) {
        setIsLoading(false);
        return successMsg(error.message, "error");
      }
    }
  };

  // SUBMIT DATA TO SERVER
  const submitData = (url) => {
    const addonsData = addons.map((item) => item._id);
    const data = {
      name,
      discount,
      price,
      foodType,
      shop: shop._id,
      images: [url],
      category: category._id,
      subCategory: subCategory?._id,
      seoTitle,
      seoDescription,
      tags: tags.items,
      attributes,
      addons: addonsData,
      cuisines,
    };

    if (id) {
      dispatch(
        editProduct({
          ...data,
          id,
          productVisibility: visibility,
          status: activeStatus,
        })
      );
    } else {
      dispatch(addProduct(data));
    }
  };

  // ADD CHOICE ITEM SINGLE

  const addAttributeItem = () => {
    if (attributeItems[attributeItems.length - 1].name == "") {
      return successMsg("Please Fillup Previous Input Fields", "error");
    }
    setAttributeItems([
      ...attributeItems,
      {
        name: "",
        extraPrice: 0,
      },
    ]);
  };

  // REMOVE CHOICE ITEM FROM

  const removeAttributeItem = (i) => {
    let list = [...attributeItems];
    list.splice(i, 1);
    setAttributeItems(list);
  };

  // HANDLE CHOICE ITEM INPUT CHANGE

  const attributeItemChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...attributeItems];
    list[index][name] = value;
    setAttributeItems(list);
  };

  // ADD CHOICE

  const addAttribute = () => {
    if (!attributeName) {
      return successMsg("Please add attribure name", "error");
    }
    if (attributeItems[attributeItems.length - 1].name == "") {
      return successMsg("Please at least one item", "error");
    }
    const data = {
      name: attributeName,
      required: isRequiredAttribute,
      items: attributeItems,
    };
    setAttributes([...attributes, data]);
    setAttributeName("");
    setIsRequiredAttribute(false);
    setAttributeItems([
      {
        name: "",
        extraPrice: 0,
      },
    ]);
  };

  // REMOVE ATTRIBUTE

  const removeAttribute = (i) => {
    let list = [...attributes];
    list.splice(i, 1);
    setAttributes(list);
  };

  // SUCCESS
  useEffect(() => {
    if (status) {
      if (id) {
        history.push("/products/list");
      } else {
        setShop(null);
        setCategory(null);
        setSubCategory(null);
        setName("");
        setDiscount("");
        setPrice("");
        setSeoTitle("");
        setSeoDescription("");
        setTags({
          items: [],
          value: "",
        });
        setType("");

        setAttributes([]);
        setAddons([]);
        setIsRequiredAttribute(false);
        setIsNeedAddon(false);
        setAttributeItems([
          {
            name: "",
            extraPrice: 0,
          },
        ]);
        setImage(null);
        window.scroll(0, 0);
      }
    }
  }, [status]);

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

  // ADD ADDON

  const addAddonProduct = (item) => {
    if (item) {
      setAddons([...addons, item]);
    }
  };

  // REMOVE ADDON

  const removeAddon = (i) => {
    let list = [...addons];
    list.splice(i, 1);
    setAddons(list);
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={id ? "Edit" : "Add"}
              title="Product"
              //   loading={loading}
              //   callList={callShopList}
              isRefresh={false}
            />

            <Card>
              <CardBody>
                <CardTitle>Product Informations</CardTitle>
                <hr />

                <Form onSubmit={submitProduct}>
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
                        <SelectOption
                          label="Type"
                          value={type}
                          onChange={(event) => {
                            setType(event.target.value);
                            dispatch(updateShopType(event.target.value));
                            dispatch(
                              updateCategoryShopType(event.target.value)
                            );
                            setShop(null);
                            setCategory(null);
                          }}
                          options={shopTypeOptions2}
                          disabled={
                            id || searchParams.get("shopId") ? true : false
                          }
                        />
                      </div>
                      <div className="mb-4">
                        <ShopAutocompleted
                          value={shop}
                          onChange={(event, newValue) => setShop(newValue)}
                          searchKey={searchKey}
                          onInputChange={(event, newInputValue) =>
                            dispatch(updateShopSearchKey(newInputValue))
                          }
                          list={shops}
                          disabled={
                            id || !type || searchParams.get("shopId")
                              ? true
                              : false
                          }
                        />
                      </div>

                      {shop && shop.isCuisine && shop.cuisineType.length > 1 && (
                        <div className="mb-4">
                          <Autocomplete
                            className="cursor-pointer"
                            value={cuisines}
                            onChange={(event, newValue) => {
                              setCuisines(newValue);
                            }}
                            getOptionLabel={(option) =>
                              option.name ? option.name : ""
                            }
                            isOptionEqualToValue={(option, value) =>
                              option._id == value._id
                            }
                            inputValue={cuisineSearchKey}
                            onInputChange={(event, newInputValue) => {
                              setCuisineSearchKey(newInputValue);
                            }}
                            id="controllable-states-demo"
                            options={
                              shop?.cuisineType?.length > 0
                                ? shop?.cuisineType
                                : []
                            }
                            sx={{ width: "100%" }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select a Cuisine"
                                required
                                name="cuisine"
                              />
                            )}
                            renderOption={(props, option) => (
                              <Box
                                component="li"
                                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                {...props}
                                key={option._id}
                              >
                                {option?.name}
                              </Box>
                            )}
                          />
                        </div>
                      )}

                      {type === "food" && shop?.shopType === "food" && (
                        <div className="mb-4">
                          <SelectOption
                            label="Food Type"
                            value={foodType}
                            onChange={(event) => {
                              setFoodType(event.target.value);
                            }}
                            options={foodTypeOptions2}
                          />
                        </div>
                      )}
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
                        <TextField
                          id="previousPrice"
                          label="Discount(%)"
                          variant="outlined"
                          style={{ width: "100%" }}
                          placeholder="Ender Discount Percentage"
                          autoComplete="off"
                          value={discount}
                          onChange={(event) => setDiscount(event.target.value)}
                          required
                          type="number"
                        />
                      </div>

                      {id && (
                        <div className="mb-4">
                          <SelectOption
                            label="Visibility"
                            value={visibility}
                            onChange={(event) =>
                              setVisibility(event.target.value)
                            }
                            options={[
                              { label: "Yes", value: true },
                              { label: "No", value: false },
                            ]}
                          />
                        </div>
                      )}
                      {id && (
                        <div className="mb-4">
                          <SelectOption
                            label="Status"
                            value={activeStatus}
                            onChange={(event) =>
                              setActiveStatus(event.target.value)
                            }
                            options={[
                              { label: "Active", value: 'active' },
                              { label: "Inactive", value: "inactive" },
                            ]}
                          />
                        </div>
                      )}
                    </Col>
                    <Col lg={6}>
                      <div className="mb-4">
                        <Autocomplete
                          className="cursor-pointer"
                          required
                          value={category}
                          disabled={!type ? true : false}
                          onChange={(event, newValue) => {
                            setCategory(newValue);
                          }}
                          getOptionLabel={(option) => option.name}
                          isOptionEqualToValue={(option, value) =>
                            option._id == value._id
                          }
                          inputValue={searchCategoryKey}
                          onInputChange={(event, newInputValue) => {
                            setSearchCategoryKey(newInputValue);
                          }}
                          id="controllable-states-demo"
                          options={categories.length > 0 ? categories : []}
                          sx={{ width: "100%" }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select a Category"
                              required
                              name="category"
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
                      {category && (
                        <div className="mb-4">
                          <Autocomplete
                            className="cursor-pointer"
                            value={subCategory}
                            onChange={(event, newValue) => {
                              setSubCategory(newValue);
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
                          placeholder="type tag name then press enter"
                          style={{ width: "100%" }}
                          autoComplete="off"
                          onKeyDown={handleTagAdd}
                          onChange={handleTagChange}
                          value={tags?.value}
                          //   onChange={(event) => setName(event.target.value)}
                        />
                        {tags.items.length > 0 && (
                          <Paper className="mt-4 p-3">
                            {tags.items.map((item, index) => (
                              <div className="tag__wrapper" key={index}>
                                {item}
                                <button
                                  type="button"
                                  className="button"
                                  onClick={() => handleTagDelete(item)}
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </Paper>
                        )}
                      </div>

                      <div className="mb-4">
                        <TextField
                          id="seo"
                          label="SEO Description"
                          variant="outlined"
                          style={{ width: "100%" }}
                          autoComplete="off"
                          value={seoDescription}
                          onChange={(event) =>
                            setSeoDescription(event.target.value)
                          }
                          required
                          multiline
                          rows={2}
                        />
                      </div>
                    </Col>
                  </Row>

                  {/* ATTRIBUTE */}
                  <Row className="mt-3">
                    <Col lg={6}>
                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={isNeedAttribute}
                              id="flexCheckDefault"
                              onChange={(e) =>
                                setIsNeedAttribute(e.target.checked)
                              }
                            />
                            <label
                              className="form-check-label ms-1"
                              style={{ fontSize: "16px" }}
                              htmlFor="flexCheckDefault"
                            >
                              Attribute(s)
                            </label>
                          </div>
                        </div>

                        {isNeedAttribute && (
                          <div>
                            <Row className="mt-2">
                              <Col sm={8}>
                                <TextField
                                  id="Attribute name"
                                  label="Attribute Name"
                                  variant="outlined"
                                  style={{ width: "100%" }}
                                  autoComplete="off"
                                  value={attributeName}
                                  onChange={(e) =>
                                    setAttributeName(e.target.value)
                                  }
                                  type="text"
                                />
                              </Col>
                              <Col sm={4}>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={isRequiredAttribute}
                                    id="flexCheckDefault"
                                    onChange={(e) =>
                                      setIsRequiredAttribute(e.target.checked)
                                    }
                                  />
                                  <label
                                    className="form-check-label ms-1"
                                    style={{ fontSize: "16px" }}
                                    htmlFor="flexCheckDefault"
                                  >
                                    Required
                                  </label>
                                </div>
                              </Col>
                            </Row>
                            {attributeItems.map((item, index) => (
                              <Row className="mt-3" key={index}>
                                <Col sm={6}>
                                  <TextField
                                    id="variant name"
                                    label="Name"
                                    name="name"
                                    variant="outlined"
                                    style={{ width: "100%" }}
                                    autoComplete="off"
                                    value={item?.name}
                                    onChange={(event) =>
                                      attributeItemChange(event, index)
                                    }
                                    type="text"
                                  />
                                </Col>
                                <Col sm={6} className="mt-3 mt-sm-0 d-flex">
                                  <TextField
                                    id="variant extra price"
                                    name="extraPrice"
                                    label="Extra Price"
                                    variant="outlined"
                                    style={{ width: "100%" }}
                                    autoComplete="off"
                                    value={item?.extraPrice}
                                    onChange={(event) =>
                                      attributeItemChange(event, index)
                                    }
                                    type="number"
                                  />
                                  {attributeItems.length > 1 && (
                                    <i
                                      className="fas fa-trash cursor-pointer ms-1"
                                      style={{ color: "red", fontSize: "18px" }}
                                      onClick={() => removeAttributeItem(index)}
                                    ></i>
                                  )}
                                </Col>
                                {attributeItems.length - 1 === index && (
                                  <div>
                                    <Button
                                      outline={true}
                                      color="primary"
                                      className="mt-2"
                                      onClick={addAttributeItem}
                                    >
                                      Add Item
                                    </Button>
                                  </div>
                                )}
                              </Row>
                            ))}

                            <div className="mt-3 text-center">
                              <Button
                                outline={true}
                                color="success"
                                size="lg"
                                className="px-5"
                                onClick={addAttribute}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      {attributes.length > 0 && (
                        <div className="mb-4">
                          <Paper className="py-2">
                            <h5 className="text-center">Attributes List</h5>
                            <hr />
                            {attributes.length > 0 &&
                              attributes.map((attribute, index) => (
                                <ul
                                  key={index}
                                  style={{ listStyleType: "square" }}
                                >
                                  <li>
                                    <div className="d-flex justify-content-between">
                                      <span
                                        style={{
                                          fontSize: "15px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        {attribute.name}
                                        {attribute.required ? "(Required)" : ""}
                                      </span>
                                      <i
                                        className="fas fa-trash cursor-pointer me-3"
                                        style={{
                                          color: "#BD381C",
                                          fontSize: "15px",
                                        }}
                                        onClick={() => removeAttribute(index)}
                                      ></i>
                                    </div>
                                  </li>
                                  {attribute.items.map((item, index) => (
                                    <ul key={index}>
                                      <li>
                                        <span>{item.name}-</span>
                                        <span className="ms-1">
                                          {item.extraPrice}
                                        </span>
                                      </li>
                                    </ul>
                                  ))}
                                </ul>
                              ))}
                          </Paper>
                        </div>
                      )}
                    </Col>
                  </Row>

                  {/* ADDON */}

                  <Row className="mt-4">
                    <Col lg={6}>
                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={isNeedAddon}
                              id="flexCheckDefault"
                              onChange={(e) => setIsNeedAddon(e.target.checked)}
                            />
                            <label
                              className="form-check-label ms-1"
                              style={{ fontSize: "16px" }}
                              htmlFor="flexCheckDefault"
                            >
                              Addon(s)
                            </label>
                          </div>
                        </div>

                        {isNeedAddon && (
                          <Autocomplete
                            className="cursor-pointer"
                            // value={addon}
                            onChange={(event, newValue) =>
                              addAddonProduct(newValue)
                            }
                            getOptionLabel={(option) =>
                              option.name ? option.name : ""
                            }
                            isOptionEqualToValue={(option, value) =>
                              option._id == value._id
                            }
                            inputValue={productSearchKey}
                            onInputChange={(event, newInputValue) => {
                              setProductSearchKey(newInputValue);
                            }}
                            id="controllable-states-demo"
                            options={products.length > 0 ? products : []}
                            sx={{ width: "100%" }}
                            renderInput={(params) => (
                              <TextField {...params} label="Select Products" />
                            )}
                            renderOption={(props, option) => (
                              <Box
                                component="li"
                                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                {...props}
                                key={option._id}
                              >
                                <img
                                  loading="lazy"
                                  width="60"
                                  src={option.images[0]}
                                  alt=""
                                />
                                {option.name}
                              </Box>
                            )}
                          />
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      {addons.length > 0 && (
                        <div className="mb-4">
                          <Paper className="py-2">
                            <h5 className="text-center">Addons List</h5>
                            <hr />
                            {addons.length > 0 &&
                              addons.map((item, index) => (
                                <ul
                                  key={index}
                                  style={{ listStyleType: "square" }}
                                >
                                  <li>
                                    <div className="d-flex justify-content-between">
                                      <div>
                                        <img
                                          loading="lazy"
                                          width="60"
                                          src={item.images[0]}
                                          alt=""
                                        />
                                        <span
                                          style={{
                                            fontSize: "15px",
                                            fontWeight: "500",
                                            marginLeft: "10px",
                                          }}
                                        >
                                          {item.name}
                                        </span>
                                      </div>
                                      <i
                                        className="fas fa-trash cursor-pointer me-3"
                                        style={{
                                          color: "#BD381C",
                                          fontSize: "15px",
                                        }}
                                        onClick={() => removeAddon(index)}
                                      ></i>
                                    </div>
                                  </li>
                                </ul>
                              ))}
                          </Paper>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Label>Product Images</Label>
                      <div className="mb-5">
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
                      </div>
                    </Col>
                  </Row>

                  <div className="my-5 d-flex justify-content-center">
                    <Button
                      type="submit"
                      color="primary"
                      className="px-5"
                      disabled={loading || isLoading}
                    >
                      {loading || isLoading ? (
                        <Spinner
                          animation="border"
                          variant="info"
                          size="sm"
                        ></Spinner>
                      ) : id ? (
                        "Save"
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default ProductAdd;
