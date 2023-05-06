import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, styled, TextField, Tooltip } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';

const StyledInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    padding: '12px 15px 12px 22px',
    maxWidth: '190px',
    borderRadius: '45px',
    background: theme.palette.background.secondary,

    '&:hover': {
      background: theme.palette.background.secondaryHover,
    },
  },

  '& .MuiInputBase-input': {
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '24px',
    padding: '0',
  },

  '& .MuiInputBase-root': {
    '& .MuiButtonBase-root': {
      padding: '0px',
      margin: '0px',

      '&:hover': {
        background: 'transparent',
      },
    },
  },

  fieldSet: {
    border: '0',
  },
}));

const variants = {
  form: {
    root: {
      '& .MuiOutlinedInput-root': {
        padding: '12px 10px 12px 18px',
        maxWidth: 'initial',
      },

      '& .MuiInputBase-input': {
        fontSize: '15px',
        fontWeight: 500,
        lineHeight: '20px',
      },
    },
  },
};

const sizes = {
  md: {
    root: {
      '& .MuiInputBase-input': {
        fontSize: '12px',
        lineHeight: '20px',
      },
    },
  },
  sm: {
    root: {
      '.MuiInputBase-root': {
        paddingTop: '7.5px',
        paddingBottom: '7.5px',
        paddingLeft: '15px',
        paddingRight: '12px',
      },
      '& .MuiInputBase-input': {
        fontSize: '12px',
        lineHeight: '20px',
      },
    },
  },
};

function Wrapper({ tooltip, children }) {
  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        <Box>{children}</Box>
      </Tooltip>
    );
  }

  return children;
}

export default function FilterDate({ value, onChange, size, variant, sx, tooltip, fullWidth, ...props }) {
  return (
    <Wrapper tooltip={tooltip}>
      <DesktopDatePicker
        value={value}
        onChange={onChange}
        components={{
          OpenPickerIcon: ExpandMoreIcon,
        }}
        renderInput={(params) => (
          <StyledInput
            fullWidth={fullWidth}
            sx={{
              ...(variants[variant]?.root || {}),
              ...(sizes[size]?.root || {}),
              ...(sx || {}),
            }}
            {...params}
          />
        )}
        {...props}
      />
    </Wrapper>
  );
}
