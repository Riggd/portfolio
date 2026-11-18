import type { HTMLAttributes } from 'react';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Badge text, such as a count or a status label. Read-only. */
  label: string;
}

export function Badge({ label, className, ...rest }: BadgeProps) {
  const classes = ['acme-badge', className].filter(Boolean).join(' ');
  return (
    <span className={classes} {...rest}>
      {label}
    </span>
  );
}
