import { Slider } from '@mui/material';

const marks = [
  {
    value: 1,
    label: '1 day',
  },
  {
    value: 30,
    label: '30 days',
  },
];

export default function DateSliderPicker({ ...props }) {
  return <Slider aria-label="Days" {...props} valueLabelDisplay="auto" step={1} marks={marks} min={1} max={30} />;
}
