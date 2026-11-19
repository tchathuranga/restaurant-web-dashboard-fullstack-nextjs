interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

// Label + control + hint/error line, so every form looks and reads the same
const Field = ({ label, htmlFor, required, hint, error, children }: FieldProps) => (
  <div className="mb-5">
    <label className="block text-sm font-semibold text-ink mb-1.5" htmlFor={htmlFor}>
      {label}
      {required && <span className="text-red-600" aria-hidden> *</span>}
    </label>
    {children}
    {error ? (
      <p className="text-sm text-red-600 mt-1" role="alert">{error}</p>
    ) : hint ? (
      <p className="text-xs text-ink-muted mt-1">{hint}</p>
    ) : null}
  </div>
);

export default Field;
