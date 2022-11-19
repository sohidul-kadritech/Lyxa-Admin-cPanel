import React from "react";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { Row, Col, Card, CardBody, Spinner } from "reactstrap";
import { graphFilterOptions, monthOptions } from "../assets/staticData";
import { Bar } from "react-chartjs-2";

const Graph = ({
    filterType,
    startDate,
    endDate,
    year,
    type,
    startDateValue,
    endDateValue,
    chartData = {},
    isLoading,
    yearValue,
    graphType,
    getMonth,
    month,
}) => {



    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: "Analytics",
                backgroundColor: "#02a499",
                borderColor: "#02a499",
                borderWidth: 1,
                hoverBackgroundColor: "#02a499",
                hoverBorderColor: "#02a499",
                data: chartData?.series ?? [],
            },
        ],
    };

    const option = {
        tootlbar: {
            show: false,
        },
        low: 0,
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    let dataset = data.datasets[tooltipItem.datasetIndex];
                    // let meta = dataset._meta[Object.keys(dataset._meta)[0]];
                    // let total = meta.total;
                    let currentValue = dataset.data[tooltipItem.index];
                    // var percentage = parseFloat((currentValue / total * 100).toFixed(1));
                    return ` ${graphType}s - ${currentValue}`;
                },
                title: function (tooltipItem, data) {
                    return ` ${(type.value === 'normal' || type.value === 'month') ? 'Day' : 'Month'} - ${data.labels[tooltipItem[0].index]}`;
                },
            },
        },
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        stepSize: 5,
                        callback: function (value) {
                            if (value % 1 === 0) {
                                return value;
                            }
                        },
                    },
                },
            ],
        },
    };
    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="card-title mb-4 text-capitalize" style={{ width: "140px" }}>
                            {`${graphType}s Graph`}
                        </h4>
                        <Row style={{ flex: "1" }}>
                            <Col lg={4}>
                                <div className="mb-4">
                                    <label className="control-label">Filter By</label>
                                    <Select
                                        palceholder="Select Status"
                                        options={graphFilterOptions}
                                        classNamePrefix="select2-selection"
                                        value={type}
                                        onChange={(e) => filterType(e)}
                                    />
                                </div>
                            </Col>
                            <Col lg={8}>
                                {type.value === "year" ? (
                                    <div>
                                        <label>Year</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter year"
                                            min={2021}
                                            max={new Date().getFullYear()}
                                            value={yearValue}
                                            onChange={(e) => year(e.target.value)}
                                        />
                                    </div>
                                ) : type.value === "month" ? (
                                    <Row>
                                        <Col md={6}>
                                            <div className="">
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
                                    </Row>
                                ) : (
                                    <div className="d-flex my-3 my-md-0 ">
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
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </div>

                    <Row>
                        <Col>
                            <div>
                                {isLoading ? (
                                    <Spinner animation="border" variant="success" />
                                ) : (
                                    <Bar width={600} height={245} data={data} options={option} />
                                )}
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default Graph;
