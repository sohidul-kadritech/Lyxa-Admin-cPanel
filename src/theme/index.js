import { createTheme, ThemeProvider } from '@mui/material';
import { useMemo } from 'react';
import GetPallete from './palllete';
import GetTypography from './typography';

export default function Provider({ children }) {
  const themeOptions = useMemo(
    () => ({
      palette: GetPallete(),
      typography: GetTypography(),
    }),
    []
  );

  const customTheme = createTheme(themeOptions);

  return <ThemeProvider theme={customTheme}>{children}</ThemeProvider>;
}
