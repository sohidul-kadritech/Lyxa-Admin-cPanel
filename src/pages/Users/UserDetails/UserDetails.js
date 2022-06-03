import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import requestApi from "../../../network/httpRequest";
import { SINGLE_USER } from "../../../network/Api";
import styled from "styled-components";
import Lightbox from "react-image-lightbox";

const UserDetails = () => {
  const { id } = useParams();
  const history = useHistory();

  const { loading, users } = useSelector((state) => state.usersReducer);

  const [user, setUser] = useState({});

  useEffect(() => {
    if (id) {
      const findUser = users.find((user) => user.id == id);
      if (findUser) {
        setUser(findUser);
      } else {
        // console.log("call api---");
        callApi(id);
      }
    } else {
      history.push("/users/list", { replace: true });
    }
  }, [id]);

  //   CALL API FOR SINGLE USER

  const callApi = async (userId) => {
    try {
      const { data } = await requestApi().request(SINGLE_USER, {
        params: {
          id: userId,
        },
      });

      if (data.status) {
        // console.log(data.data.user);
        setUser(data.data.user);
      }

      console.log("user data", data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs
              maintitle="Drop"
              breadcrumbItem="Details"
              title="User"
              isRefresh={false}
              //   loading={loading}
              //   callList={callColorList}
            />

            {/* {isOpen && (
              <Lightbox
                mainSrc={selectedImg}
                enableZoom={true}
                imageCaption="img"
                onCloseRequest={() => {
                  setIsOpen(!isOpen);
                }}
              />
            )} */}



            <Row>
              <Col md={6}>
                <Card>
                  <CardBody>
                    <Details>
                      <h5 className="title">Name:</h5>
                      <h4 className="value">{user.name}</h4>
                    </Details>

                    <Details>
                      <h5 className="title">Gmail:</h5>
                      <h4 className="value">{user.email}</h4>
                    </Details>
                    <Details>
                      <h5 className="title">Gender:</h5>
                      <h4 className="value">{user.gender}</h4>
                    </Details>
                    <Details>
                      <h5 className="title">Birth Date:</h5>
                      <h4 className="value">
                        {new Date(user.dob).toDateString()}
                      </h4>
                    </Details>
                    <Details>
                      <h5 className="title">status:</h5>
                      <h4 className="value">{user.status}</h4>
                    </Details>
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

const ImageWrapper = styled.div`
  text-align: center;
  border-right: 1px solid black;
  @media (max-width: 1200px) {
    border-right: none;
  }
  img {
    object-fit: contain;
    width: 100%;
    height: 90%;
  }
`;

const Details = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /* @media (max-width: 1200px) {
    justify-content: center;
  } */

  .title {
    color: black;
    margin-right: 8px px;
    font-weight: 600;
    margin-right: 10px;
  }
  .value {
    font-family: "themify";
    font-weight: 600;
    color: #0e0c0c;
  }
`;

export default UserDetails;
