class FormateBaseCurrency {
  initialize = async (currency) => {
    try {
      this.value = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
      });
    } catch (error) {
      console.log('There is an error', error);
    }
  };

  get(number) {
    return this.value.format(number);
  }
}
export default new FormateBaseCurrency();
