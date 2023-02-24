import { createTheme, ThemeProvider } from '@mui/material';
import { useMemo } from 'react';
import Components from './@components';
import GetPallete from './palllete';
import GetTypography from './typography';

export default function Provider({ children }) {
  const customTheme = useMemo(() => {
    const theme = createTheme({
      palette: GetPallete(),
      typography: GetTypography(),
      spacing: 4,
    });

    theme.components = Components(theme);

    return theme;
  }, []);

  return <ThemeProvider theme={customTheme}>{children}</ThemeProvider>;
}
