import { Box, Typography } from '@mui/material';
import { ShopAction } from '../ShopAction';

export function General({ title, isButton, buttonList, buttonType }) {
  console.log(buttonType);
  const generalSx = {
    padding: '32px 56px 21px 30px',
    width: '100%',
    color: '#000',
    backgroundColor: '#ffffff',
    borderRadius: '7px',
    marginBottom: '22px',
  };

  const ActionSx = {
    margin: '22px 0px 0px 0px',
  };

  const TypoSx = {
    fontSize: '16px',
    fontWeight: 600,
  };

  return (
    <Box sx={generalSx}>
      <Typography sx={TypoSx}>{title}</Typography>
      {isButton && (
        <Box>
          {buttonType === 1 &&
            buttonList?.map((btn, i) => (
              <ShopAction
                key={i}
                title={btn.actionTitle}
                action={btn.action}
                isChecked={btn.isChecked}
                actionSx={ActionSx}
              />
            ))}
        </Box>
      )}
    </Box>
  );
}
