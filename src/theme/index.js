import { createTheme, ThemeProvider } from '@mui/material';
import { useMemo } from 'react';
import pxToRem from '../helpers/pxToRem';
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

    // components
    theme.components = Components(theme);

    // responsve
    theme.typography.h1 = {
      [theme.breakpoints.up('xs')]: {
        fontWeight: 600,
        fontSize: `${pxToRem(36)}rem`,
        lineHeight: 1.1,
        letterSpacing: '0px',
      },
      [theme.breakpoints.up('lg')]: {
        fontWeight: 700,
        fontSize: `${pxToRem(36)}rem`,
      },
      [theme.breakpoints.up('xl')]: {
        fontWeight: 700,
        fontSize: `${pxToRem(42)}rem`,
      },
    };

    return theme;
  }, []);

  return <ThemeProvider theme={customTheme}>{children}</ThemeProvider>;
}
