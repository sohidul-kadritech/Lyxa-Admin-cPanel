import moment from "moment";
import React, { useEffect, useState } from "react";
import ChartistGraph from "react-chartist";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import {
    Row,
    Col,
    Card,
    CardBody,
    Spinner,

} from "reactstrap"
import { graphFilterOptions } from "../assets/staticData";
import { ADMIN_DASHBOARD_ORDER_GRAPH, SELLER_DASHBOARD_ORDER_GRAPH, SHOP_DASHBOARD_ORDER_GRAPH } from "../network/Api";
import requestApi from "../network/httpRequest";

const OrdersGraph = ({ type }) => {
    //   const labelsData = monthlyEarnings?.map((item) => item.monthNumber);
    //   const seriesData = monthlyEarnings?.map((item) => item.income);
    const { account_type, adminType, _id: Id } = JSON.parse(localStorage.getItem("admin"));
    const [filterType, setFilterType] = useState({ label: "Monthly", value: "normal" },);
    const [year, setYear] = useState(new Date().getFullYear());
    const [startDate, setStartDate] = useState(moment().startOf("month").format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(moment().endOf("month").format("YYYY-MM-DD"));

    // console.log({labelsData})

    //   let lineChartData = {
    //     labels: labelsData,
    //     series: [seriesData],
    //   };

    //   let lineChartOptions = {
    //     low: 0,
    //     showArea: true,
    //   };
    var lineChartData = {
        labels: [1, 2, 3, 4, 5, 6, 7, 8],
        series: [
            [5, 9, 7, 8, 5, 3, 5, 4]
        ]
    };
    var lineChartOptions = {
        low: 0,
        showArea: true,
    }

    useEffect(async () => {
        if (filterType) {
            if (year || startDate || endDate) {



                try {
                    const { data } = await requestApi().request(account_type === 'admin' ? ADMIN_DASHBOARD_ORDER_GRAPH : account_type === 'seller' ? SELLER_DASHBOARD_ORDER_GRAPH : SHOP_DASHBOARD_ORDER_GRAPH, {
                        params: {
                            orderStartDate: startDate,
                            orderEndDate: endDate
                        },
                    });

                    if (data.status) {
                        console.log({ data })
                    }
                } catch (e) {
                    console.log(e.message);
                }
            }
        }
    }, [filterType, year, startDate, endDate])


    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <h4 className="card-title mb-4">{`${type === 'order' ? "Order" : type === 'earning' ? "Earning" : type === 'users' ? 'Users' : ""}`} Graph</h4>
                    <Row>
                        <Col lg={4}>
                            <div className="mb-4">
                                <label className="control-label">Sort By</label>
                                <Select
                                    palceholder="Select Status"
                                    options={graphFilterOptions}
                                    classNamePrefix="select2-selection"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e)}
                                />
                            </div>
                        </Col>
                        <Col lg={8}>
                            {filterType.value === 'year' ? <div>
                                <label>Year</label>
                                <input type="number" className="form-control" min={2021} max={new Date().getFullYear()} value={year} onChange={(e) => setYear(e.target.value)} />
                            </div> : <div className="d-flex my-3 my-md-0 ">
                                <div className=" w-100">
                                    <label>Start Date</label>
                                    <div className="form-group mb-0 w-100">
                                        <Flatpickr
                                            className="form-control d-block"
                                            id="startDate"
                                            placeholder="Start Date"
                                            value={startDate}
                                            onChange={(selectedDates, dateStr, instance) =>
                                                setStartDate(dateStr)
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
                                            value={endDate}
                                            onChange={(selectedDates, dateStr, instance) =>
                                                setEndDate(dateStr)
                                            }
                                            options={{
                                                altInput: true,
                                                altFormat: "F j, Y",
                                                dateFormat: "Y-m-d",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>}
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <div>

                                <ChartistGraph data={lineChartData} style={{ height: "300px" }} options={lineChartOptions} type={'Line'} />
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

        </React.Fragment>
    );


};

export default OrdersGraph;
