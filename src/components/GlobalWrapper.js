import { Box } from '@mui/material';

function GlobalWrapper({ children, padding }) {
  return (
    <Box
      pr={{
        xl: padding ? 10 : 0,
        lg: padding ? 5 : 0,
      }}
      pl={{
        xl: padding ? 10 : 0,
        lg: padding ? 5 : 0,
      }}
    >
      {children}
    </Box>
  );
}

export default GlobalWrapper;
