import React, { useEffect, useState } from "react";
import { Paper, TextField } from "@mui/material";
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
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAdminSettings,
  updateAdminSettings,
  updateDeliveryFee,
  updateGoogleMapApiKey,
  updateSearchDeliveryBoyKm,  
  removeSearchDeliveryBoyKm
} from "../../store/Settings/settingsAction";
import { toast } from "react-toastify";

const AdminSettings = () => {
  const dispatch = useDispatch();

  const { googleMapKey, loading, deliveryFeePerKm,searchDeliveryBoyKm } = useSelector(
    (state) => state.settingsReducer
  );

  const [areaChangeKey, setAreaChangeKey] = useState("");

  useEffect(() => {
    dispatch(getAllAdminSettings());
  }, []);

  // DISPATCH AREA SEARCH KEY

  const handleKmAdd = (evt) => {

    if (["Enter", "Tab", ","].includes(evt.key)) {
      evt.preventDefault();

      let value = areaChangeKey.trim();

      if (value) {
        setAreaChangeKey("")
        dispatch(updateSearchDeliveryBoyKm(value))
      }
    }
  };

  // DISPATCH REMOVE KM 



  const updateSettings = () => {
    if (!googleMapKey) {
      return toast.warn("Add Google Map Key", {
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

    dispatch(updateAdminSettings());
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Admin Settings"}
              // loading={loading}
              // callList={callCuisineList}
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
                      label="Google Map Key"
                      variant="outlined"
                      placeholder="Enter Google Map Key"
                      value={googleMapKey}
                      onChange={(e) =>
                        dispatch(updateGoogleMapApiKey(e.target.value))
                      }
                      required
                    />
                  </Col>
                  <Col lg={4} className="my-3 my-lg-0">
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Deliver Fee(per/km)"
                      variant="outlined"
                      placeholder="Enter Delivery Fee Per/KM"
                      
                      value={deliveryFeePerKm}
                      type="number"
                      onChange={(e) =>
                        dispatch(updateDeliveryFee(e.target.value))
                      }
                      required
                    />
                  </Col>

                  <Col lg={4} className="my-3 my-lg-0">
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Delivery Boy Around Area"
                      variant="outlined"
                      placeholder="Press Enter delivery boy find Around Area"
                      value={areaChangeKey}
                      type="number"
                      onKeyDown={handleKmAdd}
                      onChange={e => setAreaChangeKey(e.target.value)}

                      required
                    />
                    {searchDeliveryBoyKm.length > 0 && (
                        <Paper className="mt-4 p-3">
                          {searchDeliveryBoyKm.map((item, index) => (
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
                  <Button
                    color="success"
                    style={{ padding: "10px 50px" }}
                    onClick={updateSettings}
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

export default AdminSettings;
