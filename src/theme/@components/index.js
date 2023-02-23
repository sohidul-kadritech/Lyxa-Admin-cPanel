import Button from './Button';
import Paper from './Paper';

export default function Components() {
  return {
    MuiButton: Button(),
    MuiPaper: Paper(),
    MuiDataGrid: {
      styleOverrides: {
        display: 'none',
      },
    },
  };
}
