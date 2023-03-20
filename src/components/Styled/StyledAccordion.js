import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Stack, useTheme } from '@mui/material';

export default function StyledAccordion({ isOpen, onChange, children, Title, ...props }) {
  const theme = useTheme();
  return (
    <Accordion
      sx={{
        borderBottom: '1px solid #EEEEEE',

        '&:before': {
          display: 'none',
        },
      }}
      expanded={isOpen}
      onChange={(e, closed) => {
        onChange(closed);
      }}
      {...props}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          padding: '0',

          '& .MuiSvgIcon-root': {
            color: theme.palette.text.heading,
          },

          '& .MuiAccordionSummary-content': {
            marginTop: '19px',
            marginBottom: '26px',
          },
        }}
      >
        <Stack direction="row" alignItems="center" gap={2.5}>
          {Title}
        </Stack>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          paddingBottom: '30px',
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
