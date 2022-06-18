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
  updateNearByShopKey,
} from "../../store/Settings/settingsAction";
import { toast } from "react-toastify";

const AppSettings = () => {
  const dispatch = useDispatch();
  const { nearByShopKm, loading } = useSelector(
    (state) => state.settingsReducer
  );

  useEffect(() => {
    dispatch(getAllAppSettings());
  }, []);

  const updateSettings = () => {
    if (!nearByShopKm) {
      return toast.warn("Enter Near Shop Distance(KM)", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
                      label="Shop Distance(KM)"
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
