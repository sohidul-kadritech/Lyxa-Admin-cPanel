import { TextField } from "@mui/material";
import React, { useEffect } from "react";
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
  updateAppSettings,
  updateMaxDiscount,
  updateNearByShopKey,
} from "../../store/Settings/settingsAction";
import { toast } from "react-toastify";
import { successMsg } from "../../helpers/successMsg";

const AppSettings = () => {
  const dispatch = useDispatch();
  const { nearByShopKm, loading, maxDiscount } = useSelector(
    (state) => state.settingsReducer
  );

  useEffect(() => {
    dispatch(getAllAppSettings());
  }, []);

  const updateSettings = () => {
    if (!nearByShopKm) {
      return successMsg("Enter Near By Shop Distance(KM)");
    }

    if (!maxDiscount) {
      return successMsg("Enter Max Discount Amount");
    }

    dispatch(updateAppSettings());
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
                  <Col lg={6}>
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Near Shop Distance(KM)"
                      variant="outlined"
                      placeholder="Enter near shop Distance"
                      value={nearByShopKm}
                      onChange={(e) =>
                        dispatch(updateNearByShopKey(e.target.value))
                      }
                      type="number"
                      required
                    />
                  </Col>
                  <Col lg={6} className="mt-3 mt-lg-0">
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Max Discount(Amount)"
                      variant="outlined"
                      placeholder="Enter max discount amount"
                      value={maxDiscount}
                      onChange={(e) =>
                        dispatch(updateMaxDiscount(e.target.value))
                      }
                      type="number"
                      required
                    />
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
