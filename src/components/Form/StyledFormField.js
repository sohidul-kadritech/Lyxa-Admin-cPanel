import { Checkbox, Stack, Typography, useTheme } from '@mui/material';
import FilterSelect from '../Filter/FilterSelect';
import StyledAutocomplete from '../Styled/StyledAutocomplete';
import StyledChip from '../Styled/StyledChips';
import StyledFileDropzone from '../Styled/StyledFileDropzone';
import StyledInput from '../Styled/StyledInput';

export default function StyledFormField({ containerProps, label, labelProps, intputType, inputProps }) {
  const theme = useTheme();

  return (
    <Stack gap={2} {...(containerProps || {})}>
      <Typography
        variant="h5"
        {...(labelProps || {})}
        sx={{
          fontWeight: '600',
          fontSize: '15px',
          lineHeight: '18px',
          ...(labelProps?.sx || {}),
        }}
      >
        {label}
      </Typography>

      {/* text field */}
      {intputType === 'text' && (
        <StyledInput
          {...(inputProps || {})}
          sx={{
            '& input': {
              paddingLeft: '18px',
              paddingRight: '18px',
              fontWeight: '500',
              fontSize: '15px',
              color: theme.palette.text.primary,
              ...(inputProps?.sx || {}),
            },
          }}
        />
      )}
      {/* file dropzone */}
      {intputType === 'file' && <StyledFileDropzone {...(inputProps || {})} />}

      {/* select */}
      {intputType === 'select' && <FilterSelect {...(inputProps || {})} />}

      {/* autocompltet */}
      {intputType === 'autocomplete' && (
        <Stack
          position="relative"
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          gap="16px"
          flexWrap="wrap"
        >
          <StyledAutocomplete
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {inputProps.multiple && <Checkbox checked={selected} />}
                  <span>{option?.name}</span>
                </div>
              </li>
            )}
            {...(inputProps || {})}
            sx={{
              '&:has(.MuiInputBase-input:focus)': {
                width: '370px',
                top: 0,
              },
              ...(inputProps.sx || {}),
            }}
          />
          {/* tags */}
          {inputProps.multiple &&
            inputProps.value.map((item, index) => {
              if (inputProps.renderTags) {
                return inputProps.renderTags(item);
              }
              return (
                <StyledChip
                  key={item?._id}
                  label={item?.name}
                  size="lg"
                  onDelete={() => {
                    inputProps.onChange(
                      undefined,
                      inputProps.value.filter((oItem, oIndex) => index !== oIndex)
                    );
                  }}
                />
              );
            })}
        </Stack>
      )}
    </Stack>
  );
}
