/* eslint-disable react/jsx-no-useless-fragment */
// mui
import { Box, styled } from '@mui/material';

const StyledTabPanel = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

const noPaddingSx = {
  paddingTop: 0,
  paddingBottom: 0,
};

export default function TabPanel({ value, index, noPadding, children, ...props }) {
  if (value !== index) {
    return null;
  }

  return (
    <StyledTabPanel sx={noPadding ? noPaddingSx : undefined} {...props}>
      {children}
    </StyledTabPanel>
  );
}
