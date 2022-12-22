import React, { useState, useEffect, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner,
  Button,
} from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import {
  getSellerTrx,
  updateShopsTrxEndDate,
  updateShopsTrxStartDate,
} from "../../../store/appWallet/appWalletAction";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Flatpickr from "react-flatpickr";
import { shopsTrxsFilterOptions } from "../../../assets/staticData";
import Select from "react-select";
// import { DataGrid } from '@mui/x-data-grid';
import { MDBDataTable } from "mdbreact";

const columns = [
  {
    label: "ID",
    field: "id",
    sort: "asc",
    width: 150,
  },
  {
    label: "Shop",
    field: "shop",
    sort: "asc",
    width: 270,
  },
  {
    label: "Orders",
    field: "orders",
    sort: "asc",
    width: 200,
  },
  {
    label: "Order Amount",
    field: "orderAmount",
    sort: "asc",
    width: 100,
  },
  {
    label: "Delivery fee",
    field: "deliveryFee",
    sort: "asc",
    width: 150,
  },
  {
    label: "Drop earning",
    field: "dropEarning",
    sort: "asc",
    width: 100,
  },
  {
    label: "Unsettled Amount",
    field: "unsettledAmount",
    sort: "asc",
    width: 100,
  },
  {
    label: "Shop Earning",
    field: "shopEarning",
    sort: "asc",
    width: 100,
  },
];

const ShopsTransactions = () => {
  const { loading, sellerTrxs, shopsTrxStartDate, shopsTrxEndDate } =
    useSelector((state) => state.appWalletReducer);

  const { search } = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const history = useHistory();
  const dispatch = useDispatch();

  const [companyName, setCompanyName] = useState("");
  const [filteredTrxs, setFilteredTrxs] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [fromNum, setFromNum] = useState(0);
  const [toNum, setToNum] = useState(0);
  const {
    account_type,
    _id: accountId,
    company_name,
  } = JSON.parse(localStorage.getItem("admin"));

  useEffect(() => {
    if (shopsTrxStartDate || shopsTrxEndDate) {
      searchParams.get("companyName")
        ? setCompanyName(searchParams.get("companyName"))
        : setCompanyName(company_name);

      let id = null;
      searchParams.get("sellerId")
        ? (id = searchParams.get("sellerId"))
        : (id = accountId);

      dispatch(getSellerTrx(true, id));

      if (!id) {
        history.push("/", { replace: true });
      }
    }
  }, [shopsTrxStartDate, shopsTrxEndDate]);

  useEffect(() => {
    if (sellerTrxs.length > 0) {
      setFilteredTrxs(sellerTrxs);
      setFilterType("");
      setToNum(0);
      setFromNum(0);
    }
  }, [sellerTrxs]);

  const gotToShopTrxs = (shopId, shopName) => {
    history.push({
      pathname: `/add-wallet/shop-transactions`,
      search: `?shopId=${shopId}&shopName=${shopName}`,
    });
  };

  // GENERATE PDF

  const downloadPdf = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = `${companyName} Shops Transactions`;
    const headers = [
      [
        "Shop",
        "Total Orders",
        "Order amount",
        "Delivery fee",
        "Drop earning",
        "Unsettled amount",
        "Shop earning",
      ],
    ];
    const marginLeft = 40;

    const data = sellerTrxs.map((trx) => [
      trx.shopName,
      trx?.summary?.totalOrder,
      trx?.summary?.orderValue?.productAmount.toFixed(2),
      trx?.summary?.orderValue?.deliveryFee,
      trx?.summary?.totalDropGet,
      trx?.summary?.totalShopUnsettle,
      trx?.summary?.totalShopEarning,
    ]);

    let content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save(`${companyName}_ShopsTransactions.pdf`);
  };

  // filter

  const filterTrx = () => {
    const { value } = filterType;

    const newList = sellerTrxs.filter(
      (item) =>
        (value === "productAmount" || value === "deliveryFee"
          ? item.summary.orderValue[value] >= fromNum
          : item.summary[value] >= fromNum) &&
        (value === "productAmount" || value === "deliveryFee"
          ? item.summary.orderValue[value] <= toNum
          : item.summary[value] <= toNum)
    );

    setFilteredTrxs(newList);
  };

  const clearFilter = () => {
    setFilteredTrxs(sellerTrxs);
    setFilterType("");
    setToNum(0);
    setFromNum(0);
  };

  // TABLE DATA

  const tableData = (data) => {
    const modifiedData = data.map((trx, key) => {
      return {
        id: trx?.autoGenId,
        shop: trx?.shopName,
        orders: trx?.summary?.orderValue?.count ?? 0,
        orderAmount: trx?.summary?.orderValue?.totalAmount ?? 0,
        deliveryFee: trx?.summary?.orderValue?.deliveryFee ?? 0,
        dropEarning: trx?.summary?.totalDropGet ?? 0,
        unsettledAmount: trx?.summary?.totalShopUnsettle ?? 0,
        shopEarning: trx?.summary?.totalShopEarning ?? 0,
        clickEvent: () => gotToShopTrxs(trx._id, trx?.shopName),
      };
    });
    const newData = {
      columns: columns,
      rows: modifiedData,
    };
    return newData;
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={companyName}
              title="App Wallet"
              isRefresh={false}
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
                            placeholder="Start Date"
                            value={shopsTrxStartDate}
                            onChange={(selectedDates, dateStr, instance) =>
                              dispatch(updateShopsTrxStartDate(dateStr))
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
                            value={shopsTrxEndDate}
                            onChange={(selectedDates, dateStr, instance) =>
                              dispatch(updateShopsTrxEndDate(dateStr))
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
                </Row>

                <Row className="mt-3">
                  <Col lg={4}>
                    <div>
                      <label className="control-label">Type</label>
                      <Select
                        palceholder="Select Status"
                        options={shopsTrxsFilterOptions}
                        classNamePrefix="select2-selection"
                        required
                        value={filterType}
                        onChange={(e) => setFilterType(e)}
                      />
                    </div>
                  </Col>
                  <Col lg={6}>
                    <label className="control-label">Enter Number</label>
                    <div className="d-flex justify-content-between align-items-center">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter From Number"
                        value={fromNum}
                        onChange={(e) => setFromNum(e.target.value)}
                      />
                      <span className="mx-1">To</span>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter To Number"
                        value={toNum}
                        onChange={(e) => setToNum(e.target.value)}
                      />
                    </div>
                  </Col>
                  <Col lg={2} className="d-flex align-items-center mt-4">
                    <Button
                      disabled={!filterType || !fromNum || !toNum}
                      className="btn btn-success"
                      onClick={filterTrx}
                    >
                      Filter
                    </Button>
                    <Button
                      disabled={!filterType || !fromNum || !toNum}
                      className="btn btn-warning ms-2"
                      onClick={clearFilter}
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card className="table-data-hover">
              <CardBody>
                <Row className="mb-3">
                  <Col md={3} className="text-end" />
                </Row>
                <div className="d-flex align-items-center justify-content-between">
                  <CardTitle className="h4">Shops Wallets List</CardTitle>
                  <Button
                    outline={true}
                    color="success"
                    onClick={() => downloadPdf()}
                  >
                    Download PDF
                  </Button>
                </div>
                <hr />
                {loading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="success" />
                  </div>
                )}
                <MDBDataTable
                  className="cursor-pointer"
                  hover={true}
                  responsive
                  data={tableData(filteredTrxs)}
                  displayEntries={false}
                  paging={false}
                  searching={false}
                  noBottomColumns={true}
                />
              </CardBody>
            </Card>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default ShopsTransactions;
