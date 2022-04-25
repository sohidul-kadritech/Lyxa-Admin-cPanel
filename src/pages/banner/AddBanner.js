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
import { ADD_BANNER } from "../../network/Api";
import { Link, useHistory, useParams } from "react-router-dom";
import { GET_SINGLE_BANNER } from "./../../network/Api";
import { addBanner, editBanner } from "../../store/banner/bannerAction";
import htmlToDraft from "html-to-draftjs";
import { OPEN_EDIT_PAGE } from "../../store/actionType";
import Breadcrumb from "../../components/Common/Breadcrumb";
import Dropzone from "react-dropzone";
import Select from "react-select";
import { imageUpload } from "../../store/ImageUpload/imageUploadAction";
import { activeOptions, bannerOptions } from "../../assets/staticData";

const AddBanner = () => {
  const { bannerImage, imageStatus } = useSelector(
    (state) => state.imageUploadReducer
  );

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const { list, status, loading } = useSelector((state) => state.bannerReducer);

  const dispatch = useDispatch();
  const route = useHistory();
  const { id } = useParams();

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState(null);
  const [activeStatus, setActiveStatus] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (id) {
      const findBanner = list.find((item) => item?._id === id);
      if (findBanner) {
        console.log({ findBanner });
        const { image, type, status, description } = findBanner;
        const findType = bannerOptions.find((op) => op.value == type);
        const fineStatus = activeOptions.find((st) => st.value == status);
        setImage(image);
        // setTitle(title);
        setType(findType);
        setActiveStatus(fineStatus);
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
      const { type, title, image, description, status } = data.data.banner;
      const findType = bannerOptions.find((op) => op.value == type);
      const fineStatus = activeOptions.find((st) => st.value == status);
      setImage(image);
      setTitle(title);
      setType(findType);
      setActiveStatus(fineStatus);
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

  const submitBanner = async () => {
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

    console.log({ image });

    dispatch(imageUpload(image, "banner"));

    if (imageStatus) {
      submitData();
    }

    
  };

  const submitData = () => {
    const data = {
      title,
      type: type.value,
      description,
      image: bannerImage?.url,
    };
    if (id) {
      dispatch(
        editBanner({
          ...data,
          id,
         
        })
      );
    } else {
      dispatch(
        addBanner(data)
      );
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
        setType(null);
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

          <Row>
            <Col>
              <Card className="mt-5">
                <CardBody>
                  {/* <CardTitle className="h4">Add Banner</CardTitle> */}

                  <Row className="mb-4">
                    <Col xl={6}>
                      <div>
                        <Label>Name</Label>
                        <input
                          className="form-control"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter a Title"
                          // onError={true}
                        />
                      </div>
                    </Col>
                    <Col xl={6} className="mt-3 mt-xl-0">
                      <Label>Shop Type</Label>
                      <Select
                        // value={country}
                        onChange={(event) => {
                          setType(event);
                        }}
                        value={type}
                        defaultValue={""}
                        palceholder="Select Shop Type"
                        options={bannerOptions}
                        classNamePrefix="select2-selection"
                        required
                      />
                    </Col>

                    {id && (
                      <Col xl={6} className="mt-3 mt-xl-0">
                        <Label>Status</Label>
                        <Select
                          // value={country}
                          onChange={(event) => {
                            setActiveStatus(event);
                          }}
                          value={activeStatus}
                          defaultValue={""}
                          palceholder="Select"
                          options={activeOptions}
                          classNamePrefix="select2-selection"
                          required
                        />
                      </Col>
                    )}
                  </Row>

                  <Row className="mb-3">
                    <label className="col-md-2 col-form-label">
                      Description
                    </label>
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
            </Col>
          </Row>
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
                                src={image.preview}
                                alt=""
                              />
                            </Col>
                            <Col>
                              <Link
                                to="#"
                                className="text-muted font-weight-bold"
                              >
                                {image.name}
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
