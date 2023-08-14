import { Doughnut } from 'react-chartjs-2';

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutoutPercentage: 70,
  legend: {
    display: false,
  },
};

export default function StyledDoughnutChart({ data, options }) {
  return <Doughnut options={{ ...defaultOptions, ...options }} data={data} />;
}
