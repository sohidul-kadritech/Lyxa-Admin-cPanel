import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import CakeIcon from '@mui/icons-material/Cake';
import ContactsIcon from '@mui/icons-material/Contacts';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import SavingsIcon from '@mui/icons-material/Savings';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import TransgenderIcon from '@mui/icons-material/Transgender';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, Modal, Row } from 'reactstrap';
import noPhoto from '../../../assets/images/noPhoto.jpg';
import AppPagination from '../../../components/AppPagination';
import CircularLoader from '../../../components/CircularLoader';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import FlagsAndReviews from '../../../components/FlagsAndReviews';
import GlobalWrapper from '../../../components/GlobalWrapper';
import InfoTwo from '../../../components/InfoTwo';
import InfoTwoWrapper from '../../../components/InfoTwoWrapper';
import OrderTable from '../../../components/OrderTable';
import { callApi } from '../../../components/SingleApiCall';
import UserCradit from '../../../components/UserCradit';
import { useGlobalContext } from '../../../context';
import { MAP_URL, SINGLE_USER } from '../../../network/Api';
import { getUserAllOrder, updateUserStatus } from '../../../store/Users/UsersAction';

function UserDetails() {
  // const currency = useSelector((store) => store.settingsReducer.appSettingsOptions?.currency?.code)?.toUpperCase();
  // const { general } = useGlobalContext();
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
  // const { account_type, adminType } = useSelector((store) => store.Login.admin);
  const { currentUser, general } = useGlobalContext();
  const { userType } = currentUser;
  const currency = general?.currency?.code?.toUpperCase();

  const [user, setUser] = useState({});
  const [balAddModal, setBalAddModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getUserAllOrder(true, id));
      const findUser = users.find((user) => user.id === id);
      if (findUser) {
        setUser(findUser);
      } else {
        (async function getSingleUser() {
          const data = await callApi(id, SINGLE_USER, 'user');
          if (data) {
            setUser(data);
          } else {
            history.push('/users/list', { replace: true });
          }
        })();
      }
    }
  }, [id]);

  useEffect(() => {
    if (status || userStatus) {
      setBalAddModal(false);
      (async function getSingleUser() {
        const data = await callApi(id, SINGLE_USER, 'user');
        if (data) {
          setUser(data);
        } else {
          history.push('/users/list', { replace: true });
        }
      })();
    }
  }, [status, userStatus]);

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs maintitle="lyxa" breadcrumbItem="Details" title="User" isRefresh={false} />

          <Row>
            <Col lg={6}>
              <Card className="card-height">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center">
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden' }}>
                      <img
                        className=" cursor-pointer"
                        alt="User"
                        src={user?.profile_photo ?? noPhoto}
                        loading="lazy"
                        height="100%"
                        width="100%"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="d-flex justify-content-end align-items-center">
                      <Button
                        outline
                        color="success"
                        disabled={Object.keys(user).length === 0}
                        onClick={() => setBalAddModal(!balAddModal)}
                      >
                        Add/Remove Credit
                      </Button>
                      {userType === 'admin' && userType === 'admin' && (
                        <Button
                          outline
                          color="success"
                          className="ms-3"
                          disabled={Object.keys(user).length === 0 || loading}
                          onClick={() =>
                            dispatch(updateUserStatus(user?._id, user?.status === 'active' ? 'inactive' : 'active'))
                          }
                        >
                          {loading ? 'Loading...' : user?.status === 'active' ? 'Inactivate' : 'Activate'}
                        </Button>
                      )}
                    </div>
                  </div>

                  <hr />
                  <Row>
                    <Col xl={12} className="ps-3">
                      {Object.keys(user).length > 0 ? (
                        <InfoTwoWrapper>
                          <InfoTwo name="Name" value={`${user?.name}`} Icon={PersonOutlineOutlinedIcon} />
                          <InfoTwo
                            name="Email"
                            value={user?.email}
                            Icon={AlternateEmailOutlinedIcon}
                            classes="text-lowercase"
                          />
                          <InfoTwo
                            value={`${user?.registerType || 'email'}`}
                            Icon={ContactsIcon}
                            name="Register Type"
                          />
                          <InfoTwo name="Gender" value={`${user?.gender ?? 'Unknown'}`} Icon={TransgenderIcon} />
                          <InfoTwo name="Birth Date" value={`${new Date(user?.dob).toDateString()}`} Icon={CakeIcon} />
                          <InfoTwo name="Lyxa Balance" value={`${user?.tempBalance} ${currency}`} Icon={SavingsIcon} />
                          <InfoTwo name="Orders" value={`${user?.orderCompleted}`} Icon={ShoppingBasketIcon} />
                          <InfoTwo
                            name="Status"
                            value={`${user?.status}`}
                            Icon={user?.status === 'active' ? ToggleOnIcon : ToggleOffIcon}
                          />
                          <InfoTwo
                            name="Join Date"
                            value={`${new Date(user?.createdAt).toDateString()}`}
                            Icon={HowToRegIcon}
                          />
                          <InfoTwo
                            Icon={RoomOutlinedIcon}
                            value={user?.address[0]?.address}
                            mapLink={`
                            ${MAP_URL}?z=10&t=m&q=loc:${user?.address[0]?.latitude}+${user?.address[0]?.longitude}`}
                            name="Location"
                          />
                        </InfoTwoWrapper>
                      ) : (
                        // <Spinner color="danger" size="lg"></Spinner>
                        <CircularLoader />
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
        centered
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
  );
}

export default UserDetails;
