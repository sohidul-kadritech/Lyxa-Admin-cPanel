import { Box, Stack, Typography, useTheme } from '@mui/material';
import CloseButton from './CloseButton';

export default function SidebarContainer({ onClose, title, children }) {
  const theme = useTheme();

  return (
    <Stack
      justifyContent="space-between"
      sx={{
        minWidth: '400px',
        maxWidth: '400px',
        paddingLeft: '16px',
        paddingRight: '20px',
        paddingTop: '60px',
        position: 'relative',
        height: '100vh',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          position: 'sticky',
          top: 0,
          paddingTop: '20px',
          paddingBottom: '15px',
          zIndex: '99999',
          background: '#fff',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: '19px',
            lineHeight: '23px',
          }}
        >
          {title}
        </Typography>
        <CloseButton
          disableRipple
          onClick={onClose}
          sx={{
            color: theme.palette.text.primary,
          }}
        />
      </Stack>
      <Box
        sx={{
          flex: 1,
        }}
      >
        {children}
      </Box>
    </Stack>
  );
}
