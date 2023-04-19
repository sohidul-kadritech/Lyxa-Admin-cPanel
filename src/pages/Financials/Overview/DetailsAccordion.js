import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Tooltip, Typography, styled } from '@mui/material';
import { useRef, useState } from 'react';
import { ReactComponent as InfoIcon } from '../../../assets/icons/info.svg';

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  flexDirection: 'row-reverse',
  gap: '10px',
  minHeight: '0!important',
  padding: '14px 0',

  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(0deg)',
  },

  '&.icon-hidden .MuiAccordionSummary-expandIconWrapper': {
    visibility: 'hidden',
  },

  '& .MuiSvgIcon-root': {
    color: theme.palette.text.primary,
    fontSize: '24px',
  },

  '& .MuiAccordionSummary-content': {
    margin: '0',

    '&.Mui-expanded': {
      margin: 0,
    },
  },
}));

const StyledAccordion = styled(Accordion)(() => ({
  borderBottom: '1px solid #EEEEEE',

  '&.Mui-expanded': {
    margin: 0,
  },

  '&:before': {
    display: 'none',
  },
}));

export default function DetailsAccordion({
  isOpen,
  onChange,
  children,
  title,
  titleAmount,
  titleAmountStatus,
  tooltip,
  ...props
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef();

  return (
    <StyledAccordion
      expanded={open}
      onChange={() => {
        setOpen((prev) => (containerRef.current?.childNodes?.length === 0 ? false : !prev));
      }}
      {...props}
    >
      <StyledAccordionSummary expandIcon={<ExpandMore />}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flex={1}>
          <Stack direction="row" alignItems="center" gap={2.5}>
            <Typography variant="body1" fontWeight={600}>
              {title}
            </Typography>
            <Tooltip title={tooltip}>
              <InfoIcon />
            </Tooltip>
          </Stack>
          <Typography variant="body1" fontWeight={600} color={titleAmountStatus === 'minus' ? 'error' : undefined}>
            {titleAmount}
          </Typography>
        </Stack>
      </StyledAccordionSummary>
      <AccordionDetails
        sx={{
          padding: 0,
          paddingLeft: '33px',
          paddingBottom: '20px',
        }}
      >
        <Box ref={containerRef}>{children}</Box>
      </AccordionDetails>
    </StyledAccordion>
  );
}
