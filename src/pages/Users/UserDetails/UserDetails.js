import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Modal, Row } from "reactstrap";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import requestApi from "../../../network/httpRequest";
import { SINGLE_USER } from "../../../network/Api";
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
import Flags from "../../../components/Flags";

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
  } = useSelector((state) => state.usersReducer);
  const { status } = useSelector((state) => state.dropPayReducer);
  const { account_type, adminType } = JSON.parse(localStorage.getItem("admin"));

  const [user, setUser] = useState({});
  const [balAddModal, setBalAddModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getUserAllOrder(true, id));
      const findUser = users.find((user) => user.id == id);
      if (findUser) {
        setUser(findUser);
      } else {
        callApi(id);
      }
    }
  }, [id]);

  //   CALL API FOR SINGLE USER

  const callApi = async (userId) => {
    if (userId) {
      try {
        const { data } = await requestApi().request(SINGLE_USER, {
          params: {
            id: userId,
          },
        });

        if (data.status) {
          setUser(data.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      history.push("/users/list", { replace: true });
    }
  };

  useEffect(() => {
    if (status || userStatus) {
      setBalAddModal(false);
      callApi(user?._id);
    }
  }, [status, userStatus]);

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
            />

            <Row>
              <Col lg={6}>
                <Card className="card-height">
                  <CardBody>
                    <div className="mb-3">
                      <Button
                        outline={true}
                        color="success"
                        onClick={() => setBalAddModal(!balAddModal)}
                      >
                        Add/Remove Credit
                      </Button>
                      {(account_type === 'admin' && adminType === 'admin') && <Button
                        outline={true}
                        color="success"
                        className="ms-3"
                        onClick={() =>
                          dispatch(
                            updateUserStatus(
                              user?._id,
                              user?.status === "active" ? "inactive" : "active"
                            )
                          )
                        }
                      >
                        {user?.status === "active" ? "Inactivate" : "Activate"}
                      </Button>}
                    </div>
                    <hr />
                    <Info title="Name" value={user?.name} />
                    <Info title="Email" value={user?.email} />
                    <Info title="Gender" value={user?.gender} />
                    <Info title="Balance" value={`${user?.tempBalance} NGN`} />
                    <Info title="Total Order" value={user?.cards?.length} />
                    <Info
                      title="Birth Date"
                      value={new Date(user?.dob).toDateString()}
                    />
                    <Info title="Status" value={user?.status} />
                    <Info
                      title="Joined Date"
                      value={new Date(user?.createdAt).toDateString()}
                    />
                  </CardBody>
                </Card>
              </Col>
              <Col lg={6}>
                <Flags flags={user?.flags} />
              </Col>
            </Row>

            <div>
              <OrderTable ordres={orders} />
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

export default UserDetails;
