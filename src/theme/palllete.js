export default function GetPallete() {
  return {
    mode: 'light',
    primary: {
      main: '#DD5B63',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#15BFCA',
      contrastText: '#ffffff',
    },
    info: {
      main: '#636363',
      contrastText: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 1)',
      secondary: '#646464',
    },
    grey: {
      200: 'rgba(0, 0, 0, 0.08)',
    },
    custom: {
      tableLoader: 'rgba(255, 255, 255, 0.7)',
      contrastText: '#ffffff',
      subHeading: '#B5B5C3',
    },
  };
}
