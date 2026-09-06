/*
Output primitives: the big answer, the small answer, and the
verdict chip that tells you whether the answer is any good.
Grades come from ductMath as { level, message } objects, so
the styling stays in one place.
*/

export function Stat({ label, value, unit, tone = 'neutral', hint }) {
    return (
        <div className={`stat stat--${tone}`}>
            <p className="stat__label">{label}</p>
            <p className="stat__value">
                {value}
                {unit && <span className="stat__unit">{unit}</span>}
            </p>
            {hint && <p className="stat__hint">{hint}</p>}
        </div>
    );
}

export function StatRow({ children }) {
    return <div className="stat-row">{children}</div>;
}

export function Verdict({ grade, prefix }) {
    return (
        <p className={`verdict verdict--${grade.level}`}>
            {prefix && <strong>{prefix} </strong>}
            {grade.message}
        </p>
    );
}

export function Panel({ title, description, children, footnote }) {
    return (
        <section className="panel">
            <header className="panel__header">
                <h3>{title}</h3>
                {description && <p>{description}</p>}
            </header>
            {children}
            {footnote && <p className="panel__footnote">{footnote}</p>}
        </section>
    );
}
