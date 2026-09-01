export function noop() {}

export function classNames(...values) {
  return values.filter(Boolean).join(' ');
}

export function isProfileMissing(error) {
  if (!error) return false;
  const status = error.response?.status;
  const msg = error.response?.data?.message || '';
  return status === 404 || msg.toLowerCase().includes('profile not found') || msg.toLowerCase().includes('not found');
}
