export default function FormField({ children, label }) {
  return (
    <label>
      {label}
      {children}
    </label>
  );
}
