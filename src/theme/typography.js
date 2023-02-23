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
  };
}
