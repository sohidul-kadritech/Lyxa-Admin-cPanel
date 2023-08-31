import { Box } from '@mui/material';
import React from 'react';
import { decrementByFiveHandler, incrementByFiveHandler } from '../helpers';
import AppCurrency from './Currency/AppCurrency';
import ExchangeRate from './Currency/ExchangeRate';

function SettingsForCurrency({
  newAppSettings,
  setNewAppSettings,
  setHasChanged,
  isUsedSecondaryCurrency,
  setIsUsedSecondaryCurrency,
  disableCurrency,
}) {
  return (
    <Box>
      <AppCurrency
        disableCurrency={disableCurrency}
        newAppSettings={newAppSettings}
        setNewAppSettings={setNewAppSettings}
        setHasChanged={setHasChanged}
        isUsedSecondaryCurrency={isUsedSecondaryCurrency}
        setIsUsedSecondaryCurrency={setIsUsedSecondaryCurrency}
      />
      {isUsedSecondaryCurrency !== 'disable' && (
        <ExchangeRate
          newAppSettings={newAppSettings}
          setNewAppSettings={setNewAppSettings}
          setHasChanged={setHasChanged}
          isUsedSecondaryCurrency={isUsedSecondaryCurrency}
          action={{ incrementHandler: incrementByFiveHandler, decrementHandler: decrementByFiveHandler }}
        />
      )}
    </Box>
  );
}

export default SettingsForCurrency;
