import { Box, Checkbox, Stack, Typography, useTheme } from '@mui/material';
import ImagePreview from '../Common/ImagePreview';
import LoadingOverlay from '../Common/LoadingOverlay';
import FilterSelect from '../Filter/FilterSelect';
import OptionsSelect from '../Filter/OptionsSelect';
import StyledAutocomplete from '../Styled/StyledAutocomplete';
import StyledCheckboxList from '../Styled/StyledCheckBoxList';
import StyledChip from '../Styled/StyledChips';
import StyledFileDropzone from '../Styled/StyledFileDropzone';
import StyledInput from '../Styled/StyledInput';

export default function StyledFormField({ containerProps, label, labelProps, intputType, inputProps }) {
  const theme = useTheme();

  return (
    <Stack gap={2} {...(containerProps || {})}>
      {label && (
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
      )}

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

      {/* textarea */}
      {intputType === 'textarea' && (
        <StyledInput
          {...(inputProps || {})}
          sx={{
            height: '100px',

            '& .MuiInputBase-root': {
              height: '100%',
              paddingLeft: '18px',
              paddingRight: '18px',
            },

            '& textarea': {
              height: '100% !important',
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
          <Box>
            <StyledFileDropzone {...(inputProps || {})} />
            {inputProps.helperText1 && (
              <Typography pt={2} variant="body3" display="block">
                {inputProps.helperText1}
              </Typography>
            )}
            {inputProps.helperText2 && <Typography variant="body3">{inputProps.helperText2}</Typography>}
          </Box>
          {inputProps.files?.length > 0 && <ImagePreview files={inputProps.files} />}
          {inputProps.disabled && <LoadingOverlay />}
        </Stack>
      )}

      {/* select */}
      {intputType === 'select' && <FilterSelect {...(inputProps || {})} />}

      {/* autocomplete */}
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
            disableCloseOnSelect={inputProps.multiple}
            blurOnSelect={!inputProps.multiple}
            {...(inputProps || {})}
            sx={{
              '&:has(.MuiInputBase-input:focus)': {
                width: '370px',
                top: 0,
              },
              ...(inputProps.sx || {}),
            }}
            readOnly={inputProps.readOnly}
          />
          {/* tags */}
          {inputProps.multiple &&
            inputProps.value.map((item, index) => {
              if (inputProps.renderTags) {
                return inputProps.renderTags(item, index);
              }
              return (
                <StyledChip
                  key={inputProps.getTagKey?.(item) || item?._id}
                  label={inputProps?.getOptionLabel(item) || item?.name}
                  size="lg"
                  onDelete={() => {
                    inputProps.onChange(
                      undefined,
                      inputProps.value.filter((dItem, dIndex) => index !== dIndex)
                    );
                  }}
                />
              );
            })}
        </Stack>
      )}

      {/* options select */}
      {intputType === 'optionsSelect' && <OptionsSelect {...(inputProps || {})} />}

      {/* options select */}
      {intputType === 'checkbox' && <StyledCheckboxList {...(inputProps || {})} />}
    </Stack>
  );
}
