import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, IconButton, InputAdornment, Paper, TextField, styled, useTheme } from '@mui/material';

const StyledSelect = styled(Autocomplete)(({ theme }) => ({
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

  '& .MuiFormControl-root': {
    '& .MuiFormLabel-root': {
      bottom: '-1px',
      top: 'auto',
      fontWeight: '500',
      fontSize: '21px',
      lineHeight: '24px',
      margin: '0',
      color: `${theme.palette.text.primary}!important`,
      paddingLeft: '12px',
      pointerEvents: 'none',
    },
  },

  /* focus styles */
  '&:has(.MuiInputBase-input:focus)': {
    borderRadius: '25px',
    width: '475px',
    position: 'absolute',
    zIndex: '99',
    top: '8px',

    '& .MuiFormControl-root': {
      '& .MuiFormLabel-root': {
        display: 'none',
      },
    },
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

export default function StyledAutocomplete({ label, placeholder, ...props }) {
  const theme = useTheme();

  return (
    <StyledSelect
      blurOnSelect
      openOnFocus
      disableClearable
      disablePortal
      popupIcon={<KeyboardArrowDownIcon />}
      PaperComponent={({ children }) => (
        <Paper
          sx={{
            background: theme.palette.background.secondary,
            '& .MuiAutocomplete-listbox': {
              padding: 0,
            },

            '& .MuiAutocomplete-option': {
              color: theme.palette.text.primary,
              fontWeight: 600,
              lineHeight: '31px',
              fontSize: '15px',
              alignItems: 'center',
              justifyContent: 'space-between!important',
              flexDirection: 'row',
              padding: '0px 45px 0px 16px',
            },
          }}
        >
          {children}
        </Paper>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder={placeholder}
          label={label}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {params.InputProps.endAdornment}
                {!params.inputProps.value && (
                  <IconButton
                    size="small"
                    // eslint-disable-next-line max-len
                    className="custom-clear-button MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium MuiAutocomplete-clearIndicator"
                    // onClick={() => {
                    //   console.log('clicked');
                    // }}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      )}
      {...props}
    />
  );
}
