import { Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import GlobalWrapper from "../../components/GlobalWrapper";
import {
  getAllAppSettings,
  removeSearchDeliveryBoyKm,
  updateAppSettings,
  updateMaxDiscount,
  updateNearByShopKey,
  updateSearchDeliveryBoyKm,
} from "../../store/Settings/settingsAction";
import { toast } from "react-toastify";
import { successMsg } from "../../helpers/successMsg";

const AppSettings = () => {
  const dispatch = useDispatch();
  const { loading, appSettingsOptions } = useSelector(
    (state) => state.settingsReducer
  );

  const [areaChangeKey, setAreaChangeKey] = useState("");

  useEffect(() => {
    dispatch(getAllAppSettings());
  }, []);

  const updateSettings = () => {
    if (!appSettingsOptions.nearByShopKm) {
      return successMsg("Enter Near By Shop Distance(KM)");
    }

    if (!appSettingsOptions.maxDiscount) {
      return successMsg("Enter Max Discount Amount");
    }

    dispatch(updateAppSettings());
  };

  // DISPATCH AREA SEARCH KEY

  const handleKmAdd = (evt) => {
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
    }
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"App Settings"}
              isRefresh={false}
            />

            <Card>
              <CardBody>
                <CardTitle>Informations</CardTitle>
                <hr />
                <Row>
                  <Col lg={4}>
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Near Shop Distance(KM)"
                      variant="outlined"
                      placeholder="Enter near shop Distance"
                      value={appSettingsOptions?.nearByShopKm}
                      onChange={(e) =>
                        dispatch(updateNearByShopKey(e.target.value))
                      }
                      type="number"
                      required
                    />
                  </Col>
                  <Col lg={4} className="mt-3 mt-lg-0">
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Max Discount(Amount)"
                      variant="outlined"
                      placeholder="Enter near shop Distance"
                      value={appSettingsOptions?.maxDiscount}
                      onChange={(e) =>
                        dispatch(updateMaxDiscount(e.target.value))
                      }
                      type="number"
                      required
                    />
                  </Col>
                  <Col lg={4} className="my-3 my-lg-0">
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Delivery Boy Search Area"
                      variant="outlined"
                      placeholder="Press Enter delivery boy find Around Area"
                      value={areaChangeKey}
                      type="number"
                      onKeyDown={handleKmAdd}
                      onChange={(e) => setAreaChangeKey(e.target.value)}
                      required
                    />
                    {appSettingsOptions?.searchDeliveryBoyKm.length > 0 && (
                      <Paper className="mt-4 p-3">
                        {appSettingsOptions?.searchDeliveryBoyKm.map(
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
                  </Col>
                </Row>

                <div className="d-flex justify-content-center mt-5 mb-2">
                  <Button
                    color="success"
                    style={{ padding: "10px 50px" }}
                    onClick={updateSettings}
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner
                        animation="border"
                        variant="success"
                        size="sm"
                      ></Spinner>
                    ) : (
                      "UPDATE"
                    )}
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
