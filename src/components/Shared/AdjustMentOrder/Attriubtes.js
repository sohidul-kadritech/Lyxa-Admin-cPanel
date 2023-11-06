/* eslint-disable no-unused-vars */
import { Radio, Stack, Typography, useTheme } from '@mui/material';
import { ReactComponent as CheckedIcon } from '../../../assets/icons/checked-icon.svg';
import { ReactComponent as UncheckIcon } from '../../../assets/icons/uncheck-icon.svg';
import FormateBaseCurrency from '../../Common/FormateBaseCurrency';
import StyledCheckbox from '../../Styled/StyledCheckbox';

export function Attributes({ attribute, onClickProduct, selectedAttributes }) {
  const theme = useTheme();

  const attributeItems = selectedAttributes?.find((atr) => atr?._id === attribute?._id)?.selectedItems;

  return (
    <Stack>
      <Stack direction="row" alignItems="center" gap={2}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, fontSize: '14px', fontStyle: 'italic', color: 'text.secondary2' }}
        >
          {attribute?.name}
        </Typography>
        {attribute?.required && (
          <Typography
            variant="body"
            sx={{
              fontWeight: 600,
              fontSize: '10px',
              fontStyle: 'italic',
              color: theme?.palette?.primary?.contrastText,
              background: theme?.palette?.text?.primary,
              padding: '2px 4px',
              borderRadius: '7px',
            }}
          >
            Required
          </Typography>
        )}
        {attribute?.select === 'multiple' && (
          <Typography
            variant="body"
            sx={{
              fontWeight: 600,
              fontSize: '10px',
              fontStyle: 'italic',
              color: theme?.palette?.primary?.contrastText,
              background: theme?.palette?.text?.primary,
              padding: '2px 4px',
              borderRadius: '7px',
            }}
          >
            Multiple
          </Typography>
        )}
      </Stack>

      <Stack
        sx={{
          background: '#fff',
          borderRadius: '10px',
          padding: '8px 0px',
        }}
      >
        {attribute?.items?.map((item, i) => (
          <Stack
            direction="row"
            alignItems="center"
            onClick={() => {
              if (onClickProduct)
                onClickProduct({
                  isMultiple: attribute?.select === 'multiple',
                  attribute: { ...attribute, selectedItems: [item] },
                });
            }}
            key={i}
            sx={{
              transition: 'all 0.3s linear',
              paddingLeft: '8px',
              // backgroundColor: attributeItems?.find((atrItm) => atrItm?._id === item?._id)
              //   ? 'rgba(177, 177, 177, 0.2)'
              //   : 'transparent',
              // '&:hover': {
              //   backgroundColor: 'rgba(177, 177, 177, 0.4)',
              // },
            }}
          >
            {attribute?.select !== 'multiple' ? (
              <Radio
                color="primary"
                size="small"
                checked={!!attributeItems?.find((atrItm) => atrItm?._id === item?._id)}
                sx={{
                  '&.MuiRadio-root': {
                    width: '30px',
                    height: '31px',
                  },
                }}
              />
            ) : (
              <StyledCheckbox
                size="small"
                checkedIcon={<CheckedIcon />}
                icon={<UncheckIcon />}
                checked={!!attributeItems?.find((atrItm) => atrItm?._id === item?._id)}
                sx={{
                  padding: '3px 8px',
                  borderRadius: '7px',
                  color: 'primary.main',
                  width: '30px',
                  // ...(checkBoxSx || {}),
                }}
              />
            )}

            <Typography
              variant="h6"
              key={i}
              sx={{
                fontWeight: 500,
                fontSize: '14px',
                color: 'text.secondary2',
              }}
            >
              {item?.name}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                fontSize: '14px',
                color: 'text.secondary2',

                paddingLeft: '16px',
                fontStyle: 'italic',
              }}
            >
              {FormateBaseCurrency.get(item?.extraPrice)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
