import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Col,
  Container,
  Row,
  Modal,
  Button,
  CardTitle,
  CardBody,
  Label,
  Form,
} from "reactstrap";
import { removeAllSelectedGalleryImage } from "../../store/action/galleryAction";
import ImageSelectionDialog from "../Utility/ImageSelectionDialog";
// Form Editor
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import { stateToHTML } from "draft-js-export-html";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import { convertToHTML } from "draft-convert";
// import { convertToHTML } from 'draft-convert';
import requestApi from "../../network/httpRequest";
import { ADD_BANNER, IMAGE_UPLOAD } from "../../network/Api";
import { Link, useHistory, useParams } from "react-router-dom";
import { GET_SINGLE_BANNER } from "./../../network/Api";
import { addBanner, editBanner } from "../../store/banner/bannerAction";
import htmlToDraft from "html-to-draftjs";
import { OPEN_EDIT_PAGE } from "../../store/actionType";
import Breadcrumb from "../../components/Common/Breadcrumb";
import Dropzone from "react-dropzone";
import { imageUpload } from "../../store/ImageUpload/imageUploadAction";
import {
  activeOptions,
  bannerForOptions,
  bannerOptions,
  bannerTypeOPtions,
  shopTypeOptions2,
} from "../../assets/staticData";
import { Autocomplete, Box, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  getAllShop,
  updateShopSearchKey,
  updateShopType,
} from "../../store/Shop/shopAction";
import {
  getAllProduct,
  updateProductSearchKey,
} from "../../store/Product/productAction";
import formatBytes from "../../common/imageFormatBytes";

import ShopAutocompleted from "../../components/ShopAutocompleted";
import SelectOption from "../../components/SelectOption";
import ProductAutocompleted from "../../components/ProductAutocompleted";

