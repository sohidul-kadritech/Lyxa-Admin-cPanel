import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Stack } from '@mui/material';
import { mockPhrases } from '../../../../pages/OngoingTickets/mock';
import StyledChip from '../../../Styled/StyledChips';

export function PhraseBox({ open, setOpen }) {
  return (
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
      <Box position="relative">
        <Stack justifyContent="flex-end" direction="row">
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
        </Stack>
        <Box
          className={open ? 'open' : ''}
          // pl={3}
          // pr={3}
          sx={{
            position: 'absolute',
            width: '100%',
            top: '40px',
            left: 0,
            transform: 'translateX(-30px)',
            opacity: 0,
            pointerEvents: 'none',
            visibility: 'hidden',
            transition: 'all 200ms ease-in-out',

            '&.open': {
              transform: 'translateX(0)',
              opacity: 1,
              pointerEvents: 'all',
              visibility: 'visible',
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap="10px"
            flexWrap="wrap"
            sx={{
              padding: '20px',
              border: '1px solid',
              borderColor: 'custom.border',
              borderRadius: '8px',
              background: '#ebebeb',
            }}
          >
            {mockPhrases?.map((p) => (
              <StyledChip
                label={p}
                sx={{
                  fontSize: '12px',
                  lineHeight: '20px',
                  padding: '6px 15px',
                  cursor: 'pointer',

                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: '#fff',
                  },
                }}
              />
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
