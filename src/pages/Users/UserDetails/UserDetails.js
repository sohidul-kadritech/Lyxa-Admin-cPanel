import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Modal, Row, Spinner } from "reactstrap";
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
import { getUserAllOrder, updateUserStatus } from "../../../store/Users/UsersAction";
import UserCradit from "../../../components/UserCradit";
import AppPagination from "../../../components/AppPagination";
import FlagsAndReviews from "../../../components/FlagsAndReviews";
import { callApi } from "../../../components/SingleApiCall";
import noPhoto from "../../../assets/images/noPhoto.jpg";
import InfoTwo from "../../../components/InfoTwo";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import ContactsIcon from "@mui/icons-material/Contacts";
import TransgenderIcon from "@mui/icons-material/Transgender";
import CakeIcon from "@mui/icons-material/Cake";
import SavingsIcon from "@mui/icons-material/Savings";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import InfoTwoWrapper from "../../../components/InfoTwoWrapper";

const UserDetails = () => {
  const currency = useSelector((store) => store.settingsReducer.appSettingsOptions.currency.code).toUpperCase();
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
  const { account_type, adminType } = useSelector((store) => store.Login.admin);

  const [user, setUser] = useState({});
  const [balAddModal, setBalAddModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getUserAllOrder(true, id));
      const findUser = users.find((user) => user.id == id);
      if (findUser) {
        setUser(findUser);
      } else {
        (async function getSingleUser() {
          const data = await callApi(id, SINGLE_USER, "user");
          if (data) {
            setUser(data);
          } else {
            history.push("/users/list", { replace: true });
          }
        })();
      }
    }
  }, [id]);

  useEffect(() => {
    if (status || userStatus) {
      setBalAddModal(false);
      (async function getSingleUser() {
        const data = await callApi(id, SINGLE_USER, "user");
        if (data) {
          setUser(data);
        } else {
          history.push("/users/list", { replace: true });
        }
      })();
    }
  }, [status, userStatus]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs maintitle="lyxa" breadcrumbItem="Details" title="User" isRefresh={false} />

            <Row>
              <Col lg={6}>
                <Card className="card-height">
                  <CardBody>
                    <div className="d-flex justify-content-between align-items-center">
                      <div style={{ width: "60px", height: "60px", borderRadius: "50%", overflow: "hidden" }}>
                        <img
                          className=" cursor-pointer"
                          alt="User"
                          src={user?.profile_photo ?? noPhoto}
                          loading="lazy"
                          height="100%"
                          width="100%"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className="d-flex justify-content-end align-items-center">
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
                              dispatch(updateUserStatus(user?._id, user?.status === "active" ? "inactive" : "active"))
                            }
                          >
                            {loading ? "Loading..." : user?.status === "active" ? "Inactivate" : "Activate"}
                          </Button>
                        )}
                      </div>
                    </div>

                    <hr />
                    <Row>
                      <Col xl={12} className="ps-3">
                        {Object.keys(user).length > 0 ? (
                          <InfoTwoWrapper>
                            <InfoTwo name={"Name"} value={`${user?.name}`} Icon={PersonOutlineOutlinedIcon} />
                            <InfoTwo
                              name={"Email"}
                              value={user?.email}
                              Icon={AlternateEmailOutlinedIcon}
                              classes="text-lowercase"
                            />
                            <InfoTwo
                              value={`${user?.registerType || "email"}`}
                              Icon={ContactsIcon}
                              name={"Register Type"}
                            />
                            <InfoTwo name={"Gender"} value={`${user?.gender ?? "Unknown"}`} Icon={TransgenderIcon} />
                            <InfoTwo
                              name={"Birth Date"}
                              value={`${new Date(user?.dob).toDateString()}`}
                              Icon={CakeIcon}
                            />
                            <InfoTwo
                              name={"Lyxa Balance"}
                              value={`${user?.tempBalance} ${currency}`}
                              Icon={SavingsIcon}
                            />
                            <InfoTwo name={"Orders"} value={`${user?.orderCompleted}`} Icon={ShoppingBasketIcon} />
                            <InfoTwo
                              name={"Status"}
                              value={`${user?.status}`}
                              Icon={user?.status === "active" ? ToggleOnIcon : ToggleOffIcon}
                            />
                            <InfoTwo
                              name={"Join Date"}
                              value={`${new Date(user?.createdAt).toDateString()}`}
                              Icon={HowToRegIcon}
                            />
                            <InfoTwo
                              Icon={RoomOutlinedIcon}
                              value={user?.address[0]?.address}
                              mapLink={`${MAP_URL}?z=10&t=m&q=loc:${user?.address[0]?.latitude}+${user?.address[0]?.longitude}`}
                              name="Location"
                            />
                          </InfoTwoWrapper>
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
                    lisener={(page) => dispatch(getUserAllOrder(true, user?._id, page))}
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
    border: 1px solid lightgray;
    border-radius: 100px;
  }
`;

export default UserDetails;
