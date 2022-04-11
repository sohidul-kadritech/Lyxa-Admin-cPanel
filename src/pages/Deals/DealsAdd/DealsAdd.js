
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  Label,
  Modal,
  Row,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Select from "react-select";
import ImageSelectionDialog from "../../Utility/ImageSelectionDialog";
import { removeAllSelectedGalleryImage } from "../../../store/action/galleryAction";
import { useDispatch } from "react-redux";

const DealsAdd = () => {
  const dispatch = useDispatch();

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const [modal_fullscreen, setmodal_fullscreen] = useState(false);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Add"}
              title="Deal"
              // loading={loading}
              // callList={callCarList}
              isRefresh={false}
            />

            <Row>
              <Col lg="4" sm="6">
                <div className="mb-3">
                  <Label> Select a Folder</Label>
                  <Select
                    // value={selectedFolder}
                    onChange={(item) => {
                      console.log(item);
                      // dispatch(selectFolder(item));
                    }}
                    options={options}
                    classNamePrefix="select2-selection"
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <CardTitle className="h4">Uplaod Image</CardTitle>
                    {/* <p className="card-title-desc">
                      Drag & drop file uploads with image previews.
                    </p> */}
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
                                // {...getRootProps()}
                                onClick={() => setmodal_fullscreen(true)}
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
                    <div className="text-center mt-4">
                      <button
                        type="button"
                        className="btn btn-primary waves-effect waves-light"
                        // onClick={uploadImage}
                      >
                        Upload Files
                      </button>
                      {/* {!loading ? (
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
                    )} */}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>

        <Modal
          size="xl"
          isOpen={modal_fullscreen}
          toggle={() => {
            setmodal_fullscreen(!modal_fullscreen);
          }}
          className="modal-fullscreen"
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="exampleModalFullscreenLabel">
              Select Image
            </h5>
            <button
              onClick={() => {
                setmodal_fullscreen(false);
              }}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <ImageSelectionDialog
              lisener={(list) => {
                const image = list[0];
                // console.log("full image---", carImage);
                // console.log("")
                // if (imageId == 1) {
                //   setCarSmartCardFont(image.path);
                // }
                // if (imageId == 2) {
                //   setCarSmartCardBack(image.path);
                // }
                // if (imageId == 3) {
                //   setCarImages([...carImages, image]);
                //   // console.log("images---", newArray)
                // }

                dispatch(removeAllSelectedGalleryImage());
                setmodal_fullscreen(!modal_fullscreen);
              }}
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={() => {
                setmodal_fullscreen(!modal_fullscreen);
              }}
              className="btn btn-secondary waves-effect"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </Modal>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default DealsAdd;
