import { Box } from '@mui/material';

function GlobalWrapper({ children, padding }) {
  return <Box sx={padding ? { paddingLeft: '40px', paddingRight: '40px' } : {}}>{children}</Box>;
}

export default GlobalWrapper;
