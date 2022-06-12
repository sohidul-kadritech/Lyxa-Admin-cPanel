import React, { useEffect, useState } from "react";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
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
  Spinner,
} from "reactstrap";
import Lightbox from "react-image-lightbox";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { ImageWrapper } from "../../Shops/ShopDetails/ShopDetails";

const DeliverymanDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const { loading, deliveryMans } = useSelector(
    (state) => state.deliveryManReducer
  );

  const [deliveryMan, setDeliveryMan] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    if (id) {
      const findMan = deliveryMans.find((man) => man._id === id);
      if (findMan) {
        console.log({ findMan });
        setDeliveryMan(findMan);
      } else {
        callApi(id);
      }
    }
  }, [id]);

  const callApi = async (manId) => {
    if (manId) {
      try {
        const {
          data: { status, error, data = null },
        } = await requestApi().request(SINGLE_DELIVERY_MAN, {
          params: {
            id: manId,
          },
        });
        if (status) {
          setDeliveryMan(data.delivery);
        } else {
          console.log(error);
        }
      } catch (error) {
        console.log(error.message);
      }
    } else {
      history.push("/deliveryman/list", { replace: true });
    }
  };

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
                <Card>
                  <CardBody>
                    <div className="d-flex justify-content-between">
                      <CardTitle>Delivery Man Informations</CardTitle>
                      <Button
                        outline={true}
                        color="primary"
                        onClick={() => history.push(`/deliveryman/edit/${id}`)}
                      >
                        Edit
                      </Button>
                    </div>
                    <hr className="my-2" />
                    <Row>
                      <Col className="d-flex justify-content-between  align-items-center mt-5 mt-md-0">
                        <div className="ps-4">
                          <Details>
                            <h5>Name:</h5>
                            <Value>{deliveryMan?.name}.</Value>
                          </Details>
                          <Details>
                            <h5>Email:</h5>
                            <Value>{deliveryMan?.email}.</Value>
                          </Details>
                          <Details>
                            <h5>Address:</h5>
                            <Value>{deliveryMan?.address?.address}.</Value>
                          </Details>

                          <Details>
                            <h5>Status:</h5>
                            <Value>{deliveryMan?.status}.</Value>
                          </Details>
                          <Details>
                            <h5>Live Status:</h5>
                            <Value>{deliveryMan?.liveStatus}.</Value>
                          </Details>
                          <Details>
                            <h5>Vahicle Type:</h5>
                            <Value>{deliveryMan?.vehicleType}.</Value>
                          </Details>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col xl={6}>
                <Card>
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
                            alt="Veltrix"
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
                            alt="Veltrix"
                            src={deliveryMan?.vehicleRegistrationDocument}
                            width="100%"
                          />
                          <small>Vahicle Document</small>
                        </ImageWrapper>
                        
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

const Details = styled.div`
  display: flex;
  /* justify-content: space-between; */
`;

const Value = styled.h5`
  color: #0321f3;
  font-style: italic;
  font-weight: 600;
  margin-left: 4px;
  /* padding-left: 5px; */
`;

export default DeliverymanDetails;
