import { Typography } from '@mui/material';
import { useState } from 'react';
import StyledAccordion from '../../../Styled/StyledAccordion';

export default function TableAccordion({ title, titleComponent, children, hideIcon }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StyledAccordion
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        background: '#fff',
        borderBottom: 0,
        paddingLeft: `${!hideIcon ? '8px' : 0}`,
        paddingRight: `${!hideIcon ? '8px' : 0}`,
        border: '1px solid transparent',

        '&.Mui-expanded': {
          border: `1px solid ${hideIcon ? 'transparent' : '#e8e7e7'}`,
          zIndex: 9,
        },

        '& .MuiAccordionDetails-root': {
          position: 'relative',
          zIndex: 999999,
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
      isOpen={isOpen}
      onChange={(closed) => {
        console.log('closed', closed);
        setIsOpen(() => !!closed);
      }}
      onMouseLeave={() => {
        setTimeout(() => {
          setIsOpen(false);
        }, 300);
      }}
      hideIcon={hideIcon}
    >
      {children}
    </StyledAccordion>
  );
}
