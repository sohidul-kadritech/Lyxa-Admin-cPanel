import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
} from "reactstrap";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import requestApi from "../../../network/httpRequest";
import { MAP_URL, SINGLE_USER } from "../../../network/Api";
import styled from "styled-components";
import Lightbox from "react-image-lightbox";
import Info from "./../../../components/Info";
import OrderTable from "../../../components/OrderTable";
import {
  getUserAllOrder,
  updateUserStatus,
} from "../../../store/Users/UsersAction";
import UserCradit from "../../../components/UserCradit";
import AppPagination from "../../../components/AppPagination";
import FlagsAndReviews from "../../../components/FlagsAndReviews";
import { callApi } from "../../../components/SingleApiCall";
import noPhoto from "../../../assets/images/noPhoto.jpg";
import InfoTwo from "../../../components/InfoTwo";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import TransgenderIcon from "@mui/icons-material/Transgender";
import CakeIcon from "@mui/icons-material/Cake";
import SavingsIcon from "@mui/icons-material/Savings";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";

const UserDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    users,
    orders,
    status: userStatus,
    paging,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    loading,
  } = useSelector((state) => state.usersReducer);
  const { status } = useSelector((state) => state.dropPayReducer);
  const { account_type, adminType } = JSON.parse(localStorage.getItem("admin"));

  const [user, setUser] = useState({});
  const [balAddModal, setBalAddModal] = useState(false);

  useEffect(async () => {
    if (id) {
      dispatch(getUserAllOrder(true, id));
      const findUser = users.find((user) => user.id == id);
      if (findUser) {
        setUser(findUser);
      } else {
        const data = await callApi(id, SINGLE_USER, "user");
        if (data) {
          setUser(data);
        } else {
          history.push("/users/list", { replace: true });
        }
      }
    }
  }, [id]);

  useEffect(async () => {
    if (status || userStatus) {
      setBalAddModal(false);
      const data = await callApi(id, SINGLE_USER, "user");
      setUser(data);
    }
  }, [status, userStatus]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs
              maintitle="lyxa"
              breadcrumbItem="Details"
              title="User"
              isRefresh={false}
            />

            <Row>
              <Col lg={6}>
                <Card className="card-height">
                  <CardBody>
                    <div className="d-flex justify-content-end">
                      <Button
                        outline={true}
                        color="success"
                        disabled={Object.keys(user).length === 0}
                        onClick={() => setBalAddModal(!balAddModal)}
                      >
                        Add/Remove Credit
                      </Button>
                      {account_type === "admin" && adminType === "admin" && (
                        <Button
                          outline={true}
                          color="success"
                          className="ms-3"
                          disabled={Object.keys(user).length === 0 || loading}
                          onClick={() =>
                            dispatch(
                              updateUserStatus(
                                user?._id,
                                user?.status === "active"
                                  ? "inactive"
                                  : "active"
                              )
                            )
                          }
                        >
                          {loading
                            ? "Loading..."
                            : user?.status === "active"
                            ? "Inactivate"
                            : "Activate"}
                        </Button>
                      )}
                    </div>
                    <hr />
                    <Row>
                      <Col xl={4}>
                        <ImgWrapper>
                          <img
                            className=" cursor-pointer"
                            alt="User"
                            src={user?.profile_photo ?? noPhoto}
                            loading="lazy"
                            height="100%"
                            width="100%"
                          />
                        </ImgWrapper>
                      </Col>
                      <Col xl={8} className="ps-3">
                        {Object.keys(user).length > 0 ? (
                          <>
                            <InfoTwo
                              value={`${user?.name} (Name)`}
                              Icon={PersonOutlineOutlinedIcon}
                            />
                            <InfoTwo
                              value={user?.email}
                              Icon={AlternateEmailOutlinedIcon}
                            />
                            <InfoTwo
                              value={`${user?.gender ?? "Unknown"} (Gender)`}
                              Icon={TransgenderIcon}
                            />
                            <InfoTwo
                              value={`${new Date(
                                user?.dob
                              ).toDateString()} (Birth Date)`}
                              Icon={CakeIcon}
                            />
                            <InfoTwo
                              value={`${user?.tempBalance} NGN (Lyxa Balance)`}
                              Icon={SavingsIcon}
                            />
                            <InfoTwo
                              value={`${user?.orderCompleted} (Orders)`}
                              Icon={ShoppingBasketIcon}
                            />
                            <InfoTwo
                              value={`${user?.status} (Status)`}
                              Icon={
                                user?.status === "active"
                                  ? ToggleOnIcon
                                  : ToggleOffIcon
                              }
                            />
                            <InfoTwo
                              value={`${new Date(
                                user?.createdAt
                              ).toDateString()} (Join Date)`}
                              Icon={HowToRegIcon}
                            />
                            <InfoTwo
                              Icon={RoomOutlinedIcon}
                              value={user?.address[0].address}
                              mapLink={`${MAP_URL}?z=10&t=m&q=loc:${user?.address[0]?.latitude}+${user?.address[0]?.longitude}`}
                            />
                          </>
                        ) : (
                          <Spinner color="danger" size="lg"></Spinner>
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={6}>
                <FlagsAndReviews flags={user?.flags} />
              </Col>
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
                      dispatch(getUserAllOrder(true, user?._id, page))
                    }
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* ADD / REMOVE BALANCE */}

        <Modal
          isOpen={balAddModal}
          toggle={() => {
            setBalAddModal(!balAddModal);
          }}
          centered={true}
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Add/Remove User Cradit</h5>
            <button
              type="button"
              onClick={() => {
                setBalAddModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <UserCradit user={user} />
          </div>
        </Modal>
      </GlobalWrapper>
    </React.Fragment>
  );
};

const ImgWrapper = styled.div`
  height: 150px;
  width: 150px;

  img {
    border: 1px solid #90f1c3;
    border-radius: 100px;
  }
`;

export default UserDetails;
