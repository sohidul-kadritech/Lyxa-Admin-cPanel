import { createTheme, ThemeProvider } from '@mui/material';
import { useMemo } from 'react';
import Components from './@components';
import GetPallete from './palllete';
import GetTypography from './typography';

export default function Provider({ children }) {
  const themeOptions = useMemo(
    () => ({
      palette: GetPallete(),
      typography: GetTypography(),
      components: Components(),
      spacing: 4,
    }),
    []
  );

  const customTheme = createTheme(themeOptions);

  return <ThemeProvider theme={customTheme}>{children}</ThemeProvider>;
}
