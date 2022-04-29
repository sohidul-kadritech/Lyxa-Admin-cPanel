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

const AddBanner = () => {
  const { bannerImage, imageStatus } = useSelector(
    (state) => state.imageUploadReducer
  );

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const { list, status, loading } = useSelector((state) => state.bannerReducer);
  const { shops } = useSelector((state) => state.shopReducer);

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

  useEffect(() => {
    dispatch(getAllShop(true));
  }, []);

  useEffect(() => {
    if (id) {
      const findBanner = list.find((item) => item?._id === id);
      if (findBanner) {
        // console.log({ findBanner });
        const { image, type, title, status, description, shop } = findBanner;
        setImage(image);
        setTitle(title);
        setType(type);
        setActiveStatus(status);
        setShop(shop)
        const contentBlock = htmlToDraft(description);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
          );
          const outputEditorState = EditorState.createWithContent(contentState);
          setEditorState(outputEditorState);
        }
      } else {
        callApi(id);
        // console.log("Call Api");
      }
    }
  }, [id]);

  // GET BANNER FROM SERVER

  const callApi = async (id) => {
    const { data } = await requestApi().request(GET_SINGLE_BANNER + id);
    // console.log(banner)
    if (data.status) {
      // console.log("banner", data.data.banner)
      const { type, title, image, description, status, shop } = data.data.banner;
      setImage(image);
      setTitle(title);
      setType(type);
      setActiveStatus(status);
      setShop(shop)
      const contentBlock = htmlToDraft(description);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const outputEditorState = EditorState.createWithContent(contentState);
        setEditorState(outputEditorState);
      }
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

  const submitBanner =  () => {
    if (!title || title == "") {
      return toast.warn("Enter a title ", {
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

    if (!type) {
      return toast.warn("Select a Type", {
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

    if (type == "shop" && !shop) {
      return toast.warn("Select a Shop", {
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
      return toast.warn("add a image ", {
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

    // console.log(typeof image);

    // dispatch(imageUpload(image, "banner"));

     uploadImage();
  };

  const uploadImage = async() => {
    console.log({image})
    if (typeof image == "string") {
      submitData(image);
    } else {
      let formData = new FormData();
      formData.append("image", image);
      // console.log({formData})
      const  {data}  = await requestApi().request(IMAGE_UPLOAD, {
        method: "POST",
        data: formData,
      });
      console.log("image upload", data)
      if (data.status) {
        submitData(data.data.url);
      }
    }
  };

  const submitData = (url) => {
    const data = {
      title,
      type: type,
      description,
      image: url,
      shopId: shop._id
    };
    if (id) {
      dispatch(
        editBanner({
          ...data,
          id,
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
      }
    }
  }, [status]);

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

          <Card className="mt-5">
            <CardBody>
              {/* <CardTitle className="h4">Add Banner</CardTitle> */}

              <Row className="mb-4">
                <Col xl={6}>
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
                <Col xl={6} className="mt-3 mt-xl-0">
                  <FormControl fullWidth>
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
                      }}
                      required
                    >
                      <MenuItem value="home">Home</MenuItem>
                      <MenuItem value="food">Food</MenuItem>
                      <MenuItem value="grocery">Grocery</MenuItem>
                      <MenuItem value="shop">Shop</MenuItem>
                      <MenuItem value="pharmacy">Pharmacy</MenuItem>
                    </Select>
                  </FormControl>
                </Col>
              </Row>

              <Row className="mb-4">
                {type == "shop" && (
                  <Col xl={6}>
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
                  </Col>
                )}
                {id && (
                  <Col xl={6} className="mt-3 mt-xl-0">
                    <FormControl fullWidth>
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
                </Form>
              </div>
            </Col>
          </Row>
          <div className="d-flex justify-content-center">
            <Button
              disabled={loading}
              color="primary w-50"
              onClick={submitBanner}
            >
              {!loading ? "Submit" : "loading...."}
            </Button>
          </div>
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
