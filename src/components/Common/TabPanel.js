/* eslint-disable react/jsx-no-useless-fragment */
// mui
import { Box, styled } from '@mui/material';

const StyledTabPanel = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

export default function TabPanel({ value, index, children, ...props }) {
  if (value !== index) {
    return <></>;
  }

  return <StyledTabPanel {...props}>{children}</StyledTabPanel>;
}
