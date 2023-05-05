import { Box, Typography } from '@mui/material';
import { ShopAction } from '../ShopAction';

export function General({ title, isButton, buttonList, buttonType }) {
  console.log(buttonType);
  const boxSx = {
    padding: '32px 56px 21px 30px',
    width: '100%',
    color: '#000',
    backgroundColor: '#ffffff',
    borderRadius: '7px',
    marginBottom: '22px',
  };

  const btnSx = {
    margin: '22px 0px 0px 0px',
  };

  const typoSx = {
    fontSize: '16px',
    fontWeight: 600,
  };

  return (
    <Box sx={boxSx}>
      <Typography sx={typoSx}>{title}</Typography>
      {isButton && (
        <Box>
          {buttonType === 1 &&
            buttonList?.map((btn, i) => (
              <ShopAction
                key={i}
                title={btn.actionTitle}
                action={btn.action}
                isChecked={btn.isChecked}
                actionSx={btnSx}
              />
            ))}
        </Box>
      )}
    </Box>
  );
}
