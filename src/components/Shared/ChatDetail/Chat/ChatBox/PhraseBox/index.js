import { ExpandMore } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, ClickAwayListener, Stack, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import * as Api from '../../../../../../network/Api';
import AXIOS from '../../../../../../network/axios';
import StyledSearchBar from '../../../../../Styled/StyledSearchBar';
import PhraseList from './List';

const PhraseBoxContainer = styled(Box)(() => ({
  position: 'absolute',
  top: '0px',
  left: 0,
  width: 'auto',
  transition: 'all 200ms ease-in-out',
  borderRadius: '30px',
  background: '#F6F8FA',

  '&.open': {
    width: '100%',
  },
}));

export function PhraseBox({ open, setOpen, onAdd = () => {} }) {
  const [selected, setSelected] = useState({});
  const [messages, setMessages] = useState([]);

  const query = useQuery([Api.GET_DEFAULT_CHAT], () => AXIOS.get(Api.GET_DEFAULT_CHAT), {
    onSuccess: (data) => setMessages(data?.data?.messages),
  });

  const onSearch = (key) => {
    const data = query?.data?.data?.messages;
    const result = data?.filter((item) => item?.message?.toLowerCase()?.includes(key?.toLowerCase()));
    setMessages(result);
  };

  useEffect(() => {
    setSelected({});
    setMessages(query?.data?.data?.messages);
  }, [open]);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box
        sx={{
          paddingTop: '15px',
          paddingBottom: '5px',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          background: '#fff',
        }}
      >
        <Box position="relative" height="36px">
          <PhraseBoxContainer className={open ? 'open' : ''}>
            {!open && (
              <Button
                disableRipple
                startIcon={<SearchIcon />}
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
                Add
              </Button>
            )}
            {open && (
              <Box padding="5px 15px 20px">
                <Stack direction="row" alignItems="center">
                  <StyledSearchBar
                    onChange={(e) => {
                      onSearch(e.target.value);
                    }}
                    fullWidth
                    placeholder="Search"
                    sx={{
                      flex: 1,
                      padding: '9px 0',
                      border: 'none',
                      borderBottom: '1px solid #eee',
                      borderRadius: 0,
                      background: 'transparent',

                      '& .MuiInputAdornment-positionStart svg': {
                        color: '#363636',
                      },

                      '& .MuiInputBase-input': {
                        color: '#363636',
                        fontSize: '12px',

                        '&::placeholder': {
                          color: '#363636!important',
                        },
                      },
                    }}
                  />
                  <span style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>
                    <ExpandMore />
                  </span>
                </Stack>
                <PhraseList onSelect={(msg) => setSelected(msg)} selected={selected} messages={messages} />
                <Stack direction="row" alignItems="center" justifyContent="flex-end" pt={4}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ minWidth: '100px' }}
                    disabled={!selected._id}
                    onClick={() => {
                      onAdd(selected);
                    }}
                  >
                    Add
                  </Button>
                </Stack>
              </Box>
            )}
          </PhraseBoxContainer>
        </Box>
      </Box>
    </ClickAwayListener>
  );
}
