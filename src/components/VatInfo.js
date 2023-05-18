/* eslint-disable no-unsafe-optional-chaining */
import moment from 'moment';
import { useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { useGlobalContext } from '../context/GlobalContext';
import { getAllVatInfo } from '../store/vat/vatActions';
import CircularLoader from './CircularLoader';

export default function VatInfo() {
  const { summary: vatSummary, loading } = useSelector((store) => store.vatReducer);
  // const { _id: accountId, account_type } = useSelector((store) => store.Login.admin);
  const { currentUser } = useGlobalContext();
  const { admin, userType } = currentUser;

  const dispatch = useDispatch();

  // get all transations
  const callApi = async () => {
    const reqBody = {};
    reqBody.tnxFilter = {
      adminBy: '',
      type: ['VatAmountSettleByAdmin'],
      searchKey: '',
      amountBy: 'asc',
      amountRange: 0,
      amountRangeType: '>',
      startDate: moment().startOf('month').format('YYYY-MM-DD'),
      endDate: moment().endOf('month').format('YYYY-MM-DD'),
    };

    dispatch(getAllVatInfo(reqBody, userType, admin?._id));
  };

  const vatData = [vatSummary?.totalUnsettleVat, vatSummary?.totalVat - vatSummary?.totalUnsettleVat];

  useEffect(() => {
    callApi();
  }, []);

  const data = {
    labels: ['Unpaid', 'Paid'],
    datasets: [
      {
        data: vatData,
        backgroundColor: ['rgba(255, 0, 0, .8)', 'rgba(86, 202, 0, 0.8)'],
        borderColor: ['rgba(236, 236, 241, 1)', 'rgba(236, 236, 241, 1)'],
        borderWidth: 2,
      },
    ],
  };
  return (
    <div>
      {!loading && <Doughnut data={data} />}
      {loading && (
        <div className="text-center">
          <CircularLoader />
        </div>
      )}
    </div>
  );
}
