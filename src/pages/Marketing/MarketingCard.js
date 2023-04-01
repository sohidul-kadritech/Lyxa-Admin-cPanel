// thrid party
import { Cached, CalendarToday, ChevronRight } from '@mui/icons-material';
import { Box, Button, Paper, Stack, Typography, useTheme } from '@mui/material';
import LoadingOverlay from '../../components/Common/LoadingOverlay';

export default function MCard({ icon: Icon, title, description, onOpen, ongoing, disabled, scheduled, ongoingBy }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {disabled && (
        <LoadingOverlay
          sx={{
            zIndex: '99',
          }}
        />
      )}
      <Paper
        sx={{
          borderRadius: '12px',
          border: '1px solid #EEEEEE',
          padding: '16px',
          cursor: 'pointer',
        }}
        onClick={onOpen}
      >
        {(ongoing || scheduled) && (
          <Stack
            sx={{
              position: 'absolute',
              right: '16px',
              top: '16px',
              gap: '8px',
              alignItems: 'flex-end',
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              startIcon={ongoing ? <Cached /> : <CalendarToday />}
              sx={{
                fontSize: '15px',
                lineHeight: '24px',
                background: '#F6F8FA',
                color: '#5E97A9',
                gap: '0px',
                padding: '5px 15px',
                textTransform: 'none',

                '&:hover': {
                  background: '#F6F8FA',
                  color: '#5E97A9',
                },
              }}
            >
              {ongoing && 'Ongoing promotion'}
              {scheduled && 'Scheduled promotion'}
            </Button>
            {disabled && ongoingBy && (
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  fontSize: '13px',
                  lineHeight: '20px',
                  background: '#F6F8FA',
                  color: '#5E97A9',
                  gap: '0px',
                  padding: '4px 12px',
                  textTransform: 'capitalize',

                  '&:hover': {
                    background: '#F6F8FA',
                    color: '#5E97A9',
                  },
                }}
              >
                {ongoingBy}
              </Button>
            )}
          </Stack>
        )}
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
            color: theme.palette.text.primary,
          }}
        >
          {description}
        </Typography>
      </Paper>
    </Box>
  );
}
