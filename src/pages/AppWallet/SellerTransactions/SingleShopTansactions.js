import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  Row,
  Spinner,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import Info from "../../../components/Info";
import TransactionsCard from "../../../components/TransactionsCard";

import { Autocomplete, Box, TextField, Tooltip } from "@mui/material";
import {
  adjustShopCash,
  getShopTrxs,
  shopMakePayment,
  updateShopAmountRange,
  updateShopAmountRangeType,
  updateShopOrderBy,
  updateShopSearchKey,
  updateShopTrxBy,
  updateShopTrxEndDate,
  updateShopTrxStartDate,
  updateShopTrxType,
} from "../../../store/appWallet/appWalletAction";
import AppPagination from "../../../components/AppPagination";
import styled from "styled-components";
import { successMsg } from "../../../helpers/successMsg";
import MakePayment from "../../../components/MakePayment";
import AddRemoveCredit from "../../../components/AddRemoveCredit";
import TransactionsTable from "../../../components/TransactionsTable";
import Select from "react-select";
import Search from "../../../components/Search";
import Flatpickr from "react-flatpickr";
import {
  shopTrxsAmountFilterOptions,
  shopTrxsTypeOptions,
  sortByOptions,
} from "../../../assets/staticData";
import { getAllAdmin } from "../../../store/AdminControl/Admin/adminAction";
import earningFlowIcon from "../../../assets/images/dashboard/earning-flow.png";
import moneyExchangeIcon from "../../../assets/images/dashboard/money-exchange.png";
import deliveryIcon from "../../../assets/images/dashboard/delivery.png";
import orderAmountIcon from "../../../assets/images/dashboard/order-amount.png";
// import profitUpArrowIcon from "../assets/images/dashboard/profit-up-arrow.png";
import profitUpArrowIcon from '../../../assets/images/dashboard/profit-up-arrow.png'
import profitFlowIcon from "../../../assets/images/dashboard/profit-flow.png";

// import profitUpArrowIcon from '../../../assets/images/dashboard/profit-up-arrow.png'
import TopSummery from "../../../components/TopSummery";
// import earningFlowIcon from "../assets/images/dashboard/earning-flow.png";

