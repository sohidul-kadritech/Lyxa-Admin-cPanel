import { Checkbox, Stack, Typography, useTheme } from '@mui/material';
import ImagePreview from '../Common/ImagePreview';
import LoadingOverlay from '../Common/LoadingOverlay';
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
      {intputType === 'file' && (
        <Stack gap="30px" position="relative">
          <StyledFileDropzone {...(inputProps || {})} />
          {inputProps.files?.length > 0 && <ImagePreview files={inputProps.files} />}
          {inputProps.disabled && <LoadingOverlay />}
        </Stack>
      )}

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
          minHeight="48px"
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
                  {inputProps.multiple && <Checkbox color="secondary" checked={selected} />}
                  <span>{props.key}</span>
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
                return inputProps.renderTags(item, index);
              }
              return (
                <StyledChip
                  key={item?._id}
                  label={inputProps.getOptionLabel(item) || item?.name}
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
