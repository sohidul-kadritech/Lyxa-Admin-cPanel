import { Button, useTheme } from '@mui/material';
import { ReactComponent as CameraIcon } from '../../assets/icons/camera.svg';

export function CoverPhotoButton({ label }) {
  const theme = useTheme();

  return (
    <Button
      variant="contained"
      startIcon={<CameraIcon />}
      sx={{
        position: 'absolute',
        color: theme.palette.text.primary,
        bottom: 15,
        right: 15,
        backgroundColor: 'white',
        fontWeight: '600',
        fontSize: '16px',
        gap: 2,
        padding: '12px 24px',

        '& .MuiButton-startIcon': {
          margin: '0',
        },

        '&:hover': {
          background: '#d5d5d5',
        },
      }}
    >
      {label}
    </Button>
  );
}
