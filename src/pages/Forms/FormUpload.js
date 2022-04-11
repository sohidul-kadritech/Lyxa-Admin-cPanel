import React, { useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import {
  Row,
  Col,
  Card,
  Form,
  CardBody,
  CardTitle,
  CardSubtitle,
  Container,
  Button,
  FormGroup,
  Input,
  InputGroup,
  Label,
} from "reactstrap";
import Dropzone from "react-dropzone";
// Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import { Link, useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  removeImage,
  selectImage,
  uploadMultipleImage,
  selectFolder,
  clearUploadImage,
  addFolderList,
} from "../../store/action/uploadImage.action";
import Select from "react-select";
//SweetAlert
import SweetAlert from "react-bootstrap-sweetalert";
import { UPLOAD_IMAGE_DONE } from "../../store/actionType";

const FormUpload = ({ lisener }) => {
  const route = useHistory();

  const dispatch = useDispatch();

  const {
    loading,
    selectedFiles,
    error,
    folderList,
    selectedFolder,
    uploadedImages,
  } = useSelector((state) => state.uploadImage);

  const { folderList: listFolder } = useSelector((state) => state.imageReducer);

  // function handleSelectGroup(item) {
  //   console.log(item);
  //   setSelectedFolder(item)
  // }

  useEffect(() => {
    dispatch(addFolderList(listFolder));
  }, []);

  useEffect(() => {
    if (uploadedImages && uploadedImages.length > 0) {
      dispatch(clearUploadImage());

      if (lisener != null) {
        lisener();
      } else {
        route.push("image-gallery");
      }
    }
  }, [uploadedImages]);

  useEffect(() => {
    if (error) {
      toast.warn(error, {
        // position: "bottom-right",
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [error]);

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    // setselectedFiles([...selectedFiles, ...files])

    dispatch(selectImage(files));
  }

  const removeSelection = (index) => {
    // const list = selectedFiles
    // list.splice(index, 1);
    // console.log(list);
    // setselectedFiles([...list])

    dispatch(removeImage(index));
  };

  const uploadImage = () => {
    if (selectedFiles.length <= 0) {
      return toast.warn("Select a Image", {
        // position: "bottom-right",
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    if (!selectedFolder) {
      return toast.warn("Select a Folder", {
        // position: "bottom-right",
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    if (selectedFolder.value == null) {
      return toast.warn("Select a Folder", {
        // position: "bottom-right",
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    if (selectedFiles.length > 0 && selectedFolder.value) {
      dispatch(uploadMultipleImage());
    }
  };

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

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Image Upload | Quicar - Admin Dashboard</title>
        </MetaTags>
        <Container fluid={true}>
          <Breadcrumbs
            maintitle="Gallery"
            breadcrumbItem="Upload Image"
            hideSettingBtn={true}
          />

          <Row>
            <Col lg="4" sm="6">
              <div className="mb-3">
                <Label> Select a Folder</Label>
                <Select
                  value={selectedFolder}
                  onChange={(item) => {
                    console.log(item);
                    dispatch(selectFolder(item));
                  }}
                  options={folderList}
                  classNamePrefix="select2-selection"
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <CardTitle className="h4">Dropzone</CardTitle>
                  <p className="card-title-desc">
                    Drag & drop file uploads with image previews.
                  </p>
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
                        {selectedFiles.map((f, i) => {
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
                                      onClick={() => removeSelection(i)}
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
                        })}
                      </div>
                    </Form>
                  </div>
                  <div className="text-center mt-4">
                    {!loading ? (
                      <button
                        type="button"
                        className="btn btn-primary waves-effect waves-light"
                        onClick={uploadImage}
                      >
                        Upload Files
                      </button>
                    ) : (
                      <div className="btn btn-primary waves-effect waves-light">
                        loading...
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default FormUpload;
