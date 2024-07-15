type Suffix = 'K' | 'M' | 'B' | 'T';

const suffixValues: Record<Suffix, number> = {
  K: 1000,
  M: 1000000,
  B: 1000000000,
  T: 1000000000000,
};

const formatLargeNumber = (number: number, withDollarSign: boolean): string => {
  if (number < 0) {
    return '-' + formatLargeNumber(-number, withDollarSign);
  }

  const suffix = Object.entries(suffixValues).find(([suffix, value]) => number >= value)?.[0] as Suffix | undefined;

  if (suffix) {
    const formatted = (number / suffixValues[suffix]).toFixed(1);
    return `${withDollarSign ? '$' : ''}${formatted}${suffix}`;
  }

  return `${withDollarSign ? '$' : ''}${number}`;
};

export const formatLargeMonetaryNumber = (number: number): string => formatLargeNumber(number, true);
export const formatLargeNonMonetaryNumber = (number: number): string => formatLargeNumber(number, false);

export const formatRatio = (ratio: number): string => {
  return (Math.round(ratio * 100) / 100).toFixed(2);
};