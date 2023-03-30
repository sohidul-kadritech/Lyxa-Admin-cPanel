// thrid party
import { Cached, ChevronRight } from '@mui/icons-material';
import { Box, Button, Paper, Stack, Typography, useTheme } from '@mui/material';
import LoadingOverlay from '../../components/Common/LoadingOverlay';

export default function MCard({ icon: Icon, title, description, onOpen, ongoing, disabled }) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        borderRadius: '12px',
        border: '1px solid #EEEEEE',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {ongoing && (
        <Button
          variant="contained"
          color="secondary"
          startIcon={<Cached />}
          onClick={onOpen}
          sx={{
            fontSize: '15px',
            lineHeight: '24px',
            background: '#F6F8FA',
            color: '#5E97A9',
            gap: '0px',
            padding: '5px 15px',
            position: 'absolute',
            right: '16px',
            top: '16px',
            textTransform: 'none',

            '&:hover': {
              background: '#F6F8FA',
              color: '#5E97A9',
            },
          }}
        >
          Ongoing promotion
        </Button>
      )}
      {disabled && <LoadingOverlay />}
      <Box>
        <Icon />
      </Box>
      <Stack
        direction="row"
        gap="10px"
        alignItems="center"
        sx={{
          paddingTop: 5,
          paddingBottom: 7.5,
          cursor: 'pointer',
          display: 'inline-flex',
        }}
        onClick={onOpen}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: '19px',
          }}
        >
          {title}
        </Typography>
        <Box>
          <ChevronRight />
        </Box>
      </Stack>
      <Typography
        variant="body1"
        sx={{
          lineHeight: '28px',
          fontSize: '17px !important',
          color: theme.palette.text.heading,
        }}
      >
        {description}
      </Typography>
    </Paper>
  );
}
