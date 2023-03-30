export default function Tab(theme) {
  return {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        color: theme.palette.text.heading,
        // color: 'red',
        borderBottom: '2px solid #EEEEEE',
        padding: '15px',
        fontWeight: '600',
        fontSize: '15px',
        lineHeight: '20px',
        opacity: '1',
      },
    },
  };
}
