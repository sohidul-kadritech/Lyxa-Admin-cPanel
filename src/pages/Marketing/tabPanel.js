/* eslint-disable react/jsx-no-useless-fragment */
import { Box } from '@mui/material';

export default function TabPanel({ index, children, value }) {
  if (value !== index) {
    return <></>;
  }

  return <Box>{children}</Box>;
}
