import { Typography } from '@mui/material';
import StyledAccordion from '../../../Styled/StyledAccordion';

export default function TableAccordion({ title, titleComponent, children }) {
  return (
    <StyledAccordion
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        background: '#fff',
        borderBottom: 0,
        paddingLeft: '8px',
        paddingRight: '8px',
        border: '1px solid transparent',

        '&.Mui-expanded': {
          border: '1px solid #e8e7e7',
          zIndex: 9,
        },

        '& .MuiAccordionDetails-root': {
          position: 'relative',
          zIndex: 999,
          padding: 0,
        },

        '& .MuiAccordionSummary-root': {
          minHeight: '64px',
        },

        '& .MuiAccordionSummary-content': {
          margin: '0!important',
          height: '100%',
        },
      }}
      Title={titleComponent || <Typography variant="body4">{(title || 0)?.toFixed(2)}</Typography>}
    >
      {children}
    </StyledAccordion>
  );
}
