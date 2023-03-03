/* eslint-disable no-unused-vars */
// mui
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';

// thrid party
import { useEffect, useState } from 'react';

// project import
import { useDispatch, useSelector } from 'react-redux';
import { faqType as faqTypeOptions } from '../../assets/staticData';
import OptionsSelect from '../../components/Form/OptionsSelect';
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

export default function AddFaq({ submitHandler, isEdit, faq, closeHandler }) {
  const dispatch = useDispatch();

  const {
    isUpdated: isFaqUpdated,
    isAdded: isFaqAdded,
    loading: isFaqLoading,
  } = useSelector((store) => store.faqReducer);

  const {
    isUpdated: isChatReasonUpdated,
    isAdded: isChatReasonAdded,
    loading: isChatReasonLoading,
  } = useSelector((store) => store.chatReasonReducer);

  const [currentFaq, setCurrentFaq] = useState(faq || initialFaq);
  const [faqType, setFaqType] = useState('');
  const [childFaqType, setChildFaqType] = useState('user');

  const changeHandler = (event) => {
    setCurrentFaq((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const checkFaqType = () => {
    if (currentFaq.type === 'faq') {
      submitHandler({ ...currentFaq, type: childFaqType });
    } else {
      submitHandler(currentFaq);
    }
  };

  useEffect(() => {
    if (isFaqUpdated || isChatReasonUpdated) {
      closeHandler();
      dispatch(updateFaqIsUpdated(false));
      dispatch(updateChatReasonIsUpdated(false));
    }

    if (isFaqAdded || isChatReasonAdded) {
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
    <Stack spacing={6}>
      <Stack
        direction="row"
        spacing={5}
        sx={{
          alignItems: {
            xl: 'center',
            lg: 'start',
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            flexShrink: 0,
          }}
        >
          Type
        </Typography>
        <OptionsSelect
          items={faqUpperOptions}
          value={currentFaq?.type}
          disabled={isEdit}
          onChange={(value) => {
            setCurrentFaq((prev) => ({ ...prev, type: value }));
          }}
        />
      </Stack>
      {currentFaq.type === 'faq' && (
        <Stack direction="row" alignItems="center" spacing={5}>
          <Typography
            variant="h5"
            sx={{
              flexShrink: 0,
            }}
          >
            Faq Type
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
        <InputLabel>Status</InputLabel>
        <Select label="Status" value={currentFaq.status || ''} name="status" onChange={changeHandler}>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Question"
        name="question"
        variant="outlined"
        value={currentFaq?.question}
        onChange={changeHandler}
        sx={{
          width: '100%',
        }}
      />
      <TextField
        label="Answer"
        variant="outlined"
        name="ans"
        multiline
        rows={4}
        value={currentFaq?.ans}
        onChange={changeHandler}
        sx={{
          width: '100%',
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
        {isEdit ? 'Save' : 'Add New'}
      </Button>
    </Stack>
  );
}
