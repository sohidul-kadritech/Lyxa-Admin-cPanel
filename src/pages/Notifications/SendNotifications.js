import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Autocomplete,
  Box,
  Tooltip,
} from "@mui/material";
import { Editor } from "react-draft-wysiwyg";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import {
  CardBody,
  CardTitle,
  Col,
  Container,
  Card,
  Form,
  Row,
  Label,
  Button,
  Spinner,
} from "reactstrap";
import { accountTypeOptions } from "../../assets/staticData";
import Breadcrumb from "../../components/Common/Breadcrumb";
import GlobalWrapper from "../../components/GlobalWrapper";
import {
  convertFromRaw,
  convertToRaw,
  ContentState,
  EditorState,
} from "draft-js";
import { Link } from "react-router-dom";
import formatBytes from "../../common/imageFormatBytes";
import { convertToHTML } from "draft-convert";
import { useDispatch, useSelector } from "react-redux";
import { updateSearchKey, userList } from "../../store/Users/UsersAction";
import { getAllShop, updateShopSearchKey } from "../../store/Shop/shopAction";
import {
  allDeliveryMan,
  updateDeliveryManSearchKey,
} from "../../store/DeliveryMan/DeliveryManAction";
import { successMsg } from "../../helpers/successMsg";
import requestApi from "../../network/httpRequest";
import { IMAGE_UPLOAD } from "../../network/Api";
import { createNotification } from "../../store/Notification/notificationAction";