const SingleShopTransactions = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const {
    loading,
    shopTrxs,
    paging,
    hasNextPage,
    currentPage,
    hasPreviousPage,
    status,
    shopTrxStartDate,
    shopTrxEndDate,
    shopTrxOrderBy,
    shopTrxType,
    shopTrxAmountRangeType,
    shopTrxAmountRange,
    shopSearchKey,
    shopTrxBy,
  } = useSelector((state) => state.appWalletReducer);

  const [shopName, setShopName] = useState("");
  const [summary, setSummary] = useState([]);
  const [isMakePayment, setIsMakePayment] = useState(false);
  const [openCreditModal, setOpenCreditModal] = useState(false);
  const [shopId, setShopId] = useState("");
  const [adminSearchKey, setAdminSearchKey] = useState("");

  const {
    shopName: name,
    _id: accountId,
    account_type,
  } = useSelector((store) => store.Login.admin);;

  const { admins } = useSelector((state) => state.adminReducer);
  console.log({account_type})


  useEffect(() => {
    if (account_type !== "shop") {
      dispatch(getAllAdmin(true));
    }
  }, []);

  useEffect(() => {
    if (searchParams.get("shopId") || accountId) {
      searchParams.get("shopName")
        ? setShopName(searchParams.get("shopName"))
        : setShopName(name);
      let id = null;
      searchParams.get("shopId")
        ? (id = searchParams.get("shopId"))
        : (id = accountId);
      if (id) {
        if (
          shopTrxStartDate ||
          shopTrxEndDate ||
          shopTrxOrderBy ||
          shopTrxType ||
          shopSearchKey ||
          (shopTrxAmountRangeType && shopTrxAmountRange) ||
          shopTrxBy
        ) {
          callTransList(true, id);
        }
        setShopId(id);
      }
    } else {
      history.push("/", { replace: true });
    }
  }, [
    searchParams,
    accountId,
    shopTrxStartDate,
    shopTrxEndDate,
    shopTrxOrderBy,
    shopTrxType,
    shopTrxAmountRangeType,
    shopTrxAmountRange,
    shopSearchKey,
    shopTrxBy,
  ]);

  // CALL API TO GET SELLER TRANSACTIONS

  const callTransList = (refresh = false, IdOfShop) => {
    dispatch(getShopTrxs(refresh, IdOfShop ? IdOfShop : shopId));
  };

  // SUMMARY

  useEffect(() => {
    const summaryListShop = [
      {
        title: "Shop Earning",
        value: `${shopTrxs?.summary?.totalShopEarning?.toFixed(2)} NGN`,
        icon: earningFlowIcon,
        iconBg: "#0008C1",
      },
      {
        title: "Unsetlled Amount",
        value: `${shopTrxs?.summary?.totalShopUnsettle?.toFixed(2)} NGN`,
        icon: moneyExchangeIcon,
        iconBg: "#0c9da4",
      },
      {
        id: 3,
        title: "Delivery Profit",
        value: `${shopTrxs?.summary?.totalShopDeliveryFee?.toFixed(2) || (0).toFixed(2)} NGN`,
        icon: profitUpArrowIcon,
        iconBg: "#1A4D2E",
      },
      {
        title: "Total Profit",
        value: `${shopTrxs?.summary?.toalShopProfile?.toFixed(2)} NGN`,
        icon: profitFlowIcon,
        iconBg: "#56ca00",
      },
    ];
    const summaryListAdmin = [
      {
        title: "Lyxa Earning",
        value: `${shopTrxs?.summary?.totalDropGet?.toFixed(2)} NGN`,
        icon: earningFlowIcon,
        iconBg: "red",
      },
      {
        title: "Shop Earning",
        value: `${shopTrxs?.summary?.totalShopEarning?.toFixed(2)} NGN`,
        icon: earningFlowIcon,
        iconBg: "#f7c137",
      },
      {
        title: "Unsetlled Amount",
        value: `${shopTrxs?.summary?.totalShopUnsettle?.toFixed(2)} NGN`,
        icon: moneyExchangeIcon,
        iconBg: "#0c9da4",
      },
      {
        title: "Total Shop Profit",
        value: `${shopTrxs?.summary?.toalShopProfile?.toFixed(2)} NGN`,
        icon: profitFlowIcon,
        iconBg: "#56ca00",
      },
    ];

    if(account_type === 'admin'){
      setSummary(summaryListAdmin)
    }else{
      setSummary(summaryListShop)
    }
    
  }, [shopTrxs]);

  // const topSummaryData = [
  //   {
  //     id: 1,
  //     title: "Lyxa Earnings",
  //     subTitle: "(Total earnings)",
  //     value: `${summary?.totalDropEarning ?? 0} NGN`,
  //     icon: earningFlowIcon,
  //     iconBg: "red",
  //   },
  //   {
  //     id: 2,
  //     title: "Order Profit",
  //     subTitle: "(Ex delivery fees)",
  //     value: `${summary?.dropEarningTotalOfItems ?? 0} NGN`,
  //     icon: profitFlowIcon,
  //     iconBg: "#56ca00",
  //   },
  //   {
  //     id: 3,
  //     title: "Delivery Profit",
  //     subTitle: "(Only from delivery fees)",
  //     value: `${summary?.dropEarningTotalOfDeliveryFee ?? 0} NGN`,
  //     icon: profitUpArrowIcon,
  //     iconBg: "#f7c137",
  //   },
  //   {
  //     id: 4,
  //     title: "Delivery Fee's",
  //     subTitle: "(Total delivery fees)",
  //     value: `${summary?.ordersDeliveryFeesTotal ?? 0} NGN`,
  //     icon: deliveryIcon,
  //     iconBg: "#00dcff",
  //   },
  //   {
  //     id: 5,
  //     title: "Order Amount",
  //     subTitle: "(Ex delivery fees)",
  //     value: `${summary?.ordersItemTotal ?? 0} NGN`,
  //     icon: orderAmountIcon,
  //     iconBg: "#ff5ca7",
  //   },
  //   {
  //     id: 6,
  //     title: "Shops Unsettled Amount",
  //     subTitle: "(Total unsettled)",
  //     value: `${summary?.shopUnsettleAmount ?? 0} NGN`,
  //     icon: moneyExchangeIcon,
  //     iconBg: "#0c9da4",
  //   },
  // ];

  useEffect(() => {
    if (status) {
      setIsMakePayment(false);
      setOpenCreditModal(false);
      callTransList(true, shopId);
    }
  }, [status]);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Lyxa"
              breadcrumbItem={shopName}
              title="App Wallet"
              callList={callTransList}
              loading={loading}
            />

            <Card>
              <CardBody>
                <Row>
                  <Col lg={6}>
                    <div className="d-flex my-3 my-md-0 ">
                      <div className=" w-100">
                        <label>Start Date</label>
                        <div className="form-group mb-0 w-100">
                          <Flatpickr
                            className="form-control d-block"
                            id="startDate"
                            placeholder="Select Start Date"
                            value={shopTrxStartDate}
                            onChange={(selectedDates, dateStr, instance) =>
                              dispatch(updateShopTrxStartDate(dateStr))
                            }
                            options={{
                              altInput: true,
                              altFormat: "F j, Y",
                              dateFormat: "Y-m-d",
                            }}
                          />
                        </div>
                      </div>
                      <div className="ms-2 w-100">
                        <label>End Date</label>
                        <div className="form-group mb-0">
                          <Flatpickr
                            className="form-control w-100"
                            id="endDate"
                            placeholder="Select End Date"
                            value={shopTrxEndDate}
                            onChange={(selectedDates, dateStr, instance) =>
                              dispatch(updateShopTrxEndDate(dateStr))
                            }
                            options={{
                              altInput: true,
                              altFormat: "F j, Y",
                              dateFormat: "Y-m-d",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Col>

                  {account_type !== "shop" && (
                    <Col lg={4}>
                      <label>Transaction By</label>
                      <AdminFilter>
                        <Autocomplete
                          className="cursor-pointer"
                          value={shopTrxBy}
                          onChange={(event, newValue) => {
                            dispatch(updateShopTrxBy(newValue));
                          }}
                          getOptionLabel={(option, index) =>
                            option.name ? option.name : ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?._id === value?._id
                          }
                          inputValue={adminSearchKey}
                          onInputChange={(event, newInputValue) => {
                            setAdminSearchKey(newInputValue);
                          }}
                          id="controllable-states-demo"
                          options={admins.length > 0 ? admins : []}
                          sx={{ width: "100%" }}
                          renderInput={(params, index) => (
                            <TextField
                              {...params}
                              label="Select a Admin"
                              style={{ padding: "0 !important" }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <Box
                              component="li"
                              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                              {...props}
                              key={option._id}
                            >
                              {option.name}
                            </Box>
                          )}
                        />
                      </AdminFilter>
                    </Col>
                  )}
                </Row>

                <Row className="mt-3">
                  <Col lg={3}>
                    <div>
                      <label className="control-label"> Transaction Type</label>
                      <Select
                        palceholder="Select Type"
                        options={shopTrxsTypeOptions}
                        classNamePrefix="select2-selection"
                        required
                        value={shopTrxType}
                        onChange={(e) => dispatch(updateShopTrxType(e))}
                      />
                    </div>
                  </Col>
                  <Col lg={3} className="mt-2 mt-lg-0">
                    <div>
                      <label className="control-label">Amount Order By</label>
                      <Select
                        palceholder="Select Order By"
                        options={sortByOptions}
                        classNamePrefix="select2-selection"
                        required
                        value={shopTrxOrderBy}
                        onChange={(e) => dispatch(updateShopOrderBy(e))}
                      />
                    </div>
                  </Col>

                  <Col lg={4} className="mt-2 mt-lg-0">
                    <div>
                      <Label>Amount Range</Label>
                      <input
                        className="form-control"
                        type="number"
                        placeholder="Enter a amount "
                        value={shopTrxAmountRange}
                        onChange={(e) =>
                          dispatch(updateShopAmountRange(e.target.value))
                        }
                      />
                    </div>
                  </Col>

                  {shopTrxAmountRange > 0 && (
                    <Col lg={2} className="mt-2 mt-lg-0">
                      <div>
                        <Label>Amount Filter Type</Label>
                        <Select
                          palceholder="Select Order By"
                          options={shopTrxsAmountFilterOptions}
                          classNamePrefix="select2-selection"
                          required
                          value={shopTrxAmountRangeType}
                          onChange={(e) =>
                            dispatch(updateShopAmountRangeType(e))
                          }
                        />
                      </div>
                    </Col>
                  )}
                </Row>

                <Row className="mt-3">
                  <Col lg={6}>
                    <Search
                      dispatchFunc={updateShopSearchKey}
                      placeholder="Search by id"
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <div>
              <TopSummery fromSingleShop={true} fromWallet={true} data={summary} />
            </div>

            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <div className="d-flex justify-content-between pb-3">
                  <CardTitle className="h4"> Shop Transactions List</CardTitle>
                  {account_type === "admin" && (
                    <div>
                      <Button
                        className="btn btn-success"
                        onClick={() => setOpenCreditModal(!openCreditModal)}
                      >
                        Add/Remove Credit
                      </Button>
                      <Button
                        className="btn btn-info ms-4"
                        onClick={() => setIsMakePayment(!isMakePayment)}
                      >
                        Make Payment
                      </Button>
                    </div>
                  )}
                </div>

                <TransactionsTable trxs={shopTrxs?.trxs} loading={loading} />
              </CardBody>
            </Card>
            <Row>
              <Col xl={12}>
                <div className="d-flex justify-content-center">
                  <AppPagination
                    paging={paging}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    currentPage={currentPage}
                    lisener={(page) =>
                      dispatch(getShopTrxs(true, shopId, page))
                    }
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* MAKE PAYMENT */}

        <Modal
          isOpen={isMakePayment}
          toggle={() => {
            setIsMakePayment(!isMakePayment);
          }}
          centered={true}
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Make Payment</h5>
            <button
              type="button"
              onClick={() => {
                setIsMakePayment(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <MakePayment
              unSettleAmount={shopTrxs?.summary?.totalShopUnsettle}
              id={shopTrxs?.shop?._id}
              userType="shop"
            />
          </div>
        </Modal>

        {/* ADD AND REMOVE CREDIT  */}

        <Modal
          isOpen={openCreditModal}
          toggle={() => {
            setOpenCreditModal(!openCreditModal);
          }}
          centered={true}
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Add / Remove Credit</h5>
            <button
              type="button"
              onClick={() => {
                setOpenCreditModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <AddRemoveCredit
              userType="shop"
              id={shopTrxs?.shop?._id}
              dropAmount={shopTrxs?.shop?.dropGetFromShop}
              userAmount={shopTrxs?.shop?.totalShopEarning}
            />
          </div>
        </Modal>
      </GlobalWrapper>
    </React.Fragment>
  );
};

const AdminFilter = styled.div`
  .css-dd2h8b-MuiAutocomplete-root
    .MuiOutlinedInput-root
    .MuiAutocomplete-input {
    padding: 3px 0px !important;
  }
`;

export default SingleShopTransactions;
