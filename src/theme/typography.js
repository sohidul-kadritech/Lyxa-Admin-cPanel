import pxToRem from '../helpers/pxToRem';

export default function GetTypography() {
  return {
    fontFamily: `'Open Sans', sans-serif`,
    h1: {
      fontWeight: 700,
      fontSize: `${pxToRem(42)}rem`,
      lineHeight: 1.1,
      letterSpacing: '0px',
    },
    h2: {
      fontWeight: 700,
      fontSize: `${pxToRem(32)}rem`,
      lineHeight: 1.1,
      letterSpacing: '0px',
    },
    h3: {
      fontWeight: 600,
      fontSize: `${pxToRem(24)}rem`,
      lineHeight: 1.1,
      letterSpacing: '0px',
    },
    h5: {
      fontWeight: 500,
      fontSize: `${pxToRem(16)}rem`,
      lineHeight: 1.1,
      letterSpacing: '0px',
    },
  };
}
