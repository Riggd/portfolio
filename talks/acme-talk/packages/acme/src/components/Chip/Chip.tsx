import type { HTMLAttributes } from 'react';

export interface ChipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'onClick'> {
  /** Chip text. */
  label: string;
  /** Renders a remove button. Use for removable tags and multi-select values. */
  onRemove?: () => void;
  /** Selected state for filter chips. Setting it makes the chip a toggle button. */
  selected?: boolean;
  /** Called when a selectable chip is toggled. */
  onToggle?: (selected: boolean) => void;
}

export function Chip({ label, onRemove, selected, onToggle, className, ...rest }: ChipProps) {
  const selectable = selected !== undefined;
  const classes = ['acme-chip', selected ? 'acme-chip--selected' : null, className].filter(Boolean).join(' ');
  return (
    <span className={classes} {...rest}>
      {selectable ? (
        <button
          type="button"
          className="acme-chip__toggle"
          aria-pressed={selected}
          onClick={() => onToggle?.(!selected)}
        >
          {label}
        </button>
      ) : (
        <span className="acme-chip__label">{label}</span>
      )}
      {onRemove ? (
        <button type="button" className="acme-chip__remove" aria-label={`Remove ${label}`} onClick={onRemove}>
          ×
        </button>
      ) : null}
    </span>
  );
}
