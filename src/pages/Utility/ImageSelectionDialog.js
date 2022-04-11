import React, { useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import {
  Container,
  Col,
  Row,
  Button,
  Spinner,
  Pagination,
  PaginationItem,
  PaginationLink,
  Label,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Modal
} from "reactstrap";
import Select from "react-select";
//Import Breadcrumb
import BreadcrumbGallery from "../../components/Common/BreadcrumbGallery";

//Lightbox
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

import "./page_gallery.scss";

import { useSelector, useDispatch } from "react-redux";
import {
  selectImageGallery,
  getGalleryList
} from "../../store/action/galleryAction";
import AppPagination from "../../components/AppPagination";
import {
  addFolderList,
  selectFolder
} from "../../store/action/uploadImage.action";
import FormUpload from "../Forms/FormUpload";
import { Link, useHistory, useLocation } from "react-router-dom";

const ImageSelectionDialog = ({ lisener }) => {
  const {
    galleryList,
    selectedImages,
    loading,
    paging,
    totalImage,
    limit,
    currentPage,
    haspreviousPage,
    hasNextPage
  } = useSelector(state => state.galleryReducer);
  const dispatch = useDispatch();
  const { search, pathname } = useLocation();
  const history = useHistory();

  const { folderList, selectedFolder } = useSelector(
    state => state.uploadImage
  );
  const { folderList: listFolder } = useSelector(state => state.imageReducer);

  const [photoIndex, setphotoIndex] = useState(0);
  const [isGallery, setisGallery] = useState(false);

  // const [selectedFolder,setSelectedFolder] = useState(null);

  const [filter, setFilter] = useState(null);
  const [modal_fullscreen, setmodal_fullscreen] = useState(false);

  useEffect(() => {
    dispatch(addFolderList(listFolder));
  }, []);

  // useEffect(() => {
  //  console.log(filter);
  // }, [filter]);

  // const uploadImageToggle = () => {
  //   modal_fullscreen
  // }

  function setpopovertop(index) {
    setphotoIndex(index);
    setisGallery(true);
  }

  useEffect(
    () => {
      if (!modal_fullscreen) {
        dispatch(getGalleryList({ folder: selectedFolder }));
      }
    },
    [selectedFolder, modal_fullscreen]
  );

  useEffect(
    () => {
      console.log("totalImage => ", totalImage);
    },
    [totalImage]
  );

  const selectImage = (gallery, key) => {
    dispatch(selectImageGallery(gallery, key));
  };

  // useEffect(
  //   () => {
  //     if (partnerId) {
  //       console.log(partnerId);
  //       const params = new URLSearchParams({ pID: partnerId });
  //       history.replace({ pathname: pathname, search: params.toString() });
  //     }
  //   },
  //   [partnerId]
  // );

  return (
    <React.Fragment>
      {isGallery
        ? <Lightbox
            mainSrc={selectedImages[photoIndex].workImg}
            nextSrc={selectedImages[(photoIndex + 1) % selectedImages.length]}
            prevSrc={
              selectedImages[
                (photoIndex + selectedImages.length - 1) % selectedImages.length
              ]
            }
            enableZoom={false}
            onCloseRequest={() => setisGallery(false)}
            onMovePrevRequest={() =>
              setphotoIndex(
                (selectedImages + selectedImages.length - 1) %
                  selectedImages.length
              )}
            onMoveNextRequest={() =>
              setphotoIndex((photoIndex + 1) % selectedImages.length)}
            imageCaption={"Project " + parseFloat(photoIndex + 1)}
          />
        : null}
      <div className="page-content">
        <MetaTags>
          <title>Gallery | Quicar - Admin Dashboard</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumbs */}

          <BreadcrumbGallery
            maintitle="Gallery"
            breadcrumbItem="Gallery"
            setmodal_fullscreen={setmodal_fullscreen}
          />

          <Col
            className="d-flex overflow-auto"
            style={{ marginBottom: "20px" }}
          >
            {selectedImages.map((item, index) => {
              {
                /* onClick={() => setpopovertop(index)} */
              }
              return (
                <div
                  className="position-relative d-flex justify-centent-center align-items-center "
                  style={{ borderRadius: "3px" }}
                  key={index}
                >
                  <img
                    className="cursor-pointer"
                    src={item.path}
                    style={{
                      width: "100px",
                      height: "70px",
                      objectFit: "cover",
                      border: "2px solid #dee2e6"
                    }}
                  />
                  <h1
                    className="position-absolute text-danger cursor-pointer"
                    style={{ left: "40%" }}
                  >
                    {selectedImages.length - index}
                  </h1>
                </div>
              );
            })}
          </Col>

          <Col lg="4" sm="6">
            <div className="mb-3">
              <Label> Select a Folder</Label>
              <Select
                value={selectedFolder}
                onChange={item => {
                  // console.log(item)
                  // setSelectedFolder(item)
                  dispatch(selectFolder(item));
                }}
                options={folderList}
                classNamePrefix="select2-selection"
              />
            </div>
          </Col>

          <Row style={{ transition: "all .5s" }}>
            <Col
              xl={selectedImages.length > 0 ? 8 : 12}
              md={selectedImages.length > 0 ? 8 : 12}
              sm={selectedImages.length > 0 ? 8 : 12}
            >
              {loading
                ? <div
                    style={{ width: "100%", height: "100vh" }}
                    className="d-flex justify-content-center"
                  >
                    <Spinner animation="border" variant="info" />
                  </div>
                : <div className="row">
                    {galleryList.map((gallery, key) => {
                      return (
                        <Col xl={3} md={6} key={key}>
                          <div
                            className="gallery-popup"
                            title="Open Imagination"
                            onClick={() => selectImage(gallery, key)}
                          >
                            <div className="project-item">
                              <div className="overlay-container">
                                <img
                                  src={gallery.path}
                                  alt="img"
                                  className="gallery-thumb-img"
                                  style={{
                                    maxHeight: "300px",
                                    objectFit: "cover"
                                  }}
                                />

                                <div
                                  className={`project-item-selected ${!selectedImages.find(
                                    item => item.id == gallery.id
                                  )
                                    ? "hide"
                                    : ""}`}
                                >
                                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{width:'150px'}}>
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg> */}

                                  <div className="check__wrap">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      style={{ width: "25px", height: "25px" }}
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                </div>

                                <div className="project-item-overlay">
                                  <h4>
                                    {gallery.name}
                                  </h4>
                                  <p>
                                    <img
                                      src={gallery.path}
                                      alt="user"
                                      className="avatar-sm rounded-circle"
                                    />
                                    <span className="ms-2">
                                      {gallery.auther}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                  </div>}
            </Col>

            {selectedImages.length > 0 &&
              <Col xl={4} md={4} sm={4}>
                {selectedImages.length > 0 &&
                  <div>
                    <img
                      src={`${selectedImages.length > 0
                        ? selectedImages[0].path
                        : ""}`}
                      alt="img"
                      className="gallery-thumb-img"
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                    <h5>
                      {selectedImages[0].name}
                    </h5>
                    <a
                      href={selectedImages[0].path}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}{selectedImages[0].path}
                    </a>
                    <div
                      onClick={() => lisener(selectedImages)}
                      style={{ padding: "30px 0px" }}
                    >
                      {" "}<Button color="primary" style={{ width: "100%" }}>
                        {" "}Select Image
                      </Button>
                    </div>
                  </div>}
              </Col>}
          </Row>

          <Row>
            <Col xl={12}>
              <div className="d-flex justify-content-center">
                <AppPagination
                  paging={paging}
                  hasNextPage={hasNextPage}
                  hasPreviousPage={haspreviousPage}
                  currentPage={currentPage}
                  lisener={_ => dispatch(getGalleryList({ page: _ }))}
                />
              </div>
            </Col>
          </Row>
        </Container>

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
            <FormUpload
              lisener={() => setmodal_fullscreen(!modal_fullscreen)}
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
      </div>
    </React.Fragment>
  );
};

export default ImageSelectionDialog;
