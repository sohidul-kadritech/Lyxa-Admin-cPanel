import { DataArray } from "@mui/icons-material";
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

const Graph = ({ filterType, startDate, endDate, year, type, startDateValue, endDateValue, chartData = {}, isLoading, yearValue, graphType }) => {

    const { account_type, adminType, _id: Id } = JSON.parse(localStorage.getItem("admin"));
    // const [orderFilterType, setOrderFilterType] = useState({ label: "Daily", value: "normal" });
    // const [orderYear, setOrderYear] = useState(new Date().getFullYear());
    // const [orderStartDate, setOrderStartDate] = useState(moment().startOf("month").format("YYYY-MM-DD"));
    // const [orderEndDate, setOrderEndDate] = useState(moment().endOf("month").format("YYYY-MM-DD"));
    // const [data, setData] = useState([]);
    // const [chartData, setChartData] = useState({});
    // const [isLoading, setIsLoading] = useState(false);


    // console.log({labelsData})

    //   let lineChartData = {
    //     labels: labelsData,
    //     series: [seriesData],
    //   };

    //   let lineChartOptions = {
    //     low: 0,
    //     showArea: true,
    //   };
    // var lineChartData = {
    //     labels: [1, 2, 3, 4, 5, 6, 7, 8],
    //     series: [
    //         [5, 9, 7, 8, 5, 3, 5, 4]
    //     ]
    // };
    var lineChartOptions = {
        low: 0,
        showArea: true,
    }

    // GET ORDER CHART DATA 



    // useEffect(async () => {
    //     if (filterType) {
    //         if (year || startDate || endDate) {
    //             setIsLoading(true)
    //             try {
    //                 const { data } = await requestApi().request(account_type === 'admin' ? ADMIN_DASHBOARD_ORDER_GRAPH : account_type === 'seller' ? SELLER_DASHBOARD_ORDER_GRAPH : SHOP_DASHBOARD_ORDER_GRAPH, {
    //                     params: {
    //                         startDate,
    //                         endDate,
    //                         type: filterType.value,
    //                         year
    //                     },
    //                 });

    //                 if (data.status) {
    //                     const { info } = data.data;
    //                     setData(info)
    //                     setIsLoading(false);
    //                 }
    //             } catch (e) {
    //                 console.log(e.message);
    //                 setIsLoading(false);
    //             }
    //         }
    //     }
    // }, [filterType, year, startDate, endDate])


    // useEffect(() => {
    //     if (data.length > 0) {
    //         const labelsData = data?.map((item, index) => index + 1);
    //         const seriesData = data?.map((item) => item.order);
    //         if (labelsData && seriesData) {
    //             const chartInfo = {
    //                 labels: labelsData,
    //                 series: [
    //                     seriesData
    //                 ]
    //             }
    //             setChartData(chartInfo);
    //         }
    //     }
    // }, [data])


    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <h4 className="card-title mb-4">{`${graphType === 'order' ? "Order" : graphType === 'earning' ? "Earning" : graphType === 'users' ? 'Users' : ""}`} Graph</h4>
                    <hr />
                    <Row>
                        <Col lg={4}>
                            <div className="mb-4">
                                <label className="control-label">Filter By</label>
                                <Select
                                    palceholder="Select Status"
                                    options={graphFilterOptions}
                                    classNamePrefix="select2-selection"
                                    value={type}
                                    onChange={e => filterType(e)}
                                />
                            </div>
                        </Col>
                        <Col lg={8}>
                            {type.value === 'year' ? <div>
                                <label>Year</label>
                                <input type="number" className="form-control" placeholder="Enter year"  min={2021} max={new Date().getFullYear()} value={yearValue} onChange={(e) => year(e.target.value)} />
                            </div> : <div className="d-flex my-3 my-md-0 ">
                                <div className=" w-100">
                                    <label>Start Date</label>
                                    <div className="form-group mb-0 w-100">
                                        <Flatpickr
                                            className="form-control d-block"
                                            id="startDate"
                                            placeholder="Start Date"
                                            value={startDateValue}
                                            onChange={(selectedDates, dateStr, instance) =>
                                                startDate(dateStr)

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
                                            value={endDateValue}
                                            onChange={(selectedDates, dateStr, instance) =>
                                                endDate(dateStr)
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

                                {isLoading ? <Spinner animation="border" variant="success" /> : <ChartistGraph data={chartData} style={{ height: "350px" }} options={lineChartOptions} type={'Line'} />}
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

        </React.Fragment>
    );


};

export default Graph;
