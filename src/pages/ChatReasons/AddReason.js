// mui
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';

// thrid party
import { useEffect, useState } from 'react';

// project import
import { useSelector } from 'react-redux';
import { chatReasonType } from '../../assets/staticData';
import OptionsSelect from '../../components/Form/OptionsSelect';

const initialChatReasons = {
  type: 'accountSupport',
  question: '',
  answer: '',
};

export default function AddChatReason({ submitHandler, isEdit, chatReason }) {
  const { newFaq, loading } = useSelector((store) => store.chatReasonReducer);
  const [currentChatReason, setCurrentChatReason] = useState(chatReason || initialChatReasons);

  const changeHandler = (event) => {
    setCurrentChatReason((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  useEffect(() => {
    setCurrentChatReason(initialChatReasons);
  }, [newFaq]);

  useEffect(() => {
    if (isEdit) {
      setCurrentChatReason(chatReason);
    }
  }, [chatReason]);

  return (
    <Stack spacing={6}>
      <Stack direction="row" alignItems="center" spacing={5}>
        <Typography variant="h5">Choose Type</Typography>
        <OptionsSelect
          items={chatReasonType}
          value={currentChatReason?.type}
          disabled={isEdit}
          onChange={(value) => {
            setCurrentChatReason((prev) => ({ ...prev, type: value }));
          }}
        />
      </Stack>
      <FormControl className={`${isEdit ? '' : 'd-none'}`}>
        <InputLabel>Status</InputLabel>
        <Select label="Status" value={currentChatReason.status || ''} name="status" onChange={changeHandler}>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Question"
        name="question"
        variant="outlined"
        value={currentChatReason?.question}
        onChange={changeHandler}
        sx={{
          width: '100%',
        }}
      />
      <TextField
        label="Answer"
        variant="outlined"
        name="answer"
        multiline
        rows={4}
        value={currentChatReason?.answer}
        onChange={changeHandler}
        sx={{
          width: '100%',
        }}
      />
      <Button
        disableElevation
        variant="contained"
        disabled={(isEdit && !currentChatReason?._id) || loading}
        onClick={() => {
          submitHandler(currentChatReason);
        }}
      >
        {isEdit ? 'Save' : 'Add New'}
      </Button>
    </Stack>
  );
}
