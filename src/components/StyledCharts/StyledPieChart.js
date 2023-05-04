import { Doughnut } from 'react-chartjs-2';

const defaultOptions = {
  reponsive: true,
  maintainAspectRatio: false,
  cutoutPercentage: 70,
  legend: {
    display: false,
  },
};

export default function StyledDoughnutChart({ data }) {
  return <Doughnut options={defaultOptions} data={data} />;
}
