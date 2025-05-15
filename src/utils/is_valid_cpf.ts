const isValidCpf = (cpf: string): boolean => {
  // Reject repeated digits (e.g., 11111111111)
  const repeatedDigitsPattern = /^(\d)\1{10}$/;
  if (repeatedDigitsPattern.test(cpf)) {
    return false;
  }

  const getCheckDigit = (cpfSlice: string, factorStart: number): number => {
    const sum = cpfSlice.split('').reduce((acc, digit, index) => acc + parseInt(digit) * (factorStart - index), 0);

    const result = (sum * 10) % 11;
    return result === 10 ? 0 : result;
  };

  const firstCheckDigit = getCheckDigit(cpf.slice(0, 9), 10);
  if (firstCheckDigit !== parseInt(cpf[9])) {
    return false;
  }

  const secondCheckDigit = getCheckDigit(cpf.slice(0, 10), 11);
  if (secondCheckDigit !== parseInt(cpf[10])) {
    return false;
  }

  return true;
};

export { isValidCpf };
