import { Button, FormControl, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faqType as faqTypeOptions } from '../../assets/staticData';
import SidebarContainer from '../../components/Common/SidebarContainerSm';
import OptionsSelect from '../../components/Filter/OptionsSelect';
import StyledFormField from '../../components/Form/StyledFormField';
import { updateChatReasonIsAdded, updateChatReasonIsUpdated } from '../../store/ChatReason/chatReasonActions';
import { updateFaqIsAdded, updateFaqIsUpdated } from '../../store/faq/faqActions';

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

function AddFaq({ onClose, submitHandler, isEdit, faq }) {
  const dispatch = useDispatch();

  const {
    isUpdated: isFaqUpdated,
    isAdded: isFaqAdded,
    // eslint-disable-next-line no-unused-vars
    loading: isFaqLoading,
  } = useSelector((store) => store.faqReducer);

  const {
    isUpdated: isChatReasonUpdated,
    isAdded: isChatReasonAdded,
    // eslint-disable-next-line no-unused-vars
    loading: isChatReasonLoading,
  } = useSelector((store) => store.chatReasonReducer);

  const [currentFaq, setCurrentFaq] = useState(faq || initialFaq);
  // eslint-disable-next-line no-unused-vars
  const [faqType, setFaqType] = useState('');
  const [childFaqType, setChildFaqType] = useState('user');

  // eslint-disable-next-line no-unused-vars
  const changeHandler = (event) => {
    setCurrentFaq((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    console.log('currentFaq', currentFaq);
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
    if (isFaqUpdated || isChatReasonUpdated) {
      onClose();
      dispatch(updateFaqIsUpdated(false));
      dispatch(updateChatReasonIsUpdated(false));
    }

    if (isFaqAdded || isChatReasonAdded) {
      onClose();
      setCurrentFaq(initialFaq);
      dispatch(updateFaqIsAdded(false));
      dispatch(updateChatReasonIsAdded(false));
    }
  }, [isFaqAdded, isFaqUpdated, isChatReasonUpdated, isChatReasonAdded]);

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
    <SidebarContainer title={`${isEdit ? 'Edit Q&A' : 'Add New Q&A'}`} onClose={onClose}>
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
          }}
        />
        <StyledFormField
          label="Answer *"
          intputType="text"
          containerProps={{
            sx: fieldContainerSx,
          }}
          inputProps={{
            value: currentFaq?.ans,
            type: 'textarea',
            name: 'ans',
            multiline: true,
            onChange: changeHandler,
          }}
        />
        <Button
          disableElevation
          variant="contained"
          disabled={(isEdit && !currentFaq?._id) || isFaqLoading || isChatReasonLoading}
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
