import { Paper, TextField, Select, OutlinedInput, MenuItem, InputLabel, FormControl } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Card, CardBody, CardTitle, Col, Container, Input, Row, Spinner } from "reactstrap";
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
  const [updatesType, setUpdatesType] = useState([]);

  useEffect(() => {
    dispatch(getAllAppSettings());
  }, []);

  const updateSettings = () => {
    dispatch(updateAppSettings(updatesType));
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

      if (!updatesType.includes(name)) {
        setUpdatesType([...updatesType, name]);
      }
    }
  };

  // CHECK FIELD UPDATE OR NOT

  const checkIsUpdates = (e) => {
    const { name, value } = e.target;

    if (value != appSettingsOptions[name] && !updatesType.includes(name)) {
      setUpdatesType([...updatesType, name]);
    }
  };
  
  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb maintitle="Lyxa" breadcrumbItem={"App Settings"} isRefresh={false} />

            <Card>
              <CardBody>
                <CardTitle>Informations</CardTitle>
                <hr />

                <Row>
                  <Col lg={6}>
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Max Discount(Amount)"
                      variant="outlined"
                      placeholder="Enter max discount"
                      value={appSettingsOptions?.maxDiscount ?? 0}
                      onChange={(e) => {
                        dispatch(updateMaxDiscount(e.target.value));
                        checkIsUpdates(e);
                      }}
                      type="number"
                      name="maxDiscount"
                    />
                     <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="VAT (Amount)"
                      variant="outlined"
                      placeholder="Enter max discount"
                      value={0}
                      onChange={(e) => {
                        // dispatch(updateMaxDiscount(e.target.value));
                        // checkIsUpdates(e);
                      }}
                      type="number"
                      name="maxDiscount"
                      className="mt-4"
                    />
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Near Shop Distance(KM)"
                      variant="outlined"
                      placeholder="Enter near shop Distance"
                      value={appSettingsOptions?.nearByShopKm ?? 0}
                      onChange={(e) => {
                        dispatch(updateNearByShopKey(e.target.value));
                        checkIsUpdates(e);
                      }}
                      type="number"
                      name="nearByShopKm"
                      className="my-4"
                    />
                    <FormControl sx={{ width: "100%" }}>
                      <InputLabel>Currency</InputLabel>
                      <Select
                        value={appSettingsOptions?.currency ?? ""}
                        label="Currency"
                        onChange={(e) => {
                          dispatch(updateCurrency(e.target.value));
                          checkIsUpdates(e);
                        }}
                        input={<OutlinedInput label="Currency" name="currency" />}
                        MenuProps={MenuProps}
                      >
                        {currenciesList.map(({ key, value }) => (
                          <MenuItem key={key} value={key}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Col>

                  <Col lg={6} className="mt-3 mt-lg-0">
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Lyxa pay limit credit"
                      variant="outlined"
                      placeholder="Enter drop pay limit credit "
                      value={appSettingsOptions?.maxCustomerServiceValue ?? 0}
                      onChange={(e) => {
                        dispatch(updateDropCreditLimit(e.target.value));
                        checkIsUpdates(e);
                      }}
                      type="number"
                      name="maxCustomerServiceValue"
                    />
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
                      className="mt-4"
                    />
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
                      className="my-4"
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
                  </Col>
                </Row>

                <div className="d-flex justify-content-center mt-5 mb-2">
                  <Button color="success" style={{ padding: "10px 50px" }} onClick={updateSettings} disabled={loading}>
                    {loading ? <Spinner animation="border" variant="success" size="sm"></Spinner> : "UPDATE"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default AppSettings;
