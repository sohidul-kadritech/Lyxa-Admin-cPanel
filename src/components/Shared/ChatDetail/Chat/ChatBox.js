import { ExpandMore } from '@mui/icons-material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { PhraseBox } from './PhraseBox';

export default function ChatBox() {
  const [open, setOpen] = useState(false);

  return (
    <Box
      position="relative"
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'custom.border',
        padding: '24px 15px',
        minHeight: '800px',
        borderRadius: '8px',
      }}
    >
      <Stack justifyContent="flex-end" direction="row">
        <Button
          disableRipple
          endIcon={open ? <ExpandMore /> : <ChevronRightIcon />}
          onClick={() => setOpen(!open)}
          sx={{
            background: '#F6F8FA',
            fontWeight: '500',
            padding: '6px 15px',
            color: 'text.primary',

            '&:hover': {
              background: '#F6F8FA',
            },
          }}
        >
          Quickphrase
        </Button>
      </Stack>
      <PhraseBox open={open} />
    </Box>
  );
}
