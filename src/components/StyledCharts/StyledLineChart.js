import { Line } from 'react-chartjs-2';

export const options = {
  reponsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
};
export default function StyledLineChart({ data }) {
  return <Line options={options} data={data} />;
}
