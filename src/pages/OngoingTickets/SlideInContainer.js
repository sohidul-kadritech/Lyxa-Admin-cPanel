import { Box } from '@mui/material';

const dynamicSx = {
  height: 'calc(100% - 18px)',
  overflowY: 'auto',
  position: 'absolute',
  paddingBottom: '20px',
  top: 0,
  background: '#fff',
  right: '0',
  width: '500px',
  zIndex: '99',
  transform: 'translateX(100%)',
  transition: '200ms ease-in-out',
  opacity: 0,

  '&.sidebar-open': {
    transform: 'translateX(0)',
    opacity: 1,
  },
};

const staticSx = {
  '&.sidebar-open': {
    // paddingRight: 'calc(calc(100vw / 10) * 3)',
    paddingRight: '500px',
    transition: '200ms ease-in-out',
  },
};

export default function SlideInContainer({ type, open, children, ...props }) {
  return (
    <Box sx={type === 'dynamic' ? dynamicSx : staticSx} className={open ? 'sidebar-open' : ''} {...props}>
      {type === 'dynamic' && !open ? null : children}
    </Box>
  );
}
