// thrid party
import { Cached, CalendarToday, ChevronRight, NotificationsPaused, PlayCircleFilledWhite } from '@mui/icons-material';
import { Box, Button, Paper, Skeleton, Stack, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import LoadingOverlay from '../../../components/Common/LoadingOverlay';

function StatusTag({ status }) {
  const matches = useMediaQuery('(max-width: 1400px)');

  let Icon;
  let color;
  let background;

  if (status === 'ongoing') {
    Icon = Cached;
    color = '#5E97A9';
    background = '#F6F8FA';
  } else if (status === 'scheduled') {
    Icon = CalendarToday;
    color = '#5E97A9';
    background = '#F6F8FA';
  } else if (status === 'paused') {
    Icon = PlayCircleFilledWhite;
    color = '#DD5B63';
    background = '#FEE2E2';
  } else {
    Icon = NotificationsPaused;
    color = '#DD5B63';
    background = '#FEE2E2';
  }

  return (
    <Button
      variant="contained"
      startIcon={<Icon />}
      sx={{
        fontSize: matches ? '11px' : '15px',
        lineHeight: '24px',
        background,
        color,
        gap: '0px',
        padding: '5px 15px',
        textTransform: 'capitalize',

        '&:hover': {
          background,
        },
      }}
    >
      {status} promotion
    </Button>
  );
}

export default function MCard({
  icon: Icon,
  title,
  description,
  onOpen,
  disabled,
  ongoingBy,
  status,
  loading,
  readOnly,
  isAdminViewAsShop,
}) {
  const theme = useTheme();
  const matches = useMediaQuery('(max-width: 1400px)');

  if (loading) {
    return (
      <Box
        sx={{
          height: '260px',
          position: 'relative',
          padding: '16px',
        }}
      >
        <Skeleton variant="circular" width={62} height={62} />
        <Skeleton
          height={35}
          sx={{
            marginTop: 3,
            marginBottom: 6,
          }}
        />
        <Stack gap={1.5}>
          <Skeleton height={20} />
          <Skeleton height={20} />
          <Skeleton height={20} />
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {disabled && !isAdminViewAsShop && (
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
        }}
        onClick={readOnly ? undefined : onOpen}
      >
        {status && (
          <Stack
            sx={{
              position: 'absolute',
              right: '16px',
              top: '16px',
              gap: '8px',
              alignItems: 'flex-end',
            }}
          >
            <StatusTag status={status} />
            {status !== 'deactivated' && (
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  fontSize: matches ? '11px' : '13px',
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
                {/* The marktinman */}
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
            cursor: readOnly ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
          }}
        >
          {readOnly ? (
            // eslint-disable-next-line max-len
            <Tooltip title="You cannot add / edit promotion while viewing as shop. Only applied promotions can be viewed as read-only.">
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: '19px',
                }}
              >
                {title}
              </Typography>
            </Tooltip>
          ) : (
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: '19px',
              }}
            >
              {title}
            </Typography>
          )}
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
