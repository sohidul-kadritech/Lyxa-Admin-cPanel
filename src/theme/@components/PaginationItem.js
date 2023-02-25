export default function Pagination(theme) {
  return {
    styleOverrides: {
      root: {
        fontSize: '16px',
        width: '60px',
        borderRadius: '30px',
        background: theme.palette.primary.main,
        color: '#fff',
        '&:hover': {
          background: theme.palette.primary.dark,
        },
      },
      selected: {
        opacity: '.8',
        '&:hover': {
          background: `${theme.palette.primary.main}!important`,
        },
      },
      previousNext: {
        background: theme.palette.grey[200],
        color: `${theme.palette.text.primary}!important`,
        '&.Mui-disabled': {
          opacity: '.8',
        },
        '&:hover': {
          background: theme.palette.grey[300],
          color: `${theme.palette.text.primary}!important`,
        },
      },
    },
  };
}
