import React, { useEffect, useState } from "react";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import requestApi from "../../../network/httpRequest";
import { SINGLE_DELIVERY_MAN } from "../../../network/Api";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import styled from "styled-components";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import Lightbox from "react-image-lightbox";

import {
  getDeliveryAllOrder,
  setDeliveryStatusFalse,
} from "../../../store/DeliveryMan/DeliveryManAction";
import Info from "../../../components/Info";
import OrderTable from "../../../components/OrderTable";
import AppPagination from "../../../components/AppPagination";
import Flags from "../../../components/Flags";
import { callApi } from "../../../components/SingleApiCall";

const DeliverymanDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    deliveryMans,
    orders,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
  } = useSelector((state) => state.deliveryManReducer);
  const { account_type, adminType } = JSON.parse(localStorage.getItem("admin"));

  const [deliveryMan, setDeliveryMan] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(async () => {
    if (id) {
      // dispatch(setDeliveryStatusFalse());
      dispatch(getDeliveryAllOrder(true, id));
      const findMan = deliveryMans.find((man) => man._id == id);
      if (findMan) {
        setDeliveryMan(findMan);
      } else {
        const data = await callApi(id, SINGLE_DELIVERY_MAN, 'delivery')
        if (data) {
          setDeliveryMan(data);
        } else {
          history.push("/deliveryman/list", { replace: true });
        }
      }
    }
  }, [id]);



  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Details"}
              title="Deliveryman"
              isRefresh={false}
            />

            {isOpen && (
              <Lightbox
                mainSrc={selectedImg}
                enableZoom={true}
                imageCaption="img"
                onCloseRequest={() => {
                  setIsOpen(!isOpen);
                }}
              />
            )}

            <Row>
              <Col lg={6}>
                <Card className="card-height">
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <CardTitle>Delivery Man Informations</CardTitle>
                      <div>
                        <Button
                          outline={true}
                          color="primary"
                          onClick={() => history.push(`/deliveryman/edit/${id}`)}
                        >
                          Edit
                        </Button>
                        {(account_type === 'admin' && adminType === 'admin') && <Button
                          outline={true}
                          color="primary"
                          onClick={() => history.push(`/add-wallet/single-delivery-transactions/${id}`)}
                          className='ms-2'
                        >
                          Payment history
                        </Button>}
                      </div>
                    </div>
                    <hr className="my-2" />
                    <div>
                      <Info title="Name" value={deliveryMan?.name} />
                      <Info title="Email" value={deliveryMan?.email} />
                      <Info title="Phone" value={deliveryMan?.number} />
                      <Info
                        title="Address"
                        value={deliveryMan?.address?.address}
                      />
                      <Info
                        title="Total Income"
                        value={`${deliveryMan?.totalIncome} NGN`}
                      />
                      <Info
                        title="Balance"
                        value={`${deliveryMan?.balance} NGN`}
                      />{" "}
                      <Info title="Total Orders" value={deliveryMan?.totalOrder} />
                      <Info title="Status" value={deliveryMan?.status} />
                      <Info
                        title="Live Status"
                        value={deliveryMan?.liveStatus}
                      />
                      <Info
                        title="Vahicle Type"
                        value={deliveryMan?.vehicleType}
                      />
                      <Info
                        title="Vahicle No"
                        value={deliveryMan?.vehicleNumber}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={6}>


                <Flags flags={deliveryMan?.flags} />

              </Col>
            </Row>

            <Row>
              <Col lg={6}>
                <Card className="card-height">
                  <CardBody>
                    <div>
                      <CardTitle>Images</CardTitle>
                      <hr />
                    </div>
                    <Row>
                      <Col md={6}>
                        <ImageWrapper
                          style={{
                            width: "100%",
                            height: "200px",
                            padding: "10px 0px",
                          }}
                        >
                          <img
                            onClick={() => {
                              setIsOpen(true);
                              setSelectedImg(deliveryMan?.nationalIdDocument);
                            }}
                            className="img-fluid cursor-pointer"
                            alt="NID"
                            src={deliveryMan?.nationalIdDocument}
                            width="100%"
                          />
                          <small>NID</small>
                        </ImageWrapper>
                      </Col>
                      <Col md={6}>
                        <ImageWrapper
                          style={{
                            width: "100%",
                            height: "200px",
                            padding: "10px 0px",
                          }}
                        >
                          <img
                            onClick={() => {
                              setIsOpen(true);
                              setSelectedImg(deliveryMan?.nationalIdDocument);
                            }}
                            className="img-fluid cursor-pointer"
                            alt="Vahicle Document"
                            src={deliveryMan?.vehicleRegistrationDocument}
                            width="100%"
                          />
                          <small>Vahicle Document</small>
                        </ImageWrapper>
                      </Col>
                    </Row>
                  </CardBody>
                </Card></Col>
            </Row>

            <div>
              <OrderTable orders={orders} />
            </div>
            <Row>
              <Col xl={12}>
                <div className="d-flex justify-content-center">
                  <AppPagination
                    paging={paging}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    currentPage={currentPage}
                    lisener={(page) =>
                      dispatch(
                        getDeliveryAllOrder(true, deliveryMan?._id, page)
                      )
                    }
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

const ImageWrapper = styled.div`
  text-align: center;
  img {
    object-fit: contain;
    width: 100%;
    height: 90%;
  }
`;

export default DeliverymanDetails;
