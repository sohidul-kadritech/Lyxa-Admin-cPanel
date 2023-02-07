import {
  Paper,
  TextField,
  Select,
  OutlinedInput,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Container,
  Spinner,
} from "reactstrap";
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

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

const dataLoadingIntitial = {
  maxDiscount: false,
  vat: false,
  nearByShopKm: false,
  currency: false,
  maxCustomerServiceValue: false,
  maxCustomerButlerServiceValue: false,
  searchDeliveryBoyKm: false,
};

const AppSettings = () => {
  const dispatch = useDispatch();
  const { loading, appSettingsOptions } = useSelector(
    (state) => state.settingsReducer
  );
  const [areaChangeKey, setAreaChangeKey] = useState("");
  const [dataIsLoading, setDataIsLoading] = useState(dataLoadingIntitial);

  // get all settings
  useEffect(() => {
    dispatch(getAllAppSettings());
  }, []);

  // change state for buttons
  useEffect(() => {
    if (loading === false) {
      setDataIsLoading(dataLoadingIntitial);
    }
  }, [loading]);

  const updateSettings = (type) => {
    dispatch(updateAppSettings(type));
  };

  // dispatch area search key
  const handleKmAdd = (evt) => {
    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();

      let value = areaChangeKey.trim();

      if (appSettingsOptions.searchDeliveryBoyKm.length === 3) {
        return toast.warn("Maximum 3 items can add", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      if (value) {
        setAreaChangeKey("");
        dispatch(updateSearchDeliveryBoyKm(value));
      }
    }
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Lyxa"
              breadcrumbItem={"App Settings"}
              isRefresh={false}
            />
            <Grid container spacing={3}>
              {/* max discount */}
              <Grid item md={12}>
                <Card style={{ marginBottom: "10px" }}>
                  <CardBody>
                    <Stack spacing={2} direction="row">
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="Max Discount(Amount)"
                        variant="outlined"
                        placeholder="Enter max discount"
                        value={appSettingsOptions?.maxDiscount ?? 0}
                        onChange={(e) => {
                          dispatch(updateMaxDiscount(e.target.value));
                        }}
                        type="number"
                        name="maxDiscount"
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["maxDiscount"]);
                          setDataIsLoading((prev) => ({
                            ...prev,
                            maxDiscount: true,
                          }));
                        }}
                        disabled={dataIsLoading.maxDiscount}
                        className="d-block"
                        style={{
                          width: "10%",
                          padding: "10px 0",
                          backgroundColor: "#df1e32",
                          border: 0,
                        }}
                      >
                        {dataIsLoading.maxDiscount ? (
                          <Spinner
                            animation="border"
                            variant="success"
                            size="sm"
                          ></Spinner>
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </Stack>
                    <Stack
                      spacing={2}
                      direction="row"
                      style={{ marginTop: "25px" }}
                    >
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="VAT (Amount)"
                        variant="outlined"
                        placeholder="Enter VAT Amount"
                        value={0}
                        onChange={(e) => {
                          console.log(e);
                        }}
                        type="number"
                        name="vat"
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["vat"]);
                          setDataIsLoading((prev) => ({ ...prev, vat: true }));
                        }}
                        disabled={dataIsLoading.vat}
                        className="d-block"
                        style={{
                          width: "10%",
                          padding: "10px 0",
                          backgroundColor: "#df1e32",
                          border: 0,
                        }}
                      >
                        {dataIsLoading.vat ? (
                          <Spinner
                            animation="border"
                            variant="success"
                            size="sm"
                          ></Spinner>
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </Stack>
                    <Stack
                      spacing={2}
                      direction="row"
                      style={{ marginTop: "25px", marginBottom: "25px" }}
                    >
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="Near Shop Distance (KM)"
                        variant="outlined"
                        placeholder="Enter near shop Distance"
                        value={appSettingsOptions?.nearByShopKm ?? 0}
                        onChange={(e) => {
                          dispatch(updateNearByShopKey(e.target.value));
                        }}
                        type="number"
                        name="nearByShopKm"
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["nearByShopKm"]);
                          setDataIsLoading((prev) => ({
                            ...prev,
                            nearByShopKm: true,
                          }));
                        }}
                        disabled={dataIsLoading.nearByShopKm}
                        className="d-block"
                        style={{
                          width: "10%",
                          padding: "10px 0",
                          backgroundColor: "#df1e32",
                          border: 0,
                        }}
                      >
                        {dataIsLoading.nearByShopKm ? (
                          <Spinner
                            animation="border"
                            variant="success"
                            size="sm"
                          ></Spinner>
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </Stack>
                    <Stack spacing={2} direction="row">
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel>Currency</InputLabel>
                        <Select
                          value={appSettingsOptions?.currency?.code ?? ""}
                          label="Currency"
                          onChange={(e) => {
                            const currencyObj = currenciesList.find(
                              (currencyObj) =>
                                currencyObj.code === e.target.value
                            );
                            dispatch(updateCurrency(currencyObj));
                          }}
                          input={
                            <OutlinedInput label="Currency" name="currency" />
                          }
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
                          setDataIsLoading((prev) => ({
                            ...prev,
                            currency: true,
                          }));
                        }}
                        disabled={dataIsLoading.currency}
                        className="d-block"
                        style={{
                          width: "10%",
                          padding: "10px 0",
                          backgroundColor: "#df1e32",
                          border: 0,
                        }}
                      >
                        {dataIsLoading.currency ? (
                          <Spinner
                            animation="border"
                            variant="success"
                            size="sm"
                          ></Spinner>
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </Stack>
                    <Stack
                      spacing={2}
                      direction="row"
                      style={{ marginTop: "25px" }}
                    >
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="Lyxa pay limit"
                        variant="outlined"
                        placeholder="Enter drop pay limit credit "
                        value={appSettingsOptions?.maxCustomerServiceValue ?? 0}
                        onChange={(e) => {
                          dispatch(updateDropCreditLimit(e.target.value));
                          setDataIsLoading((prev) => ({
                            ...prev,
                            maxCustomerServiceValue: true,
                          }));
                        }}
                        type="number"
                        name="maxCustomerServiceValue"
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["maxCustomerServiceValue"]);
                          setDataIsLoading((prev) => ({
                            ...prev,
                            maxCustomerServiceValue: true,
                          }));
                        }}
                        disabled={dataIsLoading.maxCustomerServiceValue}
                        className="d-block"
                        style={{
                          width: "10%",
                          padding: "10px 0",
                          backgroundColor: "#df1e32",
                          border: 0,
                        }}
                      >
                        {dataIsLoading.maxCustomerServiceValue ? (
                          <Spinner
                            animation="border"
                            variant="success"
                            size="sm"
                          ></Spinner>
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </Stack>
                    <Stack
                      spacing={2}
                      direction="row"
                      style={{ marginTop: "25px" }}
                    >
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="Max Item Price (Butler)"
                        variant="outlined"
                        placeholder="Enter max amount"
                        value={0}
                        onChange={(e) => {
                          // dispatch(updateMaxDiscount(e.target.value));
                          // checkIsUpdates(e);
                        }}
                        type="number"
                        name="maxCustomerButlerServiceValue"
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["maxCustomerButlerServiceValue"]);
                          setDataIsLoading((prev) => ({
                            ...prev,
                            maxCustomerButlerServiceValue: true,
                          }));
                        }}
                        disabled={dataIsLoading.maxCustomerButlerServiceValue}
                        className="d-block"
                        style={{
                          width: "10%",
                          padding: "10px 0",
                          backgroundColor: "#df1e32",
                          border: 0,
                        }}
                      >
                        {dataIsLoading.maxCustomerButlerServiceValue ? (
                          <Spinner
                            animation="border"
                            variant="success"
                            size="sm"
                          ></Spinner>
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </Stack>

                    <Stack
                      spacing={2}
                      direction="row"
                      mb={2}
                      style={{ marginTop: "25px" }}
                    >
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
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["searchDeliveryBoyKm"]);
                          setDataIsLoading((prev) => ({
                            ...prev,
                            searchDeliveryBoyKm: true,
                          }));
                        }}
                        disabled={dataIsLoading.searchDeliveryBoyKm}
                        className="d-block"
                        style={{
                          width: "10%",
                          padding: "10px 0",
                          backgroundColor: "#df1e32",
                          border: 0,
                        }}
                      >
                        {dataIsLoading.searchDeliveryBoyKm ? (
                          <Spinner
                            animation="border"
                            variant="success"
                            size="sm"
                          ></Spinner>
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </Stack>
                    {appSettingsOptions?.searchDeliveryBoyKm?.length > 0 && (
                      <Paper className=" p-3">
                        {appSettingsOptions?.searchDeliveryBoyKm?.map(
                          (item, index) => (
                            <div className="tag__wrapper" key={index}>
                              {item}
                              <button
                                type="button"
                                className="button"
                                onClick={() =>
                                  dispatch(removeSearchDeliveryBoyKm(index))
                                }
                              >
                                &times;
                              </button>
                            </div>
                          )
                        )}
                      </Paper>
                    )}
                  </CardBody>
                </Card>
              </Grid>
              {/* pay credit */}
              {/* <Grid item md={12}>
                <Card style={{ marginBottom: "0px" }}>
                  <CardBody>
                    <CardTitle>Lyxa VAT</CardTitle>
                    <hr />
                    <Stack spacing={2} direction="row">
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="VAT (Amount)"
                        variant="outlined"
                        placeholder="Enter VAT Amount"
                        value={0}
                        onChange={(e) => {
                          console.log(e);
                        }}
                        type="number"
                        name="vat"
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["vat"]);
                          setDataIsLoading((prev) => ({ ...prev, vat: true }));
                        }}
                        disabled={dataIsLoading.vat}
                        className="d-block"
                        style={{ width: "100%", padding: "10px 0" }}
                      >
                        {dataIsLoading.vat ? (
                          <Spinner
                            animation="border"
                            variant="success"
                            size="sm"
                          ></Spinner>
                        ) : (
                          "UPDATE"
                        )}
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Grid> */}
              {/* Near shop distance */}
              {/* <Grid item md={12}>
                <Card style={{ marginBottom: "0px" }}>
                  <CardBody>
                    <CardTitle>Near Shop Distance</CardTitle>
                    <hr />
                    <Stack spacing={2} direction="row">
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="Near Shop Distance (KM)"
                        variant="outlined"
                        placeholder="Enter near shop Distance"
                        value={appSettingsOptions?.nearByShopKm ?? 0}
                        onChange={(e) => {
                          dispatch(updateNearByShopKey(e.target.value));
                        }}
                        type="number"
                        name="nearByShopKm"
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["nearByShopKm"]);
                          setDataIsLoading((prev) => ({
                            ...prev,
                            nearByShopKm: true,
                          }));
                        }}
                        disabled={dataIsLoading.nearByShopKm}
                        className="d-block"
                        style={{ width: "100%", padding: "10px 0" }}
                      >
                        {dataIsLoading.nearByShopKm ? (
                          <Spinner
                            animation="border"
                            variant="success"
                            size="sm"
                          ></Spinner>
                        ) : (
                          "UPDATE"
                        )}
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Grid> */}
              {/* currency */}
              {/* <Grid item md={12}>
                <Card style={{ marginBottom: "0px" }}>
                  <CardBody>
                    <CardTitle>Currency</CardTitle>
                    <hr />
                    <Stack spacing={2} direction="row">
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel>Currency</InputLabel>
                        <Select
                          value={appSettingsOptions?.currency?.code ?? ""}
                          label="Currency"
                          onChange={(e) => {
                            const currencyObj = currenciesList.find(
                              (currencyObj) =>
                                currencyObj.code === e.target.value
                            );
                            dispatch(updateCurrency(currencyObj));
                          }}
                          input={
                            <OutlinedInput label="Currency" name="currency" />
                          }
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
                          setDataIsLoading((prev) => ({
                            ...prev,
                            currency: true,
                          }));
                        }}
                        disabled={dataIsLoading.currency}
                        className="d-block"
                        style={{ width: "100%", padding: "10px 0" }}
                      >
                        {dataIsLoading.currency ? (
                          <Spinner
                            animation="border"
                            variant="success"
                            size="sm"
                          ></Spinner>
                        ) : (
                          "UPDATE"
                        )}
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Grid> */}
              {/* lyxa pay credit */}
              {/* <Grid item md={12}>
                <Card style={{ marginBottom: "0px" }}>
                  <CardBody>
                    <CardTitle>Lyxa Pay Limit</CardTitle>
                    <hr />
                    <Stack spacing={2} direction="row">
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="Lyxa pay limit"
                        variant="outlined"
                        placeholder="Enter drop pay limit credit "
                        value={appSettingsOptions?.maxCustomerServiceValue ?? 0}
                        onChange={(e) => {
                          dispatch(updateDropCreditLimit(e.target.value));
                          setDataIsLoading((prev) => ({
                            ...prev,
                            maxCustomerServiceValue: true,
                          }));
                        }}
                        type="number"
                        name="maxCustomerServiceValue"
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["maxCustomerServiceValue"]);
                          setDataIsLoading((prev) => ({
                            ...prev,
                            maxCustomerServiceValue: true,
                          }));
                        }}
                        disabled={dataIsLoading.maxCustomerServiceValue}
                        className="d-block"
                        style={{ width: "100%", padding: "10px 0" }}
                      >
                        {dataIsLoading.maxCustomerServiceValue ? (
                          <Spinner
                            animation="border"
                            variant="success"
                            size="sm"
                          ></Spinner>
                        ) : (
                          "UPDATE"
                        )}
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Grid> */}
              {/* lyxa pay credit */}
              {/* <Grid item md={12}>
                <Card style={{ marginBottom: "0px" }}>
                  <CardBody>
                    <CardTitle>Max Item Price (Butler)</CardTitle>
                    <hr />
                    <Stack spacing={2} direction="row">
                      <TextField
                        style={{ width: "100%" }}
                        id="outlined-basic"
                        label="Max Item Price"
                        variant="outlined"
                        placeholder="Enter max amount"
                        value={0}
                        onChange={(e) => {
                          // dispatch(updateMaxDiscount(e.target.value));
                          // checkIsUpdates(e);
                        }}
                        type="number"
                        name="maxCustomerButlerServiceValue"
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["maxCustomerButlerServiceValue"]);
                          setDataIsLoading((prev) => ({
                            ...prev,
                            maxCustomerButlerServiceValue: true,
                          }));
                        }}
                        disabled={dataIsLoading.maxCustomerButlerServiceValue}
                        className="d-block"
                        style={{ width: "100%", padding: "10px 0" }}
                      >
                        {dataIsLoading.maxCustomerButlerServiceValue ? (
                          <Spinner
                            animation="border"
                            variant="success"
                            size="sm"
                          ></Spinner>
                        ) : (
                          "UPDATE"
                        )}
                      </Button>
                    </Stack>
                  </CardBody>
                </Card>
              </Grid> */}
              {/* Delivery Boy Search Area */}
              {/* <Grid item md={12}>
                <Card style={{ marginBottom: "0px" }}>
                  <CardBody>
                    <CardTitle>Delivery Boy Search</CardTitle>
                    <hr />
                    <Stack spacing={2} direction="row" mb={2}>
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
                      />
                      <Button
                        color="success"
                        onClick={() => {
                          updateSettings(["searchDeliveryBoyKm"]);
                          setDataIsLoading((prev) => ({
                            ...prev,
                            searchDeliveryBoyKm: true,
                          }));
                        }}
                        disabled={dataIsLoading.searchDeliveryBoyKm}
                        className="d-block"
                        style={{ width: "100%", padding: "10px 0" }}
                      >
                        {dataIsLoading.searchDeliveryBoyKm ? (
                          <Spinner
                            animation="border"
                            variant="success"
                            size="sm"
                          ></Spinner>
                        ) : (
                          "UPDATE"
                        )}
                      </Button>
                    </Stack>
                    {appSettingsOptions?.searchDeliveryBoyKm?.length > 0 && (
                      <Paper className=" p-3">
                        {appSettingsOptions?.searchDeliveryBoyKm?.map(
                          (item, index) => (
                            <div className="tag__wrapper" key={index}>
                              {item}
                              <button
                                type="button"
                                className="button"
                                onClick={() =>
                                  dispatch(removeSearchDeliveryBoyKm(index))
                                }
                              >
                                &times;
                              </button>
                            </div>
                          )
                        )}
                      </Paper>
                    )}
                  </CardBody>
                </Card>
              </Grid> */}
            </Grid>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default AppSettings;
