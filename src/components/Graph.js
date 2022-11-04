
import React from "react";
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
import { graphFilterOptions, monthOptions } from "../assets/staticData";

const Graph = ({ filterType, startDate, endDate, year, type, startDateValue, endDateValue, chartData = {}, isLoading, yearValue, graphType, getMonth, month }) => {

    var lineChartOptions = {
        low: 0,
        showArea: true,
    }
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <h4 className="card-title mb-4">{`${graphType === 'order' ? "Order" : graphType === 'earning' ? "Earning" : graphType === 'users' ? 'Users' : ""}`} Graph</h4>
                    <hr />
                    <Row>
                        <Col lg={3}>
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
                        <Col lg={6}>
                            {type.value === 'year' ? <div>
                                <label>Year</label>
                                <input type="number" className="form-control" placeholder="Enter year" min={2021} max={new Date().getFullYear()} value={yearValue} onChange={(e) => year(e.target.value)} />
                            </div> : type.value === 'month' ? <Row>
                                <Col md={6}>
                                    <div className="mb-4">
                                        <label className="control-label">Select Month</label>
                                        <Select
                                            palceholder="Select Status"
                                            options={monthOptions}
                                            classNamePrefix="select2-selection"
                                            value={month}
                                            onChange={getMonth}
                                        />
                                    </div>
                                </Col>

                            </Row> : <div className="d-flex my-3 my-md-0 ">
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
