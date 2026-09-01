export default function Modal({ children, open, className = '' }) {
  if (!open) return null;
  return (
    <div className="campaign-modal-backdrop">
      <div className={className} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}
