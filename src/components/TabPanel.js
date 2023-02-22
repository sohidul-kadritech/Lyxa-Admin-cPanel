/* eslint-disable react/jsx-no-useless-fragment */
// mui
import { Box } from '@mui/material';

export default function TabPanel({ value, index, containerSx, children }) {
  if (value !== index) {
    return <></>;
  }

  return <Box sx={containerSx}>{children}</Box>;
}
