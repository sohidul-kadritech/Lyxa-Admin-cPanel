import { Button, FormControl, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { faqType as faqTypeOptions } from '../../assets/staticData';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import OptionsSelect from '../../components/Filter/OptionsSelect';
import StyledFormField from '../../components/Form/StyledFormField';

const initialFaq = {
  type: 'accountSupport',
  question: '',
  ans: '',
  status: 'active',
};

const faqUpperOptions = [
  { label: 'FAQ', value: 'faq' },
  { label: 'Account Support', value: 'accountSupport' },
  { label: 'Order Support', value: 'orderSupport' },
];

const statusOptions = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
];

const fieldContainerSx = {
  padding: '14px 0',
};

function AddFaq({ onClose, submitHandler, isEdit, faq, isReadOnly, loading }) {
  const [currentFaq, setCurrentFaq] = useState(faq || initialFaq);
  // eslint-disable-next-line no-unused-vars
  const [faqType, setFaqType] = useState('');
  const [childFaqType, setChildFaqType] = useState('user');

  // eslint-disable-next-line no-unused-vars
  const changeHandler = (event) => {
    setCurrentFaq((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  // eslint-disable-next-line no-unused-vars
  const checkFaqType = () => {
    if (currentFaq.type === 'faq') {
      submitHandler({ ...currentFaq, type: childFaqType });
    } else {
      submitHandler(currentFaq);
    }
  };

  useEffect(() => {
    if (isEdit) {
      if (faq.type !== 'orderSupport' && faq.type !== 'accountSupport') {
        setChildFaqType(faq.type);
        setCurrentFaq({ ...faq, type: 'faq' });
      } else {
        setCurrentFaq(faq);
      }
    }
  }, [faq]);

  return (
    <SidebarContainer
      title={`${
        isEdit && isReadOnly === false
          ? 'Edit Q&A'
          : isEdit === false && isReadOnly === false
          ? 'Add New Q&A'
          : 'View Q&A'
      }`}
      onClose={onClose}
    >
      <Stack spacing={6}>
        <Stack direction="column" spacing={5}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: '600',
              fontSize: '15px',
              lineHeight: '18px',
            }}
          >
            Type
          </Typography>
          <OptionsSelect
            items={faqUpperOptions.filter((option) => currentFaq?.type === option?.value)}
            value={currentFaq?.type}
            disabled={isEdit}
            onChange={(value) => {
              setCurrentFaq((prev) => ({ ...prev, type: value }));
            }}
          />
        </Stack>
        {currentFaq.type === 'faq' && (
          <Stack direction="column" spacing={5}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: '600',
                fontSize: '15px',
                lineHeight: '18px',
              }}
            >
              FAQ Type
            </Typography>
            <OptionsSelect
              items={faqTypeOptions}
              value={childFaqType}
              disabled={isEdit}
              onChange={(value) => {
                setChildFaqType(value);
              }}
            />
          </Stack>
        )}
        <FormControl className={`${isEdit ? '' : 'd-none'}`}>
          <StyledFormField
            label="Status *"
            intputType="select"
            containerProps={{
              sx: fieldContainerSx,
            }}
            inputProps={{
              name: 'status',
              value: currentFaq?.status || '',
              items: statusOptions,
              onChange: changeHandler,
              readOnly: isReadOnly,
            }}
          />
        </FormControl>
        <StyledFormField
          label="Question *"
          intputType="text"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            value: currentFaq?.question,
            type: 'text',
            name: 'question',
            onChange: changeHandler,
            readOnly: isReadOnly,
          }}
        />
        <StyledFormField
          label="Answer *"
          intputType="text"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            value: currentFaq?.ans || currentFaq?.answer,
            type: 'textarea',
            name: `${currentFaq.type === 'faq' ? 'ans' : 'answer'}`,
            multiline: true,
            onChange: changeHandler,
            readOnly: isReadOnly,
          }}
        />
        <Button
          disableElevation
          variant="contained"
          disabled={loading}
          onClick={() => {
            checkFaqType();
          }}
        >
          {isEdit ? 'Save' : 'Add'}
        </Button>
      </Stack>
    </SidebarContainer>
  );
}

export default AddFaq;
