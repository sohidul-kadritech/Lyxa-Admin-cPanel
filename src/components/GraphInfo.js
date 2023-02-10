import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ADMIN_DASHBOARD_EARNING_GRAPH,
  ADMIN_DASHBOARD_ORDER_GRAPH,
  ADMIN_DASHBOARD_USERS_GRAPH,
  SELLER_DASHBOARD_EARNING_GRAPH,
  SELLER_DASHBOARD_ORDER_GRAPH,
  SHOP_DASHBOARD_EARNING_GRAPH,
  SHOP_DASHBOARD_ORDER_GRAPH,
} from '../network/Api';
import requestApi from '../network/httpRequest';
import Graph from './Graph';

function GraphInfo({ graphType }) {
  const initStartDate = moment().startOf('month').format('YYYY-MM-DD');
  const initEndDate = moment().endOf('month').format('YYYY-MM-DD');

  const { account_type } = useSelector((store) => store.Login.admin);
  const [filterType, setFilterType] = useState({
    label: 'Daily',
    value: 'normal',
  });
  const [year, setYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState(initStartDate);
  const [endDate, setEndDate] = useState(initEndDate);
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState({ label: 'January', value: '1' });
  const options = { day: 'numeric', month: 'short' };

  // eslint-disable-next-line consistent-return
  const getApi = (graphType) => {
    if (graphType === 'order') {
      return account_type === 'admin'
        ? ADMIN_DASHBOARD_ORDER_GRAPH
        : account_type === 'seller'
        ? SELLER_DASHBOARD_ORDER_GRAPH
        : SHOP_DASHBOARD_ORDER_GRAPH;
    }
    if (graphType === 'user') {
      return ADMIN_DASHBOARD_USERS_GRAPH;
    }
    if (graphType === 'earning') {
      return account_type === 'admin'
        ? ADMIN_DASHBOARD_EARNING_GRAPH
        : account_type === 'seller'
        ? SELLER_DASHBOARD_EARNING_GRAPH
        : SHOP_DASHBOARD_EARNING_GRAPH;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const getData = async () => {
      if ((filterType && year) || startDate || endDate || month) {
        setIsLoading(true);
        try {
          const { data } = await requestApi().request(getApi(graphType), {
            params: {
              startDate,
              endDate,
              type: filterType.value === 'month' ? 'normal' : filterType.value,
              year,
            },
          });

          if (data && isMounted) {
            setIsLoading(false);
            if (data.status) {
              const { info } = data.data;
              setData(info);
            }
          }
        } catch (e) {
          console.log(e.message);
          if (isMounted) {
            setIsLoading(false);
            setIsLoading(false);
          }
        }
      }
    };
    getData();

    return () => {
      isMounted = false;
    };
  }, [filterType, year, startDate, endDate]);

  useEffect(() => {
    if (data.length > 0) {
      const labelsData = data?.map((item) =>
        item.date ? new Date(item?.date).toLocaleDateString('en-GB', options) : moment(item?.month, 'M').format('MMMM')
      );
      const seriesData = data?.map((item) => item[graphType]);
      if (labelsData && seriesData) {
        const chartInfo = {
          labels: labelsData,
          series: seriesData,
        };
        setChartData(chartInfo);
      }
    }
  }, [data]);

  // GET SELECTED MONTH START DATE AND END DATE

  const getSelectMonthDate = ({ value }) => {
    const year = new Date().getFullYear();

    const startDate = moment([year, value - 1]);
    const endDate = moment(startDate).endOf('month');

    setStartDate(startDate.format('YYYY-MM-DD'));
    setEndDate(endDate.format('YYYY-MM-DD'));
  };

  const updateFilterType = (type) => {
    setFilterType(type);
    if (type.value === 'normal') {
      setStartDate(initStartDate);
      setEndDate(initEndDate);
    } else if (type.value === 'month') {
      getSelectMonthDate(month);
    }
  };

  return (
    <Graph
      filterType={(type) => updateFilterType(type)}
      startDate={(date) => setStartDate(date)}
      endDate={(date) => setEndDate(date)}
      year={(year) => setYear(year)}
      type={filterType}
      startDateValue={startDate}
      endDateValue={endDate}
      chartData={chartData}
      isLoading={isLoading}
      yearValue={year}
      graphType={graphType}
      getMonth={(month) => {
        getSelectMonthDate(month);
        setMonth(month);
      }}
      month={month}
    />
  );
}

export default GraphInfo;