const AddBanner = () => {
  const { list, status, loading } = useSelector((state) => state.bannerReducer);
  const { shops, searchKey, typeKey } = useSelector(
    (state) => state.shopReducer
  );
  const { products, searchKey: productSearchKey } = useSelector(
    (state) => state.productReducer
  );

  const dispatch = useDispatch();
  const route = useHistory();
  const { id } = useParams();

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [activeStatus, setActiveStatus] = useState("");

  const [shop, setShop] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClickable, setIsClickable] = useState("");
  const [clickOption, setClickOption] = useState("");
  const [clickableUrl, setClickableUrl] = useState("");
  const [clickType, setClickType] = useState("");
  const [clickableShop, setClickableShop] = useState(null);
  const [clickableProduct, setClickableProduct] = useState(null);
  const [shopType, setShopType] = useState("");

  // GET ALL SHOP
  useEffect(() => {
    dispatch(getAllShop(true));
  }, [shopType, typeKey, searchKey]);

  // GET ALL Product

  useEffect(() => {
    if (clickType === "product" || productSearchKey) {
      dispatch(getAllProduct(true));
    }
  }, [clickType, productSearchKey]);

  // EDIT BANNER

  useEffect(() => {
    if (id) {
      const findBanner = list.find((item) => item?._id === id);

      if (findBanner) {
        updateBannerData(findBanner);
      } else {
        callApi(id);
      }
    }
  }, [id]);

  // UPDATE BANNER DATA FOR EDIT

  const updateBannerData = (data) => {
    const {
      image,
      type,
      title,
      status,
      shop,
      clickType,
      clickableUrl,
      isClickable,
      productId,
      shopId,
    } = data;

    const findShop = shops.find((item) => item._id == shopId);
    const findProduct = products.find((item) => item._id == productId);
    setClickOption(clickType ? "route" : clickableUrl ? "link" : "");
    setClickableProduct(findProduct);
    setClickableShop(findShop ? findShop : null);
    setImage(image);
    setTitle(title);
    setType(type);
    setActiveStatus(status);
    setShop(shop);
    setClickType(clickType ? clickType : "");
    setClickableUrl(clickableUrl ? clickableUrl : "");
    setIsClickable(isClickable);
    setShopType(shop ? shop.shopType : shopId ? findShop.shopType : "");
  };

  // GET BANNER FROM SERVER

  const callApi = async (id) => {
    const { data } = await requestApi().request(GET_SINGLE_BANNER + id);
    if (data.status) {
      updateBannerData(data.data.banner);
      //   setDescriptionText(convertToText)
    } else {
      route.push("/banner", { replace: true });
    }
  };

  // VALIDATION
  const submitBanner = (e) => {
    e.preventDefault();

    if (!image) {
      return WarningMessage("Please Select a Image");
    }

    uploadImage();
  };

  // WARINIG MESSAGE

  const WarningMessage = (message) => {
    toast.warn(message, {
      // position: "bottom-right",
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // UPLOAD IMAGE TO SERVER

  const uploadImage = async () => {
    if (typeof image == "string") {
      submitData(image);
    } else {
      setIsLoading(true);
      try {
        let formData = new FormData();
        formData.append("image", image);
        const { data } = await requestApi().request(IMAGE_UPLOAD, {
          method: "POST",
          data: formData,
        });
        if (data.status) {
          setIsLoading(false);
          submitData(data.data.url);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // SUBMIT DATA TO SERVER
  const submitData = (url) => {
    const data = {
      title,
      type,
      image: url,
      shopId: shop?._id,
      isClickable,
      clickableUrl,
      clickType,
      productId: clickableProduct?._id,
      shopIdForClickGo: clickableShop?._id,
    };
    if (id) {
      dispatch(
        editBanner({
          ...data,
          id,
          status: activeStatus,
        })
      );
    } else {
      dispatch(addBanner(data));
    }
  };

  // SUCCESS

  useEffect(() => {
    if (status) {
      if (id) {
        route.goBack();
      } else {
        setImage(null);
        setTitle("");
        setType("");
        setActiveStatus("");
        setShop(null);
        setIsLoading(false);
        setClickableUrl("");
        setClickableShop(null);
        setClickableProduct(null);
        setClickType("");
        setClickOption("");
        setIsClickable("");
      }
    }
  }, [status]);

  // IMAGE

  const handleAcceptedFiles = (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );

    setImage(files[0]);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            maintitle="Drop"
            breadcrumbItem={id ? 'Update' : 'Add New'}
            title="Banner"
            // loading={loading}
            // callList={callCarList}
            isRefresh={false}
          />
          <Form onSubmit={submitBanner}>
            <Card className="mt-5">
              <CardBody>
                <CardTitle className="h4">Banner Information</CardTitle>
                <hr />

                <Row className="mb-4">
                  <Col lg={6}>
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Title"
                      variant="outlined"
                      placeholder="Enter Banner Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </Col>
                  <Col lg={6} className="mt-3 mt-lg-0">
                    <SelectOption
                      label="Type"
                      value={type}
                      onChange={(event) => {
                        setType(event.target.value);
                        setIsClickable("");
                        setClickOption("");
                        setClickableUrl("");
                        setClickType("");
                        setClickableShop(null);
                        setClickableProduct(null);
                        setShopType("");
                      }}
                      options={bannerTypeOPtions}
                    />
                  </Col>
                </Row>

                {type === "shop" && (
                  <Row className="mb-4">
                    <Col lg={6}>
                      <SelectOption
                        label="Shop Type"
                        value={shopType}
                        onChange={(event) => {
                          setShopType(event.target.value);
                          setShop(null);
                          dispatch(updateShopType(event.target.value));
                        }}
                        options={[
                          { label: "Grocery", value: "grocery" },
                          { label: "Pharmacy", value: "pharmacy" },
                        ]}
                      />
                    </Col>

                    {shopType && (
                      <Col lg={6}>
                        <ShopAutocompleted
                          value={shop}
                          onChange={(event, newValue) => setShop(newValue)}
                          searchKey={searchKey}
                          onInputChange={(event, newInputValue) =>
                            dispatch(updateShopSearchKey(newInputValue))
                          }
                          list={shops}
                        />
                      </Col>
                    )}
                  </Row>
                )}

                {type === "home" && (
                  <Row className="mb-4">
                    {type == "home" && (
                      <Col lg={6}>
                        <SelectOption
                          label="Is Clickable"
                          value={isClickable}
                          onChange={(event) => {
                            setIsClickable(event.target.value);
                            setClickOption("");
                            setClickableUrl("");
                            setClickType("");
                            setClickableShop(null);
                            setClickableProduct(null);
                          }}
                          options={[
                            { label: "Yes", value: true },
                            { label: "No", value: false },
                          ]}
                        />
                      </Col>
                    )}
                    {isClickable && (
                      <Col lg={6} className="mt-3 mt-lg-0">
                        <SelectOption
                          label="Click Option"
                          value={clickOption}
                          onChange={(event) => {
                            setClickOption(event.target.value);
                            setClickableUrl("");
                            setClickType("");
                            setClickableShop(null);
                            setClickableProduct(null);
                          }}
                          options={bannerForOptions}
                        />
                      </Col>
                    )}
                  </Row>
                )}

                {clickOption && (
                  <Row className="mb-4">
                    {clickOption && (
                      <Col lg={6}>
                        {clickOption === "link" ? (
                          <TextField
                            style={{ width: "100%" }}
                            id="outlined-basic"
                            label="Url"
                            variant="outlined"
                            placeholder="Enter Url"
                            value={clickableUrl}
                            onChange={(e) => setClickableUrl(e.target.value)}
                            required
                          />
                        ) : (
                          <SelectOption
                            label="Click Type"
                            value={clickType}
                            onChange={(event) => {
                              setClickType(event.target.value);
                              setShopType("");
                            }}
                            options={[
                              { label: "Shop", value: "shop" },
                              { label: "Product", value: "product" },
                            ]}
                          />
                        )}
                      </Col>
                    )}
                    {clickType === "shop" && (
                      <Col lg={6}>
                        <SelectOption
                          label="Shop Type"
                          value={shopType}
                          onChange={(event) => {
                            setShopType(event.target.value);
                            setShop(null);
                            dispatch(updateShopType(event.target.value));
                          }}
                          options={shopTypeOptions2}
                        />
                      </Col>
                    )}
                  </Row>
                )}

                <Row className="mb-4">
                  <Col lg={6} className="mt-3 mt-lg-0">
                    {clickType === "shop" && shopType && (
                      <ShopAutocompleted
                        value={clickableShop}
                        onChange={(event, newValue) =>
                          setClickableShop(newValue)
                        }
                        searchKey={searchKey}
                        onInputChange={(event, newInputValue) =>
                          dispatch(updateShopSearchKey(newInputValue))
                        }
                        list={shops}
                      />
                    )}

                    {clickType === "product" && (
                      <ProductAutocompleted
                        value={clickableProduct}
                        onChange={(event, newValue) =>
                          setClickableProduct(newValue)
                        }
                        searchKey={productSearchKey}
                        onInputChange={(event, newInputValue) =>
                          dispatch(updateProductSearchKey(newInputValue))
                        }
                        list={products}
                      />
                    )}
                  </Col>

                  {id && (
                    <Col lg={6} className="mt-3 mt-lg-0">
                      <FormControl fullWidth required>
                        <InputLabel id="demo-simple-select-label">
                          Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={activeStatus}
                          label="Status"
                          onChange={(event) => {
                            setActiveStatus(event.target.value);
                          }}
                          required
                        >
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Col>
                  )}
                </Row>
              </CardBody>
            </Card>

            <Row>
              <Col className="col-12">
                <Label>Upload Image</Label>
                <div className="mb-5">
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
                          <Declaration>
                            <small>* Max Image size allowed Id 1 Mb.</small>
                            <small>
                              * Image dimensions larger than 900 X 600 will be
                              cropped to given dimentions.
                            </small>
                          </Declaration>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                  <div className="dropzone-previews mt-3" id="file-previews">
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
                                src={image.preview ? image.preview : image}
                                alt=""
                              />
                            </Col>
                            <Col>
                              <Link
                                to="#"
                                className="text-muted font-weight-bold"
                              >
                                {image.name ? image.name : title}
                              </Link>
                              <p className="mb-0">
                                <strong>{image.formattedSize}</strong>
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
            <div className="d-flex justify-content-center">
              <Button
                disabled={loading || isLoading}
                color="primary w-50"
                type="submit"
              >
                {!loading || !isLoading ? "Submit" : "loading...."}
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
};

const Declaration = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: bold;
`;

export default AddBanner;
