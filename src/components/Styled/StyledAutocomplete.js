import { Autocomplete, styled } from '@mui/material';

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  /* normal styles */

  '& .MuiAutocomplete-listbox': {
    maxHeight: '300px',
    background: theme.palette.background.secondary,
  },

  '& .MuiInputBase-root': {
    background: theme.palette.background.secondary,
    borderRadius: '40px',
    padding: '12px 40px 12px 8px !important',

    '& .MuiInputAdornment-positionStart': {
      width: '0px',
      height: '0px',
      visibility: 'hidden',
      opacity: '0',
    },

    '& .MuiAutocomplete-clearIndicator': {
      color: theme.palette.secondary.main,
    },
  },

  '& .MuiInputBase-input': {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '500',
    color: theme.palette.text.primary,
    padding: '0!important',
  },

  '& .MuiAutocomplete-popupIndicator:hover': {
    background: 'transparent',
  },

  '& .MuiAutocomplete-clearIndicator:hover': {
    background: 'none',
  },

  '& fieldset': {
    border: 'none',
  },

  '& .custom-clear-button': {
    visibility: 'hidden',
    opacity: '0',
    pointerEvents: 'none',

    '& .MuiSvgIcon-root': {
      width: '19px',
      height: '19px',
    },
  },

  /* focus styles */
  '&:has(.MuiInputBase-input:focus)': {
    borderRadius: '25px',
    width: '475px',
    position: 'absolute',
    zIndex: '99',
    top: '8px',
  },

  '& .MuiInputBase-root:has(.MuiInputBase-input:focus)': {
    padding: '13px 16px!important',
    paddingRight: '70px!important',
    position: 'relative',
    borderRadius: '40px 40px 0 0',

    '& .MuiInputAdornment-positionStart': {
      visibility: 'visible',
      opacity: '1',
      margin: '0',
      height: 'auto',
      width: 'auto',
      position: 'absolute',
      left: '26px',
      top: '22px',
    },

    '& .MuiAutocomplete-popupIndicator': {
      display: 'none!important',
    },

    '& .MuiAutocomplete-clearIndicator': {
      position: 'absolute',
      right: '15px',
      top: '0px',
      color: theme.palette.secondary.main,
      visibility: 'visible!important',
      pointerEvents: 'all',
    },

    '& .custom-clear-button': {
      visibility: 'visible',
      opacity: '1',
      pointerEvents: 'all',
      top: '18.5px',
      right: '24.5px',
    },
  },

  '& .MuiInputBase-input:focus': {
    background: '#fff',
    height: '40px',
    borderRadius: '40px',
    paddingLeft: '42px!important',
  },
}));

export default StyledAutocomplete;
