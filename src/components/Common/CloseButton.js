import Close from '@mui/icons-material/Close';
import { IconButton, styled } from '@mui/material';

const Button = styled(IconButton)(() => ({
  background: 'transparent',

  '& .MuiSvgIcon-root': {
    width: '14px',
    height: '14px',
  },

  '&:hover': {
    background: 'transparent',
    fontSize: '16px',
  },
}));

export default function CloseButton({ ...props }) {
  return (
    <Button {...props}>
      <Close />
    </Button>
  );
}
