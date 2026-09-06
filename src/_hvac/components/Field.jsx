/*
Form primitives. Every calculator input in the app is one of
these three, which keeps labels, hints, and spacing identical
everywhere without a CSS framework.
*/

import { useId } from 'react';

export function NumberField({ label, value, onChange, hint, suffix, step = 1, min = 0, max }) {
    const id = useId();

    return (
        <label className="field" htmlFor={id}>
            <span className="field__label">{label}</span>
            <span className="field__control">
                <input
                    id={id}
                    type="number"
                    value={value}
                    step={step}
                    min={min}
                    max={max}
                    onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))}
                />
                {suffix && <span className="field__suffix">{suffix}</span>}
            </span>
            {hint && <span className="field__hint">{hint}</span>}
        </label>
    );
}

export function SelectField({ label, value, onChange, options, hint }) {
    const id = useId();

    return (
        <label className="field" htmlFor={id}>
            <span className="field__label">{label}</span>
            <span className="field__control">
                <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </span>
            {hint && <span className="field__hint">{hint}</span>}
        </label>
    );
}

export function TextField({ label, value, onChange, hint }) {
    const id = useId();

    return (
        <label className="field" htmlFor={id}>
            <span className="field__label">{label}</span>
            <span className="field__control">
                <input id={id} type="text" value={value} onChange={(event) => onChange(event.target.value)} />
            </span>
            {hint && <span className="field__hint">{hint}</span>}
        </label>
    );
}

export function Fields({ children, columns = 2 }) {
    return (
        <div className="fields" data-columns={columns}>
            {children}
        </div>
    );
}
