/* eslint-disable react/jsx-no-useless-fragment */
// mui
import { Box, styled } from '@mui/material';

const StyledTabPanel = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

export default function TabPanel({ value, index, containerSx, children }) {
  if (value !== index) {
    return <></>;
  }

  return <StyledTabPanel sx={containerSx}>{children}</StyledTabPanel>;
}
