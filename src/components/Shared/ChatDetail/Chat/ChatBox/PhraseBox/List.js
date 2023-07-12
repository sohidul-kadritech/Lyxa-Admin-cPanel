import { Stack } from '@mui/material';
import StyledChip from '../../../../../Styled/StyledChips';

export default function PhraseList({ onSelect, selected, messages }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap="10px"
      flexWrap="wrap"
      borderBottom="1px solid #eee"
      pb="15px"
      pt="15px"
    >
      {messages?.map((msg) => (
        <StyledChip
          disableRipple
          className={selected?._id === msg?._id ? 'active-chip' : ''}
          key={msg?._id}
          label={msg?.message}
          onClick={() => onSelect(msg)}
          sx={{
            fontSize: '12px',
            lineHeight: '20px',
            padding: '6px 15px',
            cursor: 'pointer',
            border: '1px solid #eee',
            transition: 'all 200ms ease',

            '&:hover, &.active-chip': {
              background: 'transparent',
              borderColor: 'primary.main',
              color: 'primary.main',
            },
          }}
        />
      ))}
    </Stack>
  );
}
