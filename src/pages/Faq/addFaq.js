// mui
import { Button, Stack, TextField, Typography } from '@mui/material';

// thrid party
import { useEffect, useState } from 'react';

// project import
import { faqType } from '../../assets/staticData';
import OptionsSelect from '../../components/Form/OptionsSelect';

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
    <Stack spacing={6}>
      <Stack direction="row" alignItems="center" spacing={5}>
        <Typography variant="h5">Choose Type</Typography>
        <OptionsSelect
          items={faqType}
          value={currentFaq?.type}
          disabled={isEdit}
          onChange={(value) => {
            setCurrentFaq((prev) => ({ ...prev, type: value }));
          }}
        />
      </Stack>
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
