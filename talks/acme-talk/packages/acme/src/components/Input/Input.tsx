import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visible label. Required: every Input has one. */
  label: string;
  /** Error message. Shown below the field in color.danger.fg and sets aria-invalid. */
  error?: string;
  /** Helper text shown below the field when there is no error. */
  hint?: string;
}

export function Input({ label, error, hint, id, className, ...rest }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;
  const classes = ['acme-input', error ? 'acme-input--error' : null, className].filter(Boolean).join(' ');
  return (
    <div className={classes}>
      <label className="acme-input__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className="acme-input__field"
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        {...rest}
      />
      {message ? (
        <p id={messageId} className={error ? 'acme-input__error' : 'acme-input__hint'}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
