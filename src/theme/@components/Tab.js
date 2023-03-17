export default function Tab(theme) {
  return {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        fontWeight: '700',
        fontSize: '19px',
        lineHeight: '20px',
        color: theme.palette.text.heading,
        borderBottom: '2px solid #EEEEEE',
        padding: '14px 16px',
        textTransform: 'initial',
      },
    },
  };
}
