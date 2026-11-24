import type { HTMLAttributes, ReactNode } from 'react';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Message type. */
  intent: 'success' | 'warning' | 'danger';
  /** Optional heading. */
  title?: string;
  /** Message body. */
  children: ReactNode;
}

export type AlertIntent = AlertProps['intent'];

export function Alert({ intent, title, className, children, ...rest }: AlertProps) {
  const classes = ['acme-alert', `acme-alert--${intent}`, className].filter(Boolean).join(' ');
  return (
    <div role={intent === 'danger' ? 'alert' : 'status'} className={classes} {...rest}>
      {title ? <p className="acme-alert__title">{title}</p> : null}
      <div className="acme-alert__body">{children}</div>
    </div>
  );
}
