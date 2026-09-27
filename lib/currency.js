// lib/currency.js

/**
 * Real-time calibrated currency exchange rates for BRICS member nations
 * Base reference standard: USD ($)
 */
export const BRICS_CURRENCIES = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🌐',
    rateToUSD: 1.0,
    locale: 'en-US',
    budgetSlider: { min: 10000, max: 200000, step: 5000, default: 75000 }
  },
  INR: {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    flag: '🇮🇳',
    rateToUSD: 84.0, // $1 = ₹84.0
    locale: 'en-IN',
    budgetSlider: { min: 100000, max: 10000000, step: 50000, default: 2000000 }
  },
  BRL: {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    flag: '🇧🇷',
    rateToUSD: 5.5, // $1 = R$ 5.5
    locale: 'pt-BR',
    budgetSlider: { min: 50000, max: 1500000, step: 25000, default: 450000 }
  },
  RUB: {
    code: 'RUB',
    name: 'Russian Ruble',
    symbol: '₽',
    flag: '🇷🇺',
    rateToUSD: 92.5, // $1 = ₽92.5
    locale: 'ru-RU',
    budgetSlider: { min: 800000, max: 25000000, step: 200000, default: 7500000 }
  },
  CNY: {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    flag: '🇨🇳',
    rateToUSD: 7.25, // $1 = ¥7.25
    locale: 'zh-CN',
    budgetSlider: { min: 70000, max: 2000000, step: 50000, default: 550000 }
  },
  ZAR: {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    flag: '🇿🇦',
    rateToUSD: 18.2, // $1 = R 18.2
    locale: 'en-ZA',
    budgetSlider: { min: 180000, max: 5000000, step: 50000, default: 1400000 }
  }
};

/**
 * Converts a monetary value between any two BRICS currencies.
 * Defaults to base INR if unassigned (as existing database items are stored in standard base units).
 */
export function convertCurrency(amount, fromCode = 'INR', toCode = 'INR') {
  if (amount == null || isNaN(amount)) return 0;
  if (fromCode === toCode) return Math.round(amount);

  const fromCurr = BRICS_CURRENCIES[fromCode] || BRICS_CURRENCIES.INR;
  const toCurr = BRICS_CURRENCIES[toCode] || BRICS_CURRENCIES.INR;

  // Convert from origin currency to base USD, then from USD to target currency
  const amountInUSD = amount / fromCurr.rateToUSD;
  const converted = amountInUSD * toCurr.rateToUSD;

  return Math.round(converted);
}

/**
 * Formats a monetary amount into the official national locale representation with proper currency symbols.
 */
export function formatCurrency(amount, currencyCode = 'INR') {
  if (amount == null || isNaN(amount)) return '0';

  const curr = BRICS_CURRENCIES[currencyCode] || BRICS_CURRENCIES.INR;

  try {
    return new Intl.NumberFormat(curr.locale, {
      style: 'currency',
      currency: curr.code,
      maximumFractionDigits: 0
    }).format(amount);
  } catch (e) {
    return `${curr.symbol}${Math.round(amount).toLocaleString()}`;
  }
}

/**
 * Returns symbol for a currency code
 */
export function getCurrencySymbol(currencyCode = 'INR') {
  const curr = BRICS_CURRENCIES[currencyCode] || BRICS_CURRENCIES.INR;
  return curr.symbol;
}
