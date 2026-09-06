import { FITTING_GROUPS } from '../lib/fittings.js';
import { Fields, NumberField } from '../components/Field.jsx';
import { Panel, Stat, StatRow, Verdict } from '../components/Results.jsx';

/*
Step 3 worksheet. Counting fittings is the part beginners skip,
so the equivalent-length price tag sits right next to every
stepper — the lesson lands faster when you watch 45 feet appear
because you added one plain rectangular elbow.
*/

function FittingCounter({ fitting, count, onChange }) {
    return (
        <div className="fitting">
            <div className="fitting__info">
                <p className="fitting__label">{fitting.label}</p>
                <p className="fitting__cost">{fitting.ef} equivalent ft each</p>
            </div>
            <div className="stepper">
                <button type="button" onClick={() => onChange(Math.max(0, count - 1))} aria-label={`One fewer ${fitting.label}`}>
                    −
                </button>
                <span className={count > 0 ? 'stepper__count stepper__count--active' : 'stepper__count'}>{count}</span>
                <button type="button" onClick={() => onChange(count + 1)} aria-label={`One more ${fitting.label}`}>
                    +
                </button>
            </div>
            <p className="fitting__total">{count > 0 ? `${count * fitting.ef} ft` : '—'}</p>
        </div>
    );
}

export function EffectiveLength({ system, update, derived }) {
    const setCount = (id, count) => update({ fittings: { ...system.fittings, [id]: count } });

    return (
        <>
            <Panel
                title="Measured length of the worst path"
                description="Tape-measure feet along the single longest supply run, and the single longest return run. Not the whole house."
            >
                <Fields>
                    <NumberField
                        label="Longest supply run"
                        value={system.supplyRun}
                        onChange={(supplyRun) => update({ supplyRun })}
                        suffix="ft"
                        step={5}
                        hint="Plenum → trunk → branch → register"
                    />
                    <NumberField
                        label="Longest return run"
                        value={system.returnRun}
                        onChange={(returnRun) => update({ returnRun })}
                        suffix="ft"
                        step={5}
                        hint="Grille → return duct → air handler"
                    />
                </Fields>
            </Panel>

            <Panel
                title="Fittings on that path"
                description="Count only the fittings the air passes through on the one path you measured above."
                footnote="Representative values in the spirit of ACCA Manual D Appendix 3. Use the published tables for permit drawings."
            >
                {FITTING_GROUPS.map((group) => (
                    <div key={group.id} className="fitting-group">
                        <h4>{group.title}</h4>
                        {group.fittings.map((fitting) => (
                            <FittingCounter
                                key={fitting.id}
                                fitting={fitting}
                                count={system.fittings[fitting.id] ?? 0}
                                onChange={(count) => setCount(fitting.id, count)}
                            />
                        ))}
                    </div>
                ))}
            </Panel>

            <Panel title="Your friction rate" description="This one number sizes every duct in the building.">
                <StatRow>
                    <Stat label="Measured duct" value={derived.tel.measured} unit="ft" />
                    <Stat
                        label="Fittings"
                        value={derived.tel.fittings}
                        unit="equiv. ft"
                        tone={derived.tel.fittings > derived.tel.measured ? 'warn' : 'neutral'}
                        hint={derived.tel.fittings > derived.tel.measured ? 'Fittings cost more than your straight duct' : undefined}
                    />
                    <Stat label="Total effective length" value={derived.tel.total} unit="ft" />
                    <Stat label="Friction rate" value={derived.rate.toFixed(3)} unit="in.wc/100ft" tone="primary" />
                </StatRow>
                <Verdict grade={derived.rateGrade} />
            </Panel>
        </>
    );
}
