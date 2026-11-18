import type { HTMLAttributes, ReactNode } from 'react';
import { Surface } from '../Surface';

/**
 * @deprecated Since 0.1.0. Use `Surface` instead. Card will be removed in 1.0.0.
 */
export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Optional heading. */
  title?: string;
  /** Card content. */
  children: ReactNode;
}

/**
 * @deprecated Since 0.1.0. Use `Surface` instead. Card will be removed in 1.0.0.
 */
export function Card({ title, className, children, ...rest }: CardProps) {
  const classes = ['acme-card', className].filter(Boolean).join(' ');
  return (
    <Surface className={classes} {...rest}>
      {title ? <p className="acme-card__title">{title}</p> : null}
      {children}
    </Surface>
  );
}
