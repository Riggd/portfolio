import type { HTMLAttributes, ReactNode } from 'react';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout direction. */
  direction?: 'row' | 'column';
  /** Space between children, as a spacing token. */
  gap?: 'space.1' | 'space.2' | 'space.3' | 'space.4' | 'space.5' | 'space.6' | 'space.7';
  /** Cross-axis alignment. */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Stacked children. */
  children: ReactNode;
}

export type StackDirection = NonNullable<StackProps['direction']>;
export type StackGap = NonNullable<StackProps['gap']>;
export type StackAlign = NonNullable<StackProps['align']>;

export function Stack({
  direction = 'column',
  gap = 'space.4',
  align = 'stretch',
  className,
  children,
  ...rest
}: StackProps) {
  const classes = [
    'acme-stack',
    `acme-stack--${direction}`,
    `acme-stack--gap-${gap.replace('space.', '')}`,
    `acme-stack--align-${align}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
