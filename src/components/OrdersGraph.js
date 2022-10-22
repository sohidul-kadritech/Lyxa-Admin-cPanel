
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ADMIN_DASHBOARD_ORDER_GRAPH, SELLER_DASHBOARD_ORDER_GRAPH, SHOP_DASHBOARD_ORDER_GRAPH } from "../network/Api";
import requestApi from "../network/httpRequest";
import Graph from "./Graph";

const OrdersGraph = () => {

    const initStartDate = moment().startOf("month").format("YYYY-MM-DD");
    const initEndDate = moment().endOf("month").format("YYYY-MM-DD");


    const { account_type, _id: Id } = JSON.parse(localStorage.getItem("admin"));
    const [filterType, setFilterType] = useState({ label: "Daily", value: "normal" });
    const [year, setYear] = useState(new Date().getFullYear());
    const [startDate, setStartDate] = useState(initStartDate);
    const [endDate, setEndDate] = useState(initEndDate);
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState({});
    const [isLoading, setIsLoading] = useState(false);



    useEffect(async () => {
        if (filterType && (year || startDate || endDate)) {
            setIsLoading(true)
            try {
                const { data } = await requestApi().request(account_type === 'admin' ? ADMIN_DASHBOARD_ORDER_GRAPH : account_type === 'seller' ? SELLER_DASHBOARD_ORDER_GRAPH : SHOP_DASHBOARD_ORDER_GRAPH, {
                    params: {
                        startDate,
                        endDate,
                        type: filterType.value === 'month' ? 'normal' : filterType.value,
                        year
                    },
                });

                if (data.status) {

                    const { info } = data.data;
                    console.log(info);
                    setData(info)
                    setIsLoading(false);

                }
            } catch (e) {
                console.log(e.message);
                setIsLoading(false);
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

    // GET SELECTED MONTH START DATE AND END DATE 

    const getSelectMonthDate = ({ value }) => {
        let year = new Date().getFullYear();

        var startDate = moment([year, value - 1]);
        var endDate = moment(startDate).endOf('month');

        setStartDate(startDate.format("YYYY-MM-DD"));
        setEndDate(endDate.format("YYYY-MM-DD"));

    }

    return (
        <React.Fragment>
            <Graph
                filterType={type => {
                    setFilterType(type);
                    setStartDate(initStartDate);
                    setEndDate(initEndDate)
                }}
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
                getMonth={month => getSelectMonthDate(month)}
            />

        </React.Fragment>
    );


};

export default OrdersGraph;
