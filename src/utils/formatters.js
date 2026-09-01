export function formatDate(value, locale = 'en-IN') {
  if (!value) return '';
  return new Intl.DateTimeFormat(locale).format(new Date(value));
}

export function formatCurrency(value, locale = 'en-IN', currency = 'INR') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value || 0);
}
