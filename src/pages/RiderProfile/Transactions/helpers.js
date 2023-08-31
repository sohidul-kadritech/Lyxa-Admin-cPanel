export const calculateSecondaryCurrency = (baseCurrency, secondaryCurrency, value, exchangeRate) => {
  const isSecondaryCurrencyEnabled = Number(exchangeRate) > 0;
  const baseAmount = Number(value);
  const secondaryAmount = baseAmount * Number(exchangeRate);
  const resultendBaseAmount = Math.abs(baseAmount || 0);
  let resultendSecondaryAmount = Math.round(secondaryAmount);
  resultendSecondaryAmount = Math.abs(resultendSecondaryAmount);

  const withSecondaryCurrency = `${secondaryAmount < 0 ? '-' : ''} ${
    secondaryCurrency?.code
  } ${resultendSecondaryAmount} ~ ${value < 0 ? '-' : ''} ${baseCurrency?.symbol} ${resultendBaseAmount.toFixed(2)}`;

  const withOutSecondaryCurrency = `${value < 0 ? '-' : ''} ${baseCurrency?.symbol} ${resultendBaseAmount.toFixed(2)}`;

  const withOutbaseCurrency = `${secondaryAmount < 0 ? '-' : ''} ${
    secondaryCurrency?.code
  } ${resultendSecondaryAmount}`;

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
