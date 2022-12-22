import React, { useState,useEffect } from "react";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Input,
  Modal,
  Row,
  Spinner,
} from "reactstrap";
import { TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ImageSelectionDialog from "../../Utility/ImageSelectionDialog";
import { removeAllSelectedGalleryImage } from "../../../store/action/galleryAction";
import { useDispatch,useSelector } from "react-redux";
import styled from "styled-components";
import YouTube from "react-youtube";
import { toast } from "react-toastify";
import { addTutorial } from "../../../store/tutorial/tutorialAction";

const TutorialAdd = () => {


  const dispatch = useDispatch();

  const {loading, status} = useSelector(state => state.tutorialReducer)

  const [modal_fullscreen, setmodal_fullscreen] = useState(false);
  const [thumbnail, setThumbnil] = useState("");
  const [title, setTitle] = useState("");
  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const [type, setType] = useState("");
  const [serial, setSerial] = useState("");

  const opts = {
    height: "200px",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  const handleSubmit = () => {
    if(thumbnail == "" || title == "" || youtubeVideoId == "" || type == "" || serial == "") {

      return toast.warn("Please Fillup All Information", {
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

    dispatch(addTutorial({
      thumbnail,
      title,
      youtubeVideoId,
      type,
      serial
    }))

  }

  useEffect(()=>{
    if(status){
      setTitle("");
      setThumbnil("");
      setType("");
      setSerial("");
      setYoutubeVideoId("");
    }
  },[status])

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Quicar"
              title="Tutorials"
              breadcrumbItem="Add"
              isRefresh={false}
              // loading={loading}
              // callList={callTutorialList}
            />

            <Card>
              <CardBody>
                <Row>
                  <Col lg={6}>
                    <TextField
                      id="outlined-required"
                      label="Title"
                      className="w-100"
                      multiline
                      maxRows={4}
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      required
                    />
                  </Col>
                  <Col lg={6} className="mt-3 mt-lg-0">
                    <TextField
                      id="outlined-required"
                      label="Serial"
                      className="w-100"
                      multiline
                      maxRows={4}
                      value={serial}
                      onChange={(event) => setSerial(event.target.value)}
                      required
                    />
                  </Col>
                </Row>

                <Row className="my-lg-3">
                  <Col lg={6} className="mt-3 mt-lg-0">
                    <div>
                      <FormControl fullWidth required>
                        <InputLabel id="demo-simple-select-label">
                          Type
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={type}
                          label="Status"
                          onChange={(event) => setType(event.target.value)}
                      
                        >
                          <MenuItem value={"partner"}>Partner</MenuItem>
                          <MenuItem value={"user"}>User</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </Col>
                  <Col lg={6} className="mt-3 mt-lg-0">
                    <TextField
                      id="outlined-required"
                      label="Youtube Video Id"
                      className="w-100"
                      multiline
                      maxRows={4}
                      value={youtubeVideoId}
                      onChange={(event) =>
                        setYoutubeVideoId(event.target.value)
                      }
                      required
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col lg={6}>
                    <div >
                      <h6>Thumbnil</h6>
                      <Card 
                        style={{ height: "160px" }}
                        className="cursor-pointer image__card"
                      >
                        <div
                          className="d-flex justify-content-center align-content-center h-100"
                          style={{ border: "1px solid rgb(207 207 207)" }}
                        >
                          {thumbnail ? (
                            <ImageView>
                              <>
                                <img
                                  src={thumbnail}
                                  className="img-thumbnail img__view"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                  }}
                                  alt=""
                                />
                                <div className="button__wrapper">
                                  <button
                                    className="btn btn-danger "
                                    // onClick={() => handleDelete(item.id)}
                                    onClick={() => setThumbnil("")}
                                  >
                                    <i className="fa fa-trash" />
                                  </button>
                                </div>
                              </>
                            </ImageView>
                          ) : (
                            <div
                              style={{ width: "100%", height: "100%" }}
                              className="d-flex justify-content-center align-items-center"
                              onClick={() => setmodal_fullscreen(true)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ width: "50px" }}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeWidth="2" d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </Col>
                  <Col lg={6}>
                    {youtubeVideoId && (
                      <YouTube videoId={youtubeVideoId} opts={opts} onError={error=> console.log(error)} />
                    )}
                  </Col>
                </Row>

                <div className="d-flex justify-content-center pt-5">
                  <Button color="primary" style={{ width: "250px" }} onClick={handleSubmit}>
                    {loading ? <Spinner animation="border" variant="success" size="sm"></Spinner> : "ADD"}
                    
                  </Button>
                </div>
              </CardBody>
            </Card>
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
                const image = list[0].path;
                // console.log(list[0].path);

                setThumbnil(image);

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

const ImageView = styled.div`
  width: 100% !important;
  max-width: 300px;

  position: relative;
  width: 100%;

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
      background-color: yellow;
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



export default TutorialAdd;
