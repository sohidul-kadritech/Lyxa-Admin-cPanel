export default function Typography(theme) {
  console.log('text secondary', theme.palette?.text?.secondary);
  return {
    styleOverrides: {
      body3: {
        color: theme.palette.text.secondary,
      },
    },
  };
}
