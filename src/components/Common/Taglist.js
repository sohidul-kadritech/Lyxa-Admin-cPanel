import { Add } from '@mui/icons-material';
import { Box, Button, ClickAwayListener, Stack } from '@mui/material';
import { useRef, useState } from 'react';
import StyledChip from '../Styled/StyledChips';
import StyledInput from '../Styled/StyledInput';

export default function Taglist({
  items,
  onDelete,
  onAdd,
  addButtonLabel,
  itemSx,
  listContainerSx,
  buttonSx,
  inputSx,
  ...props
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState('');
  const inputRef = useRef();

  return (
    <Box {...props}>
      <Stack direction="row" gap={4} sx={listContainerSx}>
        {items.map((item, index, array) => (
          <StyledChip
            key={item}
            label={item}
            sx={itemSx}
            onDelete={() => {
              onDelete(item, index, array);
            }}
          />
        ))}
        {showAdd && (
          <ClickAwayListener
            onClickAway={() => {
              if (showAdd) {
                setShowAdd(false);
                setNewItem('');
              }
            }}
          >
            <StyledInput
              ref={inputRef}
              type="number"
              value={newItem}
              sx={{
                width: '90px',
                '& input': {
                  fontSize: '13px',
                  height: 'auto',
                  textAlign: 'center',
                },
                ...(inputSx || {}),
              }}
              onChange={(e) => {
                setNewItem(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (onAdd(newItem)) {
                    setNewItem('');
                    setShowAdd(false);
                  }
                }
              }}
            />
          </ClickAwayListener>
        )}
      </Stack>
      <Button
        disableRipple
        color="secondary"
        variant="text"
        startIcon={<Add />}
        sx={{
          fontSize: '14px',
          lineHeight: '17px',

          ...(buttonSx || {}),
        }}
        onClick={() => {
          setShowAdd(true);
          setTimeout(() => {
            inputRef?.current?.querySelector('input')?.focus();
          }, 10);
        }}
      >
        {addButtonLabel}
      </Button>
    </Box>
  );
}
