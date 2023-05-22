import { Stack, Typography, styled } from '@mui/material';
import { useState } from 'react';
import StyledSwitch from '../../Styled/StyledSwitch';

const StyledContainer = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.secondary,
  padding: '17px 20px',
  borderRadius: '25px',
}));

export default function OpenDays({ days = [] }) {
  const [render, setRender] = useState(false);

  return (
    <StyledContainer gap={6}>
      {days?.map((day) => (
        <Stack key={day?.day} direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body1">{day?.day}</Typography>
          <StyledSwitch
            checked={day?.isActive}
            onChange={() => {
              day.isActive = !day.isActive;
              setRender(!render);
            }}
          />
        </Stack>
      ))}
    </StyledContainer>
  );
}
