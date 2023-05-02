import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Typography, styled, useTheme } from '@mui/material';
import moment from 'moment';
import { ReactComponent as TimelineInactive } from '../../assets/icons/time-inactive.svg';
import { ReactComponent as TimelineChecked } from '../../assets/icons/timeline-check.svg';

const StyledTimeline = styled(Timeline)(({ theme }) => ({
  marginBottom: 0,
  padding: 0,
  paddingLeft: 1,

  [`& .${timelineItemClasses.root}:before`]: {
    flex: 0,
    padding: 0,
  },

  '& .MuiTimelineItem-root': {
    minHeight: 'auto',
  },

  '& .MuiTimelineDot-root': {
    boxShadow: 'none',
    background: 'transparent',
    margin: '0px 0px',
    padding: '0',
  },

  '& .MuiTimelineContent-root': {
    padding: 0,
    paddingLeft: '15px',
  },

  '& .MuiTimelineConnector-root': {
    minHeight: '10px',
    background: '#A3A3A3',
    width: '1px',

    '&.active': {
      color: theme.palette.error.main,
    },
  },
}));

export default function OrderTimeline({ orderTimeline = [], ...props }) {
  const theme = useTheme();

  return (
    <StyledTimeline {...props}>
      {orderTimeline.map((timeline, index, array) => (
        <TimelineItem key={`${index}`}>
          <TimelineSeparator>
            <TimelineDot>
              {timeline?.active ? (
                <TimelineChecked
                  style={{
                    color: theme.palette.error.main,
                  }}
                />
              ) : (
                <TimelineInactive
                  style={{
                    color: '#A3A3A3',
                  }}
                />
              )}
            </TimelineDot>
            {index !== array.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Typography
              variant="body4"
              fontSize={12}
              sx={{
                fontSize: '12px',
                lineHeight: '20px',
                display: 'flex',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  flexBasis: '60px',
                }}
              >
                {timeline?.active ? moment(timeline?.createdAt).format('hh:mm a') : '_'}
              </span>
              <span>{timeline?.note}</span>
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </StyledTimeline>
  );
}
