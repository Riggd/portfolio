import type { HTMLAttributes, ReactNode } from 'react';

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  /** Background tone. Use color.text.primary for text on subtle or tinted. */
  tone?: 'default' | 'subtle' | 'tinted';
  /** Inner padding, as a spacing token. */
  padding?: 'space.4' | 'space.5' | 'space.6';
  /** Grouped content. */
  children: ReactNode;
}

export type SurfaceTone = NonNullable<SurfaceProps['tone']>;
export type SurfacePadding = NonNullable<SurfaceProps['padding']>;

export function Surface({ tone = 'default', padding = 'space.5', className, children, ...rest }: SurfaceProps) {
  const classes = [
    'acme-surface',
    `acme-surface--${tone}`,
    `acme-surface--pad-${padding.replace('space.', '')}`,
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