const SendNotifications = () => {
  const dispatch = useDispatch();
  const { users, searchKey: userSearchKey } = useSelector(
    (state) => state.usersReducer
  );
  const { searchKey: shopSearchKey, shops } = useSelector(
    (state) => state.shopReducer
  );
  const { deliveryMans, searchKey: riderSearchKey } = useSelector(
    (state) => state.deliveryManReducer
  );

  const { status, loading } = useSelector((state) => state.notificationReducer);

  const [notification, setNotification] = useState({
    title: "",
    accountType: "",
    type: "",
    description: "",
    descriptionHtml: "",
    image: null,
    byAdmin: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [editorState, setEditorState] = useState(() => {
    EditorState.createEmpty();
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotification({ ...notification, [name]: value });
    (name === "type" || name === "accountType") && setUser(null);
  };

  const handleAcceptedFiles = (files) => {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setNotification({ ...notification, image: files[0] });
  };

  const updateDescription = async (state) => {
    setEditorState(state);
    let currentContentAsHTML =
      editorState && convertToHTML(editorState?.getCurrentContent());
    // // let currentContextAsRow = convertToRaw(editorState?.getCurrentContent())
    //   ?.blocks[0]?.text;
    setNotification({
      ...notification,
      descriptionHtml: currentContentAsHTML,
    });
  };

  // GET USER/SHOP/DELIVERY LIST

  useEffect(() => {
    if (notification.type === "specific") {
      if (notification.accountType === "user") {
        if (userSearchKey) {
          dispatch(userList(true));
        }
      } else if (notification.accountType === "shop") {
        if (shopSearchKey) {
          dispatch(getAllShop(true));
        }
      } else {
        if (riderSearchKey) {
          dispatch(allDeliveryMan(true));
        }
      }
    }
  }, [
    notification.type,
    notification.accountType,
    userSearchKey,
    shopSearchKey,
    riderSearchKey,
  ]);

  const addNotification = (e) => {
    // console.log()
    e.preventDefault();
    if (!notification.image) {
      return successMsg("Upload a image", "error");
    }
    if (!notification.description) {
      return successMsg("Enter descriptions", "error");
    }

    //  UPLAOD IMAGE TO SERVER

    if (typeof notification.image === "string") {
      submitData(notification.image);
    } else {
      imageUploadToServer();
    }
  };

  const imageUploadToServer = async () => {
    try {
      setIsLoading(true);
      let formData = new FormData();
      formData.append("image", notification?.image);

      const { data } = await requestApi().request(IMAGE_UPLOAD, {
        method: "POST",
        data: formData,
      });

      if (data.status) {
        setIsLoading(false);
        submitData(data.data.url);
      } else {
        setIsLoading(false);
        return successMsg(data.error, "error");
      }
    } catch (error) {
      setIsLoading(false);
      return successMsg("Something went wrong", "error");
    }
  };

  // SUBMIT DATA

  const submitData = (image) => {
    dispatch(
      createNotification({
        ...notification,
        image,
        [notification.accountType]: user?._id ?? "",
      })
    );
  };

  useEffect(() => {
    if (status) {
      setNotification({
        title: "",
        accountType: "",
        type: "",
        description: "",
        descriptionHtml: "",
        image: null,
        byAdmin: true,
      });
      setUser(null);
    }
  }, [status]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Send Notifications"
              //   loading={loading}
              //   callList={callSellerList}
              isRefresh={false}
            />

            <Card>
              <CardBody>
                <CardTitle>Notification Infomations</CardTitle>
                <hr />
                <Form onSubmit={addNotification}>
                  <Row>
                    <Col lg={6}>
                      <div className="mb-4">
                        <TextField
                          type="text"
                          className="form-control"
                          placeholder="Enter notification title"
                          required
                          label="Title"
                          name="title"
                          value={notification.title}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="mb-4">
                        <FormControl fullWidth required>
                          <InputLabel id="demo-simple-select-label">
                            Account Type
                          </InputLabel>
                          <Select
                            required
                            id="demo-simple-select"
                            name="accountType"
                            value={notification.accountType}
                            onChange={handleInputChange}
                            label="Account Type"
                          >
                            {accountTypeOptions.map((item, index) => (
                              <MenuItem key={index} value={item.value}>
                                {item.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      <div className="mb-5">
                        <Label>Image</Label>
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
                          {notification.image && (
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
                                        notification?.image.preview
                                          ? notification?.image.preview
                                          : notification?.image
                                      }
                                      alt=""
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {notification?.image?.name
                                        ? notification?.image?.name
                                        : "Image"}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>
                                        {notification?.image?.formattedSize &&
                                          notification?.image?.formattedSize}
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
                                      onClick={() =>
                                        setNotification({
                                          ...notification,
                                          image: null,
                                        })
                                      }
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
                    <Col lg={6}>
                      <div className="mb-4">
                        <Tooltip
                          title={
                            !notification.accountType
                              ? "Select account type"
                              : ""
                          }
                        >
                          <FormControl fullWidth required>
                            <InputLabel id="demo-simple-select-label">
                              Type
                            </InputLabel>
                            <Select
                              required
                              id="demo-simple-select"
                              value={notification.type}
                              onChange={handleInputChange}
                              label="Type"
                              name="type"
                              disabled={!notification.accountType}
                            >
                              <MenuItem value="global">Global</MenuItem>
                              <MenuItem value="specific">Specific</MenuItem>
                            </Select>
                          </FormControl>
                        </Tooltip>
                      </div>
                      <div className="mb-4">
                        {notification.type === "specific" && (
                          <Autocomplete
                            className="cursor-pointer"
                            value={user}
                            onChange={(event, newValue) => {
                              setUser(newValue);
                            }}
                            getOptionLabel={(option, index) =>
                              option.name
                                ? option.name
                                : option.shopName
                                ? option.shopName
                                : ""
                            }
                            isOptionEqualToValue={(option, value) =>
                              option?._id === value?._id
                            }
                            inputValue={
                              notification.accountType === "user"
                                ? userSearchKey
                                : notification.accountType === "shop"
                                ? shopSearchKey
                                : riderSearchKey
                            }
                            onInputChange={(event, newInputValue) => {
                              notification.accountType === "user"
                                ? dispatch(updateSearchKey(newInputValue))
                                : notification.accountType === "shop"
                                ? dispatch(updateShopSearchKey(newInputValue))
                                : dispatch(
                                    updateDeliveryManSearchKey(newInputValue)
                                  );
                            }}
                            id="controllable-states-demo"
                            options={
                              notification.accountType === "user"
                                ? users
                                : notification.accountType === "shop"
                                ? shops
                                : deliveryMans
                            }
                            sx={{ width: "100%" }}
                            renderInput={(params, index) => (
                              <TextField
                                {...params}
                                label={`Select a ${notification.accountType}`}
                                required
                              />
                            )}
                            renderOption={(props, option) => (
                              <Box
                                component="li"
                                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                                {...props}
                                key={option._id}
                              >
                                {option.shopLogo && (
                                  <img
                                    loading="lazy"
                                    width="60"
                                    src={option.shopLogo}
                                    alt=""
                                  />
                                )}
                                {option.name ?? option.shopName}
                              </Box>
                            )}
                          />
                        )}
                      </div>
                      <div className="mb-4">
                        <Label>Descriptions</Label>
                        <Editor
                          onEditorStateChange={updateDescription}
                          toolbarClassName="toolbarClassName"
                          wrapperClassName="wrapperClassName"
                          editorClassName="editorClassName"
                          editorState={editorState}
                          defaultEditorState={editorState}
                          onChange={(e) =>
                            setNotification({
                              ...notification,
                              description: e.blocks[0].text,
                            })
                          }
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-center">
                    <Button
                      color="success"
                      size="lg"
                      className="px-4"
                      type="submit"
                      style={{ width: "150px" }}
                      disabled={loading || isLoading}
                    >
                      {loading || isLoading ? (
                        <Spinner color="danger" size="sm"></Spinner>
                      ) : (
                        "Submit"
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

export default SendNotifications;
