/* eslint-disable no-unused-vars */
import { Delete, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Button, Stack, Typography, styled } from '@mui/material';
import { useState } from 'react';
import IncrementDecrementInput from '../../../components/Form/IncrementDecrementInput';
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

export default function AttributeItem({ attributItem, readonly, onDelete, onChangeAttribute }) {
  const [render, setRender] = useState(false);

  const [maxLimit, setMaxLimit] = useState(attributItem?.items?.length);

  const attrOptionsHandler = (option) => {
    if (option.value === 'required') {
      if (attributItem?.required !== undefined) {
        attributItem.required = !attributItem.required;
        attributItem.minimumRequiredAttribute = 0;
      }
    } else if (attributItem?.select !== undefined) {
      attributItem.select = attributItem.select === 'multiple' ? 'single' : 'multiple';
      attributItem.maximumRequiredAttribute = 0;
    }
    setRender((prev) => !prev);
  };

  const onChangeHandler = (key, value) => {
    if (key === 'minimumRequiredAttribute') {
      attributItem.minimumRequiredAttribute = value;
    }
    if (key === 'maximumRequiredAttribute') {
      attributItem.maximumRequiredAttribute = value;
    }

    setRender((prev) => !prev);

    // setAtribute((prev) => ({ ...prev, [key]: value }));
  };

  console.log('attributeItem', { attributItem });

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
        {/* Type options */}
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
        <AttributeList items={attributItem?.items || []} readOnly={readonly} setMaxLimit={setMaxLimit} />

        {attributItem?.select === 'multiple' && (
          <Stack width="100%" gap={4} mb={4}>
            {attributItem?.required && (
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body">Minimum Required Attribute</Typography>
                <IncrementDecrementInput
                  disabled={readonly}
                  min={0}
                  max={maxLimit}
                  step={1}
                  value={attributItem?.minimumRequiredAttribute || 0}
                  inputBoxSx={{ minWidth: '10px' }}
                  dynamicWidth
                  onChange={(value) => {
                    onChangeHandler('minimumRequiredAttribute', value);
                  }}
                />
              </Stack>
            )}

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body">Maximum Required Attribute</Typography>
              <IncrementDecrementInput
                disabled={readonly}
                min={0}
                max={maxLimit}
                step={1}
                value={attributItem?.maximumRequiredAttribute || 0}
                inputBoxSx={{ minWidth: '10px' }}
                dynamicWidth
                onChange={(value) => {
                  onChangeHandler('maximumRequiredAttribute', value);
                }}
              />
            </Stack>
          </Stack>
        )}
      </AccordionDetails>
    </StyledAccordion>
  );
}
