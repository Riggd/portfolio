import { useMemo } from 'react';

import { LESSONS } from './data/lessons.js';
import { DEFAULT_SYSTEM, derive } from './lib/derive.js';
import { useHashRoute } from './hooks/useHashRoute.js';
import { usePersistentState } from './hooks/usePersistentState.js';

import { Prose } from './components/Prose.jsx';
import { AirflowPlanner } from './calculators/AirflowPlanner.jsx';
import { DuctSizer } from './calculators/DuctSizer.jsx';
import { EffectiveLength } from './calculators/EffectiveLength.jsx';
import { PressureBudget } from './calculators/PressureBudget.jsx';
import { ReturnSizer } from './calculators/ReturnSizer.jsx';
import { Quiz } from './views/Quiz.jsx';
import { Secrets } from './views/Secrets.jsx';

/*
The shell: navigation, the persistent worksheet strip, and one
view at a time. Lessons come from data, calculators come from
this registry, and the two reference views are appended at the
end — so there is exactly one list of views in the app.
*/

const CALCULATORS = { AirflowPlanner, PressureBudget, EffectiveLength, DuctSizer, ReturnSizer };

const REFERENCE_VIEWS = [
    {
        id: 'secrets',
        nav: 'Expert secrets',
        title: 'Everything the pros know and rarely say',
        subtitle: 'The full cheat sheet, grouped so you can find it fast with one hand.',
        view: Secrets,
    },
    {
        id: 'quiz',
        nav: 'Check yourself',
        title: 'Ten questions',
        subtitle: 'Each one targets a mistake that shows up in real installs. Wrong answers teach more than right ones.',
        view: Quiz,
    },
];

const VIEWS = [...LESSONS, ...REFERENCE_VIEWS];
const findView = (id) => VIEWS.find((view) => view.id === id) ?? VIEWS[0];

function WorksheetStrip({ derived, onReset }) {
    const items = [
        { label: 'Airflow', value: `${derived.totalCfm.toLocaleString()} CFM` },
        { label: 'Available pressure', value: `${derived.available.toFixed(2)} in.wc` },
        { label: 'Effective length', value: `${derived.tel.total} ft` },
        { label: 'Friction rate', value: derived.rate.toFixed(3) },
    ];

    return (
        <div className={`worksheet worksheet--${derived.rateGrade.level}`}>
            <p className="worksheet__title">Your worksheet</p>
            <dl>
                {items.map((item) => (
                    <div key={item.label}>
                        <dt>{item.label}</dt>
                        <dd>{item.value}</dd>
                    </div>
                ))}
            </dl>
            <button type="button" className="button button--quiet" onClick={onReset}>
                Reset
            </button>
        </div>
    );
}

function Nav({ current, navigate }) {
    const groups = [
        { title: 'Orientation', ids: ['start', 'basics'] },
        { title: 'The eight steps', ids: LESSONS.filter((lesson) => lesson.step > 0).map((lesson) => lesson.id) },
        { title: 'Reference', ids: REFERENCE_VIEWS.map((view) => view.id) },
    ];

    return (
        <nav className="nav" aria-label="Lessons">
            {groups.map((group) => (
                <div key={group.title} className="nav__group">
                    <p className="nav__title">{group.title}</p>
                    <ul>
                        {group.ids.map((id) => {
                            const view = findView(id);
                            return (
                                <li key={id}>
                                    <button
                                        type="button"
                                        className={id === current ? 'nav__link nav__link--active' : 'nav__link'}
                                        aria-current={id === current ? 'page' : undefined}
                                        onClick={() => navigate(id)}
                                    >
                                        {view.nav}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}

function Pager({ current, navigate }) {
    const index = VIEWS.findIndex((view) => view.id === current);
    const previous = VIEWS[index - 1];
    const next = VIEWS[index + 1];

    return (
        <div className="pager">
            {previous ? (
                <button type="button" className="button button--quiet" onClick={() => navigate(previous.id)}>
                    ← {previous.nav}
                </button>
            ) : (
                <span />
            )}
            {next && (
                <button type="button" className="button" onClick={() => navigate(next.id)}>
                    {next.nav} →
                </button>
            )}
        </div>
    );
}

export default function App() {
    const [route, navigate] = useHashRoute('start');
    const [system, setSystem, resetSystem] = usePersistentState('hvac-worksheet', DEFAULT_SYSTEM);

    const derived = useMemo(() => derive(system), [system]);
    const update = (patch) => setSystem((current) => ({ ...current, ...patch }));

    const view = findView(route);
    const Calculator = view.calculator ? CALCULATORS[view.calculator] : null;
    const View = view.view ?? null;

    return (
        <div className="app">
            <header className="masthead">
                <div>
                    <p className="masthead__eyebrow">Learn by doing</p>
                    <h1>Duct Sizing for DIYers</h1>
                    <p className="masthead__tagline">
                        The real method professionals use, with the shortcuts they never write down. Work through the eight steps and the app builds
                        your duct schedule as you go.
                    </p>
                </div>
                <a className="masthead__home" href="/">
                    ← derekonay.com
                </a>
            </header>

            <div className="layout">
                <aside className="layout__nav">
                    <Nav current={view.id} navigate={navigate} />
                </aside>

                <main className="layout__main">
                    <WorksheetStrip derived={derived} onReset={resetSystem} />

                    <article className="lesson">
                        <header className="lesson__header">
                            {view.step > 0 && <p className="lesson__step">Step {view.step} of 8</p>}
                            <h2>{view.title}</h2>
                            <p className="lesson__subtitle">{view.subtitle}</p>
                        </header>

                        {view.blocks && <Prose blocks={view.blocks} />}
                        {Calculator && <Calculator system={system} update={update} derived={derived} />}
                        {View && <View />}
                    </article>

                    <Pager current={view.id} navigate={navigate} />
                </main>
            </div>

            <footer className="site-footer">
                <p>
                    Built as a teaching tool. Every number comes from the standard duct friction and equivalent-diameter equations, with fitting
                    losses in the spirit of ACCA Manual D. It is not a substitute for a stamped Manual J/S/D report, which your permit and your
                    equipment warranty may require.
                </p>
            </footer>
        </div>
    );
}
