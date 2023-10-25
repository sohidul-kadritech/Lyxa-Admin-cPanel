/* eslint-disable prettier/prettier */
import FormateBaseCurrency from '../../../components/Common/FormateBaseCurrency';
import FormatesecondaryCurrency from '../../../components/Common/FormatesecondaryCurrency';

export const calculateSecondaryCurrency = (value, exchangeRate, multiplyWith = 1) => {
  const isSecondaryCurrencyEnabled = Number(exchangeRate) > 0;
  const baseAmount = Number(value);
  const secondaryAmount = baseAmount * Number(exchangeRate);
  const resultendBaseAmount = Math.abs(baseAmount * multiplyWith || 0);
  let resultendSecondaryAmount = Math.round(secondaryAmount * multiplyWith);
  resultendSecondaryAmount = Math.abs(resultendSecondaryAmount);

  const withSecondaryCurrency = `${secondaryAmount < 0 ? '-' : ''}${FormatesecondaryCurrency.get(
    resultendSecondaryAmount,
  )} ~ ${value < 0 ? '-' : ''}${FormateBaseCurrency.get(resultendBaseAmount)}`;

  const withOutSecondaryCurrency = `${value < 0 ? '-' : ''}${FormateBaseCurrency.get(resultendBaseAmount)}`;

  const withOutbaseCurrency = `${secondaryAmount < 0 ? '-' : ''}${FormatesecondaryCurrency.get(
    resultendSecondaryAmount,
  )}`;

  const result = {
    enabled: isSecondaryCurrencyEnabled,
    secondaryAmount,
    baseAmount,
    withOutbaseCurrency,
    withOutSecondaryCurrency,
    withSecondaryCurrency,
    print: isSecondaryCurrencyEnabled ? withSecondaryCurrency : withOutSecondaryCurrency,
  };

  return result;
};
