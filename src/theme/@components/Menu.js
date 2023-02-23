export default function Menu() {
  return {
    defaultProps: {
      open: true,
    },
    styleOverrides: {
      'MuiPopover-paper': {
        boxShadow: 'none',
      },
    },
  };
}
