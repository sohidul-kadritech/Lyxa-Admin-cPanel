import { createTheme, ThemeProvider } from '@mui/material';
import { useMemo } from 'react';
import pxToRem from '../helpers/pxToRem';
import Components from './@components';
import GetPallete from './palllete';

export default function Provider({ children }) {
  const customTheme = useMemo(() => {
    const theme = createTheme({
      palette: GetPallete(),
      spacing: 4,
    });

    // components
    theme.components = Components(theme);

    // typography
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

    theme.typography.h2 = {
      [theme.breakpoints.up('xs')]: {
        fontWeight: 600,
        fontSize: `${pxToRem(32)}rem`,
        lineHeight: 1.1,
        letterSpacing: '0px',
      },
      [theme.breakpoints.up('lg')]: {
        fontWeight: 700,
        fontSize: `${pxToRem(26)}rem`,
      },
      [theme.breakpoints.up('xl')]: {
        fontWeight: 600,
        fontSize: `${pxToRem(32)}rem`,
      },
    };

    theme.typography.h3 = {
      fontWeight: 600,
      fontSize: `${pxToRem(24)}rem`,
      lineHeight: 1.1,
      letterSpacing: '0px',
    };

    theme.typography.h4 = {
      fontWeight: 600,
      fontSize: `${pxToRem(20)}rem`,
      lineHeight: `${pxToRem(24)}rem`,
      letterSpacing: '0px',
    };

    theme.typography.h5 = {
      fontWeight: 500,
      fontSize: `${pxToRem(18)}rem`,
      lineHeight: `${pxToRem(28)}rem`,
      letterSpacing: '-2%',
    };

    theme.typography.h6 = {
      fontWeight: 500,
      fontSize: `${pxToRem(16)}rem`,
      lineHeight: `${pxToRem(28)}rem`,
      letterSpacing: '-2%',
    };

    theme.typography.body1 = {
      lineHeight: `${pxToRem(24)}rem`,
      fontSize: `${pxToRem(16)}rem`,
      letterSpacing: '0px',
      fontWeight: 400,

      [theme.breakpoints.up('lg')]: {
        lineHeight: `${pxToRem(24)}rem`,
        fontSize: `${pxToRem(16)}rem`,
      },

      [theme.breakpoints.up('xl')]: {
        lineHeight: `${pxToRem(24)}rem`,
        fontSize: `${pxToRem(16)}rem`,
      },
    };

    theme.typography.body2 = {
      fontWeight: 400,
      fontSize: `${pxToRem(16)}rem`,
      lineHeight: 1.1,
      letterSpacing: '0px',
    };

    theme.typography.body3 = {
      fontWeight: 400,
      fontSize: `${pxToRem(13)}rem`,
      lineHeight: `${pxToRem(21)}rem`,
      letterSpacing: '0px',

      [theme.breakpoints.up('lg')]: {
        fontSize: `${pxToRem(13)}rem`,
        lineHeight: `${pxToRem(21)}rem`,
      },

      [theme.breakpoints.up('xl')]: {
        fontSize: `${pxToRem(13)}rem`,
        lineHeight: `${pxToRem(21)}rem`,
      },
    };

    return theme;
  }, []);

  return <ThemeProvider theme={customTheme}>{children}</ThemeProvider>;
}
