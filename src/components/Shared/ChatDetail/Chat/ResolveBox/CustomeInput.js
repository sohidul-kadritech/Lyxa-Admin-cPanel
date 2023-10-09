import React from 'react';
import StyledSearchBar from '../../../../Styled/StyledSearchBar';

function CustomeInput({ onChange, placeholder = 'Search', ...props }) {
  return (
    <StyledSearchBar
      onChange={(e) => {
        onChange(e.target.value);
      }}
      fullWidth
      placeholder={placeholder}
      {...props}
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
        ...(props?.sx || {}),
      }}
    />
  );
}

export default CustomeInput;
