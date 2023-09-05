export const calculateSecondaryCurrency = (baseCurrency, secondaryCurrency, value, exchangeRate, multiplyWith = 1) => {
  const isSecondaryCurrencyEnabled = Number(exchangeRate) > 0;
  const baseAmount = Number(value);
  const secondaryAmount = baseAmount * Number(exchangeRate);
  const resultendBaseAmount = Math.abs(baseAmount * multiplyWith || 0);
  let resultendSecondaryAmount = Math.round(secondaryAmount * multiplyWith);
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
