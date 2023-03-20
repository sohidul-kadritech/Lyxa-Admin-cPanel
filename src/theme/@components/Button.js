export default function Button() {
  return {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        fontSize: '16px',
        fontWeight: '500',
        lineHeight: '24px',
        borderRadius: '30px',
        padding: '12px 30px',
        textTransform: 'none',
      },
    },
  };
}
