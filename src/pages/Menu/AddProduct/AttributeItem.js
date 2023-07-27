import { Delete, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Button, Stack, Typography, styled } from '@mui/material';
import { useState } from 'react';
import StyledFormField from '../../../components/Form/StyledFormField';
import { attributeTypeAvailableOptions, getAttrOptionsValues } from '../helpers';
import AttributeList from './AttributeList';

const StyledAccordion = styled(Accordion)(() => ({
  borderBottom: '1px solid #eee',

  '&::before': {
    display: 'none',
  },

  '& .MuiAccordionSummary-root': {
    padding: 0,
    minHeight: '48px',

    '&.Mui-expanded': {
      minHeight: '48px',
    },
  },
  '& .MuiAccordionSummary-content': {
    margin: 0,
  },

  '& .MuiAccordionDetails-root': {
    padding: '0',
  },
}));

export default function AttributeItem({ attributItem, readonly, onDelete }) {
  const [render, setRender] = useState(false);

  const attrOptionsHandler = (option) => {
    if (option.value === 'required') {
      if (attributItem?.required !== undefined) {
        attributItem.required = !attributItem.required;
      }
    } else if (attributItem?.select !== undefined) {
      attributItem.select = attributItem.select === 'multiple' ? 'single' : 'multiple';
    }
    setRender((prev) => !prev);
  };

  return (
    <StyledAccordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: '600',
            fontSize: '15px',
            lineHeight: '18px',
          }}
        >
          {attributItem?.name || 'Untitled Attribute'}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <StyledFormField
            intputType="text"
            containerProps={{
              sx: {
                paddingTop: '0',
              },
            }}
            inputProps={{
              type: 'text',
              readOnly: readonly,
              name: 'attributeTitle',
              value: attributItem?.name,
              onChange: (e) => {
                attributItem.name = e.target.value;
                setRender(!render);
              },
            }}
          />
          <Button
            disableRipple
            color="error"
            variant="text"
            startIcon={<Delete />}
            sx={{
              fontSize: '14px',
              lineHeight: '17px',
            }}
            onClick={() => {
              if (readonly) {
                return;
              }
              onDelete();
              setRender(!render);
            }}
          >
            Remove
          </Button>
        </Stack>
        {/* type options */}
        <StyledFormField
          intputType="checkbox"
          containerProps={{
            sx: {
              paddingBottom: '20px',
            },
          }}
          inputProps={{
            items: attributeTypeAvailableOptions,
            value: getAttrOptionsValues(attributItem),
            onChange: attrOptionsHandler,
            readOnly: readonly,
          }}
        />
        {/* attribute list */}
        <AttributeList items={attributItem?.items || []} readOnly={readonly} />
      </AccordionDetails>
    </StyledAccordion>
  );
}
