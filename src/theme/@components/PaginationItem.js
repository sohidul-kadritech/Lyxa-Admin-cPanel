export default function Pagination(theme) {
  return {
    styleOverrides: {
      root: {
        fontSize: '16px',
        // width: '60px',
        // borderRadius: '30px',
        background: theme.palette.primary.contrastText,
        color: theme.palette.text.primary,
        '&:hover': {
          background: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
        '&.Mui-selected': {
          background: `${theme.palette.primary.main}!important`,
          color: theme.palette.primary.contrastText,
        },
      },
      selected: {
        opacity: '0.8',
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
