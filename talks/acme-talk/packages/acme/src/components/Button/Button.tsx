import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual emphasis of the button. */
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  /** Button size. */
  size?: 'sm' | 'md';
  /** Button label. */
  children: ReactNode;
}

export type ButtonVariant = NonNullable<ButtonProps['variant']>;
export type ButtonSize = NonNullable<ButtonProps['size']>;

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = ['acme-button', `acme-button--${variant}`, `acme-button--${size}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
