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
import Graph from "./Graph";

const OrdersGraph = ({ type }) => {

    const { account_type, _id: Id } = JSON.parse(localStorage.getItem("admin"));
    const [filterType, setFilterType] = useState({ label: "Daily", value: "normal" });
    const [year, setYear] = useState(new Date().getFullYear());
    const [startDate, setStartDate] = useState(moment().startOf("month").format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(moment().endOf("month").format("YYYY-MM-DD"));
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState({});
    const [isLoading, setIsLoading] = useState(false);




    useEffect(async () => {
        if (filterType) {
            if (year || startDate || endDate) {
                setIsLoading(true)
                try {
                    const { data } = await requestApi().request(account_type === 'admin' ? ADMIN_DASHBOARD_ORDER_GRAPH : account_type === 'seller' ? SELLER_DASHBOARD_ORDER_GRAPH : SHOP_DASHBOARD_ORDER_GRAPH, {
                        params: {
                            startDate,
                            endDate,
                            type: filterType.value,
                            year
                        },
                    });

                    if (data.status) {

                        const { info } = data.data;
                        setData(info)
                        setIsLoading(false);
                    }
                } catch (e) {
                    console.log(e.message);
                    setIsLoading(false);
                }
            }
        }
    }, [filterType, year, startDate, endDate])


    useEffect(() => {
        if (data.length > 0) {
            const labelsData = data?.map((item, index) => index + 1);
            const seriesData = data?.map((item) => item.order);
            if (labelsData && seriesData) {
                const chartInfo = {
                    labels: labelsData,
                    series: [
                        seriesData
                    ]
                }
                setChartData(chartInfo);
            }
        }
    }, [data])


    return (
        <React.Fragment>
            <Graph
                filterType={type => setFilterType(type)}
                startDate={date => setStartDate(date)}
                endDate={date => setEndDate(date)}
                year={year => setYear(year)}
                type={filterType}
                startDateValue={startDate}
                endDateValue={endDate}
                chartData={chartData}
                isLoading={isLoading}
                yearValue={year}
                graphType="order"
            />

        </React.Fragment>
    );


};

export default OrdersGraph;
