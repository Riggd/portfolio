/*
Renders the lesson block list from data/lessons.js.

One block type, one small function, one entry in the RENDERERS
map. Adding a block type is a three-line change and no lesson
ever contains raw HTML.
*/

/* The only inline markup is **bold**. Splitting on a capture group
   gives alternating plain/bold chunks, so odd indexes are bold. */
function Inline({ text }) {
    return text.split(/\*\*(.+?)\*\*/g).map((chunk, index) => (index % 2 === 1 ? <strong key={index}>{chunk}</strong> : chunk));
}

const CALLOUT_LABELS = {
    secret: 'Expert secret',
    warn: 'Watch out',
    tip: 'Pro tip',
};

function Callout({ kind, title, body }) {
    return (
        <aside className={`callout callout--${kind}`}>
            <p className="callout__kind">{CALLOUT_LABELS[kind]}</p>
            <p className="callout__title">{title}</p>
            <p className="callout__body">
                <Inline text={body} />
            </p>
        </aside>
    );
}

function Formula({ expression, legend }) {
    return (
        <div className="formula">
            <p className="formula__expression">{expression}</p>
            <ul className="formula__legend">
                {legend.map((line) => (
                    <li key={line}>
                        <Inline text={line} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Table({ head, rows }) {
    return (
        <div className="table-scroll">
            <table>
                <thead>
                    <tr>
                        {head.map((cell) => (
                            <th key={cell}>{cell}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.join('|')}>
                            {row.map((cell, index) => (
                                <td key={index}>
                                    <Inline text={cell} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const RENDERERS = {
    h: (value) => <h3 className="prose__heading">{value}</h3>,
    p: (value) => (
        <p>
            <Inline text={value} />
        </p>
    ),
    list: (value) => (
        <ul className="prose__list">
            {value.map((item) => (
                <li key={item}>
                    <Inline text={item} />
                </li>
            ))}
        </ul>
    ),
    steps: (value) => (
        <ol className="prose__steps">
            {value.map((item) => (
                <li key={item}>
                    <Inline text={item} />
                </li>
            ))}
        </ol>
    ),
    note: (value) => <Callout {...value} />,
    formula: (value) => <Formula {...value} />,
    table: (value) => <Table {...value} />,
};

export function Prose({ blocks }) {
    return (
        <div className="prose">
            {blocks.map((block, index) => {
                const [type, value] = Object.entries(block)[0];
                const render = RENDERERS[type];
                return render ? <div key={index}>{render(value)}</div> : null;
            })}
        </div>
    );
}

export { Inline };
