import {
  Paper,
  TextField,
  Select,
  OutlinedInput,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Grid,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, CardBody, CardTitle, Col, Container, Row, Spinner } from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import GlobalWrapper from "../../components/GlobalWrapper";
import {
  getAllAppSettings,
  removeSearchDeliveryBoyKm,
  updateAppSettings,
  updateCurrency,
  updateDropCreditLimit,
  updateMaxDiscount,
  updateNearByShopKey,
  updateSearchDeliveryBoyKm,
} from "../../store/Settings/settingsAction";
import { toast } from "react-toastify";
import currenciesList from "../../common/data/currencyList";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AppSettings = () => {
  const dispatch = useDispatch();
  const { loading, appSettingsOptions } = useSelector((state) => state.settingsReducer);

  const [areaChangeKey, setAreaChangeKey] = useState("");
  // const [updatesType, setUpdatesType] = useState([]);

  useEffect(() => {
    dispatch(getAllAppSettings());
  }, []);

  const updateSettings = (type) => {
    dispatch(updateAppSettings(type));
  };

  // DISPATCH AREA SEARCH KEY

  const handleKmAdd = (evt) => {
    const { name } = evt.target;
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();

      let value = areaChangeKey.trim();

      if (appSettingsOptions.searchDeliveryBoyKm.length === 3) {
        return toast.warn("Maximum 3 items can add", {
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

      // console.log({ value });

      if (value) {
        setAreaChangeKey("");
        dispatch(updateSearchDeliveryBoyKm(value));
      }

      // if (!updatesType.includes(name)) {
      //   setUpdatesType([...updatesType, name]);
      // }
    }
  };

  // CHECK FIELD UPDATE OR NOT

  // const checkIsUpdates = (e) => {
  //   const { name, value } = e.target;
  //   if (value != appSettingsOptions[name] && !updatesType.includes(name)) {
  //     setUpdatesType([...updatesType, name]);
  //   }
  // };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb maintitle="Lyxa" breadcrumbItem={"App Settings"} isRefresh={false} />
            <Grid container spacing={3}>
              {/* max discount */}
              <Grid item md={6}>
                <Card style={{ marginBottom: "0px" }}>
                  <CardBody>
                    <CardTitle>Max Discount</CardTitle>
                    <hr />
                    <Stack spacing={2}>
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="Max Discount(Amount)"
                        variant="outlined"
                        placeholder="Enter max discount"
                        value={appSettingsOptions?.maxDiscount ?? 0}
                        onChange={(e) => {
                          dispatch(updateMaxDiscount(e.target.value));
                          // checkIsUpdates(e);
                        }}
                        type="number"
                        name="maxDiscount"
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["maxDiscount"]);
                        }}
                        disabled={loading}
                        className="d-block"
                        style={{ width: "100%", padding: "10px 0" }}
                      >
                        {loading ? <Spinner animation="border" variant="success" size="sm"></Spinner> : "UPDATE"}
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Grid>
              {/* pay credit */}
              <Grid item md={6}>
                <Card style={{ marginBottom: "0px" }}>
                  <CardBody>
                    <CardTitle>Lyxa Pay Credit</CardTitle>
                    <hr />
                    <Stack spacing={2}>
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="VAT (Amount)"
                        variant="outlined"
                        placeholder="Enter max discount"
                        value={0}
                        onChange={(e) => {
                          console.log(e);
                        }}
                        type="number"
                        name="maxDiscount"
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["maxDiscount"]);
                        }}
                        disabled={loading}
                        className="d-block"
                        style={{ width: "100%", padding: "10px 0" }}
                      >
                        {loading ? <Spinner animation="border" variant="success" size="sm"></Spinner> : "UPDATE"}
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Grid>
              {/* Near shop distance */}
              <Grid item md={6}>
                <Card style={{ marginBottom: "0px" }}>
                  <CardBody>
                    <CardTitle>Near Shop Distance</CardTitle>
                    <hr />
                    <Stack spacing={2}>
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="Near Shop Distance(KM)"
                        variant="outlined"
                        placeholder="Enter near shop Distance"
                        value={appSettingsOptions?.nearByShopKm ?? 0}
                        onChange={(e) => {
                          dispatch(updateNearByShopKey(e.target.value));
                          // checkIsUpdates(e);
                        }}
                        type="number"
                        name="nearByShopKm"
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["nearByShopKm"]);
                        }}
                        disabled={loading}
                        className="d-block"
                        style={{ width: "100%", padding: "10px 0" }}
                      >
                        {loading ? <Spinner animation="border" variant="success" size="sm"></Spinner> : "UPDATE"}
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Grid>
              {/* currency */}
              <Grid item md={6}>
                <Card style={{ marginBottom: "0px" }}>
                  <CardBody>
                    <CardTitle>Currency</CardTitle>
                    <hr />
                    <Stack spacing={2}>
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel>Currency</InputLabel>
                        <Select
                          value={appSettingsOptions?.currency?.code ?? ""}
                          label="Currency"
                          onChange={(e) => {
                            const currencyObj = currenciesList.find(
                              (currencyObj) => currencyObj.code === e.target.value
                            );
                            dispatch(updateCurrency(currencyObj));
                            // checkIsUpdates(e);
                          }}
                          input={<OutlinedInput label="Currency" name="currency" />}
                          MenuProps={MenuProps}
                        >
                          {currenciesList.map(({ code, name }) => (
                            <MenuItem key={code} value={code}>
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["currency"]);
                        }}
                        disabled={loading}
                        className="d-block"
                        style={{ width: "100%", padding: "10px 0" }}
                      >
                        {loading ? <Spinner animation="border" variant="success" size="sm"></Spinner> : "UPDATE"}
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Grid>
              {/* lyxa pay credit */}
              <Grid item md={6}>
                <Card style={{ marginBottom: "0px" }}>
                  <CardBody>
                    <CardTitle>Lyxa Pay Limit</CardTitle>
                    <hr />
                    <Stack spacing={2}>
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="Lyxa pay limit credit"
                        variant="outlined"
                        placeholder="Enter drop pay limit credit "
                        value={appSettingsOptions?.maxCustomerServiceValue ?? 0}
                        onChange={(e) => {
                          dispatch(updateDropCreditLimit(e.target.value));
                          // checkIsUpdates(e);
                        }}
                        type="number"
                        name="maxCustomerServiceValue"
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["maxCustomerServiceValue"]);
                        }}
                        disabled={loading}
                        className="d-block"
                        style={{ width: "100%", padding: "10px 0" }}
                      >
                        {loading ? <Spinner animation="border" variant="success" size="sm"></Spinner> : "UPDATE"}
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Grid>
              {/* lyxa pay credit */}
              <Grid item md={6}>
                <Card style={{ marginBottom: "0px" }}>
                  <CardBody>
                    <CardTitle>Max Butler Item</CardTitle>
                    <hr />
                    <Stack spacing={2}>
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="Max Butler Item (Amount)"
                        variant="outlined"
                        placeholder="Enter max discount"
                        value={0}
                        onChange={(e) => {
                          // dispatch(updateMaxDiscount(e.target.value));
                          // checkIsUpdates(e);
                        }}
                        type="number"
                        name="maxDiscount"
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["maxDiscount"]);
                        }}
                        disabled={loading}
                        className="d-block"
                        style={{ width: "100%", padding: "10px 0" }}
                      >
                        {loading ? <Spinner animation="border" variant="success" size="sm"></Spinner> : "UPDATE"}
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Grid>
              {/* Delivery Boy Search Area */}
              <Grid item md={6}>
                <Card style={{ marginBottom: "0px" }}>
                  <CardBody>
                    <CardTitle>Delivery Boy Search</CardTitle>
                    <hr />
                    <Stack spacing={2}>
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="Delivery Boy Search Area"
                        variant="outlined"
                        placeholder="Type search area then press Enter"
                        value={areaChangeKey}
                        type="number"
                        onKeyDown={handleKmAdd}
                        onChange={(e) => setAreaChangeKey(e.target.value)}
                        name="searchDeliveryBoyKm"
                        // className="mb-1"
                      />
                      {appSettingsOptions?.searchDeliveryBoyKm?.length > 0 && (
                        <Paper className=" p-3">
                          {appSettingsOptions?.searchDeliveryBoyKm?.map((item, index) => (
                            <div className="tag__wrapper" key={index}>
                              {item}
                              <button
                                type="button"
                                className="button"
                                onClick={() => dispatch(removeSearchDeliveryBoyKm(index))}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </Paper>
                      )}
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["searchDeliveryBoyKm"]);
                        }}
                        disabled={loading}
                        className="d-block"
                        style={{ width: "100%", padding: "10px 0" }}
                      >
                        {loading ? <Spinner animation="border" variant="success" size="sm"></Spinner> : "UPDATE"}
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default AppSettings;
