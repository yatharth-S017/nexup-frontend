export default function Loader({ label = 'Loading' }) {
  return <span aria-live="polite">{label}</span>;
}
