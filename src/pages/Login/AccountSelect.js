import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MenuItem, Select, Stack, styled } from '@mui/material';
import { ReactComponent as AvatarIcon } from '../../assets/icons/login-user.svg';

const StyledSelect = styled(Select)(() => ({
  '& .MuiOutlinedInput-input': {
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#fff',
  },

  '& .MuiSelect-select': {
    padding: 0,
  },

  '& .MuiSvgIcon-root': {
    color: '#fff',
  },

  '& fieldset': {
    border: '0!important',
    outline: '0!important',
  },
}));

export default function AccountSelect({ options, value, onChange, placeholder }) {
  return (
    <Stack alignItems="center" gap={1.5} direction="row">
      <AvatarIcon />
      <StyledSelect
        value={value}
        onChange={onChange}
        displayEmpty
        IconComponent={ExpandMoreIcon}
        renderValue={(value) => {
          if (!value) {
            return <span>{placeholder}</span>;
          }

          return options.find((option) => option.value === value)?.label;
        }}
        MenuProps={{
          sx: {
            marginTop: '5px',
          },
        }}
      >
        {options?.map((option) => (
          <MenuItem
            value={option.value}
            key={option.value}
            sx={{
              fontWeight: 500,
              padding: '9px 17px',
              fontSize: '14px!important',
              lineHeight: '20px!important',
              borderBottom: '1px solid #EEEEEE',
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </StyledSelect>
    </Stack>
  );
}
