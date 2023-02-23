import Close from '@mui/icons-material/Close';
import { IconButton, styled } from '@mui/material';

const Button = styled(IconButton)(({ theme }) => ({
  color: '#000',
  '&:hover': {
    background: theme.palette.grey[500],
  },
}));

export default function CloseButton({ ...props }) {
  return (
    <Button {...props}>
      <Close />
    </Button>
  );
}
