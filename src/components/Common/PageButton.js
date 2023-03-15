import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

export default function PageButton({ label, to, ...props }) {
  const history = useHistory();

  return (
    <Button
      sx={{
        fontWeight: '500',
        fontSize: '17px',
        lineHeight: '28px',
        textDecorationLine: 'underline',
        textUnderlineOffset: '2px',
        padding: '0px',
        gap: '15px',

        '& .MuiButton-startIcon, & .MuiButton-endIcon': {
          margin: '0px',
        },
      }}
      variant="text"
      color="secondary"
      onClick={() => {
        if (to) {
          history.push(to);
        }
      }}
      {...props}
    >
      {label}
    </Button>
  );
}
