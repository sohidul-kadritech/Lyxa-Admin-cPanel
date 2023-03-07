/* eslint-disable max-len */
import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardTitle, Col, Container, Form, Modal, Row } from 'reactstrap';
import { pharmacyAndGroceryDeals, resturantDeals } from '../../../assets/staticData';
import formatBytes from '../../../common/imageFormatBytes';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import GlobalWrapper from '../../../components/GlobalWrapper';
import { successMsg } from '../../../helpers/successMsg';
// eslint-disable-next-line no-unused-vars
import { IMAGE_UPLOAD } from '../../../network/Api';
import requestApi from '../../../network/httpRequest';
import { removeAllSelectedGalleryImage } from '../../../store/action/galleryAction';
import { addDeal, editDeal, getAllDeal, getAllTags, updateTagsSearchKey } from '../../../store/Deal/dealAction';
import ImageSelectionDialog from '../../Utility/ImageSelectionDialog';

function DealsAdd() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const { loading, deals, status, tags, tagSearchKey } = useSelector((state) => state.dealReducer);
  const [modal_fullscreen, setmodal_fullscreen] = useState(false);
  const [shopType, setShopType] = useState('');
  const [dealType, setDealType] = useState('');
  const [image, setImage] = useState(null);
  const [percentage, setPercentage] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState('');
  const [requiredImage, setRequiredImage] = useState(false);
  const [tag, setTag] = useState('');

  // UPDATE DATA
  const updateData = (data) => {
    const { name, image, option, percentage, status, type, tag } = data;
    const findTag = tags.find((item) => item._id === tag);

    setTag(findTag);
    setName(name);
    setImage(image);
    setShopType(type);
    setDealType(option);
    setActiveStatus(status);
    setPercentage(percentage ?? '');
  };

  // CALL API
  // const callApi = async (dealId) => {
  //   if (dealId) {
  //     try {
  //       const {
  //         data: { status, error, data = null },
  //       } = await requestApi().request(SINGLE_DEAL + dealId);
  //       if (status) {
  //         updateData(data.deal);
  //       } else {
  //         successMsg(error, 'error');
  //       }
  //     } catch (error) {
  //       successMsg(error, 'error');
  //     }
  //   } else {
  //     history.push('/deals/list', { replace: true });
  //   }
  // };

  useEffect(() => {
    if (id) {
      const findDeal = deals.find((item) => item._id === id);

      if (findDeal) {
        updateData(findDeal);
      }
    }
  }, [id, deals]);

  useEffect(() => {
    if (deals?.length === 0) {
      dispatch(getAllDeal());
    }
  }, []);

  // GET ALL TAGS
  useEffect(() => {
    if (dealType === 'others' || tagSearchKey) {
      dispatch(getAllTags('food'));
    }
  }, [dealType, tagSearchKey]);

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

  // SUBMIT DATA
  const submitData = (image = null) => {
    const data = {
      name,
      type: shopType,
      option: dealType,
      percentage,
      image,
      tag: tag?._id,
    };
    if (id) {
      dispatch(
        editDeal({
          ...data,
          id,
          status: activeStatus,
        })
      );
    } else {
      dispatch(addDeal(data));
    }
  };

  const uploadImage = async () => {
    let url = null;
    setIsLoading(true);
    if (image) {
      if (typeof image === 'string') {
        url = image;
      } else {
        try {
          const formData = new FormData();
          formData.append('image', image);

          const { data } = await requestApi().request(IMAGE_UPLOAD, {
            method: 'POST',
            data: formData,
          });

          if (data.status) {
            setIsLoading(false);
            url = data.data.url;
          } else {
            console.log(data.error);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    }

    if (url) {
      submitData(url);
    }
  };

  // VALIDATION

  // eslint-disable-next-line consistent-return
  const submitDeal = (e) => {
    e.preventDefault();

    if (requiredImage && !image) {
      successMsg('Choose a image');
      return;
    }

    // check for existing deals
    const dupicate = deals.find(
      (item) =>
        item?.name?.toLowerCase().replace(/\s/g, '') === name?.toLowerCase().replace(/\s/g, '') &&
        item?.type === shopType
    );

    if (dupicate !== undefined) {
      successMsg('Deal name already used for this shop type');
      return;
    }

    if (shopType === 'restaurant' && image) {
      uploadImage();
    } else {
      submitData();
    }
  };

  // SUCCESS

  console.log({ status });

  useEffect(() => {
    if (status) {
      if (id) {
        history.goBack();
      } else {
        setName('');
        setShopType('');
        setDealType('');
        setPercentage('');
        setImage(null);
        setRequiredImage(false);
        setTag('');
        window.scroll(0, 0);
      }
    }
  }, [status]);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem={id ? 'Edit' : 'Add'} title="Deal" isRefresh={false} />

          <Form onSubmit={submitDeal}>
            <Card>
              <CardBody>
                <Row>
                  <Col lg={4}>
                    <TextField
                      type="text"
                      className="form-control"
                      placeholder="Enter Deal Name"
                      required
                      label="Deal Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Col>
                  <Col lg={4}>
                    <div className="my-3 my-lg-0">
                      <FormControl fullWidth required name="shopType">
                        <InputLabel id="demo-simple-select-label">Shop Type</InputLabel>
                        <Select
                          id="demo-simple-select"
                          value={shopType}
                          onChange={(e) => {
                            setShopType(e.target.value);
                            setDealType('');
                            setRequiredImage(false);
                          }}
                          label="Shop Type"
                        >
                          <MenuItem value="restaurant">Food</MenuItem>
                          <MenuItem value="pharmacy">Pharmacy</MenuItem>
                          <MenuItem value="grocery">Grocery</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </Col>
                  {shopType && (
                    <Col lg={4}>
                      <div>
                        <FormControl fullWidth required>
                          <InputLabel id="demo-simple-select-label">Deal Type</InputLabel>
                          <Select
                            id="demo-simple-select"
                            value={dealType}
                            onChange={(e) => setDealType(e.target.value)}
                            label="Deal Type"
                          >
                            {shopType === 'restaurant'
                              ? resturantDeals.map((item) => (
                                  <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                  </MenuItem>
                                ))
                              : pharmacyAndGroceryDeals.map((item) => (
                                  <MenuItem key={item.value} value={item.value}>
                                    {item.label}
                                  </MenuItem>
                                ))}
                          </Select>
                        </FormControl>
                      </div>
                    </Col>
                  )}
                </Row>
                <Row className="mt-0 mt-lg-3">
                  {dealType === 'percentage' && (
                    <Col lg={4} className="mt-3 my-lg-0">
                      <TextField
                        type="number"
                        name="percentage"
                        className="form-control"
                        placeholder="Enter Percentage"
                        required
                        label="Percentage"
                        value={percentage}
                        onChange={(e) => setPercentage(e.target.value)}
                      />
                    </Col>
                  )}
                  {dealType === 'others' && (
                    <Col lg={4} className="mt-3 my-lg-0">
                      <Autocomplete
                        className="cursor-pointer"
                        value={tag}
                        onChange={(event, newValue) => {
                          setTag(newValue);
                        }}
                        getOptionLabel={(option) => (option.name ? option.name : '')}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        inputValue={tagSearchKey}
                        onInputChange={(event, newInputValue) => {
                          dispatch(updateTagsSearchKey(newInputValue));
                        }}
                        id="controllable-states-demo"
                        options={tags.length > 0 ? tags : []}
                        sx={{ width: '100%' }}
                        renderInput={(params) => <TextField {...params} label="Select a Tag" required name="tag" />}
                        renderOption={(props, option) => (
                          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option?._id}>
                            {option?.name}
                          </Box>
                        )}
                      />
                    </Col>
                  )}
                  {id && (
                    <Col lg={4}>
                      <div className="mt-3 my-lg-0">
                        <FormControl fullWidth required>
                          <InputLabel id="demo-simple-select-label">Status</InputLabel>
                          <Select
                            id="demo-simple-select"
                            value={activeStatus}
                            onChange={(e) => {
                              setActiveStatus(e.target.value);
                            }}
                            label="Status"
                          >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </Col>
                  )}
                </Row>
              </CardBody>
            </Card>
            {shopType === 'restaurant' && (
              <div className="form-check">
                <input
                  className="form-check-input cursor-pointer"
                  type="checkbox"
                  value={requiredImage}
                  id="flexCheckDefault"
                  onChange={(e) => setRequiredImage(e.target.checked)}
                />
                <label className="form-check-label ms-1" style={{ fontSize: '16px' }} htmlFor="flexCheckDefault">
                  Upload Image
                </label>
              </div>
            )}
            {requiredImage && (
              <Card>
                <CardBody>
                  <CardTitle className="h4">Uplaod Image</CardTitle>
                  <div className="mb-5">
                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        handleAcceptedFiles(acceptedFiles);
                      }}
                      accept=".jpg, .jpeg, .png"
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
                                  style={{
                                    maxWidth: '80px',
                                  }}
                                  className=" bg-light"
                                  src={image.preview ? image.preview : image}
                                  alt=""
                                />
                              </Col>
                              <Col>
                                <Link to="#" className="text-muted font-weight-bold">
                                  {image.name ? image.name : 'Image'}
                                </Link>
                                <p className="mb-0">
                                  <strong>{image.formattedSize && image.formattedSize}</strong>
                                </p>
                              </Col>

                              <div
                                className="position-absolute"
                                style={{
                                  left: '0px',
                                  top: '0px',
                                  width: '100%',
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                }}
                              >
                                <i
                                  onClick={() => setImage(null)}
                                  className="mdi mdi-delete text-danger "
                                  style={{
                                    fontSize: '25px',
                                    cursor: 'pointer',
                                  }}
                                ></i>
                              </div>
                            </Row>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            <div className="d-flex justify-content-center mb-3">
              <Button disabled={isLoading || loading} color="success" type="submit" className="px-5">
                {isLoading || loading ? 'Loading...' : id ? 'Save' : 'Add'}
              </Button>
            </div>
          </Form>
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
            lisener={() => {
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
  );
}

export default DealsAdd;
