// mui
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';

// thrid party
import { useEffect, useState } from 'react';

// project import
import { faqType } from '../../assets/staticData';

export default function AddFaq({ submitHandler, isEdit, faq }) {
  const [currentFaq, setCurrentFaq] = useState(faq || {});
  const changeHandler = (event) => {
    setCurrentFaq((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  useEffect(() => {
    if (isEdit) {
      setCurrentFaq(faq);
    }
  }, [faq]);

  return (
    <Stack spacing={3}>
      <FormControl fullWidth>
        <InputLabel>Type</InputLabel>
        <Select
          value={currentFaq?.type || ''}
          label="Type"
          name="type"
          inputProps={{ defaultValue: currentFaq?.type }}
          onChange={changeHandler}
          disabled={isEdit || undefined}
        >
          {faqType.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
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
        disabled={isEdit && !currentFaq?._id}
        onClick={() => {
          submitHandler(currentFaq);
        }}
      >
        {isEdit ? 'Save' : 'Add New'}
      </Button>
    </Stack>
  );
}
