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
import { activeOptions, bannerOptions } from "../../assets/staticData";
import { Autocomplete, Box, TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { getAllShop } from "../../store/Shop/shopAction";
import { getAllProduct } from "../../store/Product/productAction";
import formatBytes from "../../common/imageFormatBytes";

const AddBanner = () => {
  const { bannerImage, imageStatus } = useSelector(
    (state) => state.imageUploadReducer
  );

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const { list, status, loading } = useSelector((state) => state.bannerReducer);
  const { shops } = useSelector((state) => state.shopReducer);
  const { products } = useSelector((state) => state.productReducer);

  const dispatch = useDispatch();
  const route = useHistory();
  const { id } = useParams();

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [description, setDescription] = useState("");
  const [shop, setShop] = useState(null);
  const [searchShopKey, setSearchShopKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClickable, setIsClickable] = useState("");
  const [clickOption, setClickOption] = useState("");
  const [clickableUrl, setClickableUrl] = useState("");
  const [clickType, setClickType] = useState("");
  const [clickableShop, setClickableShop] = useState(null);
  const [clickableProduct, setClickableProduct] = useState(null);

  // GET ALL SHOP
  useEffect(() => {
    if (type === "shop" || clickType === "shop") {
      dispatch(getAllShop(true));
    }
  }, [type, clickType]);

  // GET ALL SHOP

  useEffect(() => {
    if (clickType === "product") {
      dispatch(getAllProduct(true));
    }
  }, [clickType]);

  // EDIT BANNER

  useEffect(() => {
    if (id) {
      const findBanner = list.find((item) => item?._id === id);
      if (findBanner) {
        console.log({ findBanner });

        updateBannerData(findBanner);
      } else {
        callApi(id);
        // console.log("Call Api");
      }
    }
  }, [id]);

  // UPDATE BANNER DATA FOR EDIT

  const updateBannerData = async (data) => {
    const {
      image,
      type,
      title,
      status,
      description,
      shop,
      clickType,
      clickableUrl,
      isClickable,
      productId,
      shopId,
    } = data;

    const findShop = await shops.find((item) => item._id == shopId);
    const findProduct = await products.find((item) => item._id == productId);
    //  {clickType && setClickOption() }
    setClickOption(clickType ? "route" : clickableUrl ? "link" : "");

    setClickableProduct(findProduct ? findProduct : null);
    setClickableShop(findShop ? findShop : null);
    setImage(image);
    setTitle(title);
    setType(type);
    setActiveStatus(status);
    setShop(shop);
    setClickType(clickType ? clickType : "");
    setClickableUrl(clickableUrl ? clickableUrl : "");
    setIsClickable(isClickable);

    const contentBlock = htmlToDraft(description);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const outputEditorState = EditorState.createWithContent(contentState);
      setEditorState(outputEditorState);
    }
  };

  // GET BANNER FROM SERVER

  const callApi = async (id) => {
    const { data } = await requestApi().request(GET_SINGLE_BANNER + id);
    // console.log(banner)
    if (data.status) {
      console.log("banner", data.data.banner);
      updateBannerData(data.data.banner);
      //   setDescriptionText(convertToText)
    } else {
      route.push("/banner", { replace: true });
    }
  };

  const handleEditorChange = (state) => {
    // console.log(state)
    setEditorState(state);
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    // console.log(currentContentAsHTML);
    setDescription(currentContentAsHTML);
  };
  // VALIDATION
  const submitBanner = (e) => {
    e.preventDefault();

    if (!editorState.getCurrentContent().hasText()) {
      return WarningMessage("Please type a description");
    }

    if (!image) {
      return WarningMessage("Please Select a Image");
    }

    // console.log(typeof image);

    // dispatch(imageUpload(image, "banner"));

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
    // console.log({image})
    if (typeof image == "string") {
      submitData(image);
    } else {
      setIsLoading(true);
      try {
        let formData = new FormData();
        formData.append("image", image);
        // console.log({formData})
        const { data } = await requestApi().request(IMAGE_UPLOAD, {
          method: "POST",
          data: formData,
        });
        // console.log("image upload", data)
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
      description,
      image: url,
      shopId: shop?._id,
      isClickable,
      clickableUrl,
      clickType,
      productId: clickableProduct?._id,
      shopIdForClickGo: clickableShop?._id,
    };
    // console.log({data})
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
        setEditorState(EditorState.createEmpty());
        setDescription("");
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
            breadcrumbItem={"Uplaod"}
            title="Banner"
            // loading={loading}
            // callList={callCarList}
            isRefresh={false}
          />
          <Form onSubmit={submitBanner}>
            <Card className="mt-5">
              <CardBody>
                {/* <CardTitle className="h4">Add Banner</CardTitle> */}

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
                    <FormControl fullWidth required name='shopType'>
                      <InputLabel id="demo-simple-select-label">
                        Shop Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Shop Type"
                        onChange={(event) => {
                          setType(event.target.value);
                          setIsClickable("");
                          setClickOption("");
                          setClickableUrl("");
                          setClickType("");
                          setClickableShop(null);
                          setClickableProduct(null);
                        }}
                        required
                      >
                        <MenuItem value="home">Home</MenuItem>
                        <MenuItem value="food">Restaurant</MenuItem>
                        <MenuItem value="grocery">Grocery</MenuItem>
                        <MenuItem value="shop">Shop</MenuItem>
                        <MenuItem value="pharmacy">Pharmacy</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                </Row>

                {(type === "home" || type === "shop") && (
                  <Row className="mb-4">
                    {type == "shop" && (
                      <Col lg={6}>
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
                            <TextField {...params} label="Select a Shop" required name='shop' />
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
                      </Col>
                    )}
                    {type == "home" && (
                      <Col lg={6}>
                        <FormControl fullWidth required>
                          <InputLabel id="demo-simple-select-label">
                            Is Clickable
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={isClickable}
                            label="Is Clickable"
                            onChange={(event) => {
                              setIsClickable(event.target.value);
                              setClickOption("");
                              setClickableUrl("");
                              setClickType("");
                              setClickableShop(null);
                              setClickableProduct(null);
                            }}
                            required
                          >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                          </Select>
                        </FormControl>
                      </Col>
                    )}
                    {isClickable && (
                      <Col lg={6} className="mt-3 mt-lg-0">
                        <FormControl fullWidth required>
                          <InputLabel id="demo-simple-select-label">
                            Banner For
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={clickOption}
                            label="Is Clickable"
                            onChange={(event) => {
                              setClickOption(event.target.value);
                              setClickableUrl("");
                              setClickType("");
                              setClickableShop(null);
                              setClickableProduct(null);
                            }}
                            required
                          >
                            <MenuItem value="link">Link</MenuItem>
                            <MenuItem value="route">Shop/Product</MenuItem>
                          </Select>
                        </FormControl>
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
                          <FormControl fullWidth required>
                            <InputLabel id="demo-simple-select-label">
                              Click Type
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={clickType}
                              label="Is Clickable"
                              onChange={(event) => {
                                setClickType(event.target.value);
                              }}
                              required
                            >
                              <MenuItem value="shop">Shop</MenuItem>
                              <MenuItem value="product">Product</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      </Col>
                    )}
                    {clickType && (
                      <Col lg={6} className="mt-3 mt-lg-0">
                        {clickType === "shop" ? (
                          <Autocomplete
                            className="cursor-pointer"
                            value={clickableShop}
                            onChange={(event, newValue) => {
                              setClickableShop(newValue);
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
                              <TextField {...params} label="Select  Shop" required />
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
                                  src={option.shopBanner}
                                  alt=""
                                />
                                {option.shopName}
                              </Box>
                            )}
                          />
                        ) : (
                          <Autocomplete
                            className="cursor-pointer"
                            value={clickableProduct}
                            onChange={(event, newValue) => {
                              setClickableProduct(newValue);
                              // console.log("new", newValue);
                            }}
                            getOptionLabel={(option) =>
                              option.name ? option.name : ""
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
                            options={products.length > 0 ? products : []}
                            sx={{ width: "100%" }}
                            renderInput={(params) => (
                              <TextField {...params} label="Select Product" required />
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
                      </Col>
                    )}
                  </Row>
                )}

                <Row className="mb-4">
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

                <Row className="mb-3">
                  <label className="col-md-2 col-form-label">Description</label>
                  <div className="col-md-10">
                    <Editor
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      editorState={editorState}
                      defaultEditorState={editorState}
                      onEditorStateChange={handleEditorChange}
                    />
                  </div>
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
                
                type='submit'
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

const ImageView = styled.div`
  /* width: 100% !important;
  max-width: 300pximport { Select } from 'react-select';
; */
  position: relative;

  .img_view {
    opacity: 1;
    transition: 0.5s ease;
    backface-visibility: hidden;
  }

  .button__wrapper {
    transition: 0.5s ease;
    opacity: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    text-align: center;

    .remove__btn {
      /* background-color: yellow; */
      font-size: 18px;
      color: red;
    }
  }

  &:hover {
    .img_view {
      opacity: 0.3;
    }
    .button__wrapper {
      opacity: 1;
    }
  }
`;

export default AddBanner;
