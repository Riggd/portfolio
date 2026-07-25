import { useState } from 'react';

import { GRILLE_TYPES, gradeVelocity, requiredGrilleFaceArea, returnPlan, roundVelocity } from '../lib/ductMath.js';
import { Fields, NumberField, SelectField } from '../components/Field.jsx';
import { Panel, Stat, StatRow, Verdict } from '../components/Results.jsx';

/*
Step 5 worksheet. The return path carries the entire blower
airflow, so this screen starts from total CFM and never from a
single room — that framing is the lesson.
*/

const FACE_VELOCITIES = [
    { value: 300, label: '300 fpm — whisper quiet, largest grille' },
    { value: 400, label: '400 fpm — the standard target' },
    { value: 500, label: '500 fpm — the practical maximum' },
    { value: 600, label: '600 fpm — you will hear this' },
];

export function ReturnSizer({ derived }) {
    const [faceVelocity, setFaceVelocity] = useState(400);
    const [grilleType, setGrilleType] = useState('stamped');
    const [grilleCount, setGrilleCount] = useState(2);

    const plan = returnPlan(derived.totalCfm, {
        faceVelocity,
        grilleType,
        materialFactor: derived.materialFactor,
        rate: derived.rate,
    });

    const cfmPerGrille = derived.totalCfm / Math.max(1, grilleCount);
    const perGrilleFace = requiredGrilleFaceArea(cfmPerGrille, faceVelocity, GRILLE_TYPES[grilleType].freeArea);
    const perGrilleSide = Math.ceil(Math.sqrt(perGrilleFace) / 2) * 2;

    const upsized = plan.nominalDuct + 2;
    const ductVelocity = roundVelocity(derived.totalCfm, plan.nominalDuct);
    const upsizedVelocity = roundVelocity(derived.totalCfm, upsized);

    return (
        <>
            <Panel
                title="The return has to carry everything"
                description="Not one room's worth. The full blower airflow, at a lower velocity than the supply side."
            >
                <Fields>
                    <SelectField
                        label="Target face velocity"
                        value={String(faceVelocity)}
                        onChange={(value) => setFaceVelocity(Number(value))}
                        options={FACE_VELOCITIES.map((item) => ({ value: String(item.value), label: item.label }))}
                        hint="Velocity through the grille's free area, not its outside dimensions"
                    />
                    <SelectField
                        label="Grille style"
                        value={grilleType}
                        onChange={setGrilleType}
                        options={Object.entries(GRILLE_TYPES).map(([value, item]) => ({
                            value,
                            label: `${item.label} — ${Math.round(item.freeArea * 100)}% free area`,
                        }))}
                    />
                </Fields>

                <StatRow>
                    <Stat label="System airflow" value={derived.totalCfm.toLocaleString()} unit="CFM" />
                    <Stat label="Net free area needed" value={(plan.faceAreaSqFt * GRILLE_TYPES[grilleType].freeArea).toFixed(1)} unit="ft²" />
                    <Stat label="Total grille face needed" value={plan.faceAreaSqFt.toFixed(1)} unit="ft²" tone="primary" />
                </StatRow>
            </Panel>

            <Panel
                title="How many grilles"
                description="Splitting the return between two or three grilles is quieter, cheaper to fabricate, and pulls air more evenly from the house."
                footnote="Put them in central spaces — hallways and living areas. Keep them away from supply registers."
            >
                <Fields columns={1}>
                    <NumberField
                        label="Number of return grilles"
                        value={grilleCount}
                        onChange={(value) => setGrilleCount(Math.max(1, Number(value) || 1))}
                        step={1}
                        min={1}
                        max={6}
                    />
                </Fields>

                <StatRow>
                    <Stat label="Airflow per grille" value={Math.round(cfmPerGrille)} unit="CFM" />
                    <Stat
                        label="Each grille, roughly"
                        value={`${perGrilleSide}" × ${perGrilleSide}"`}
                        tone="primary"
                        hint="Or any rectangle with the same face area"
                    />
                    <Stat
                        label="One grille instead"
                        value={`${plan.singleGrille}" × ${plan.singleGrille}"`}
                        tone={plan.singleGrille > 24 ? 'warn' : 'neutral'}
                        hint={plan.singleGrille > 24 ? 'Awkwardly large — split it' : 'Manageable as a single grille'}
                    />
                </StatRow>
            </Panel>

            <Panel
                title="Return duct size"
                description="Sized at your friction rate for the full airflow — then upsized, because return duct is the cheapest insurance in HVAC."
            >
                <StatRow>
                    <Stat label="Calculated" value={plan.ductDiameter.toFixed(1)} unit="in" />
                    <Stat
                        label="Minimum to buy"
                        value={plan.nominalDuct}
                        unit="in round"
                        hint={`${Math.round(ductVelocity).toLocaleString()} fpm`}
                    />
                    <Stat
                        label="What to actually install"
                        value={upsized}
                        unit="in round"
                        tone="good"
                        hint={`${Math.round(upsizedVelocity).toLocaleString()} fpm — quieter, and forgiving of a dirty filter`}
                    />
                </StatRow>

                <Verdict grade={gradeVelocity(upsizedVelocity, 'returnTrunk')} prefix="At the upsized diameter:" />

                <h4 className="panel__subhead">Quick sanity check</h4>
                <p className="panel__note">
                    One square foot of net free grille area per 400 CFM. At {derived.totalCfm.toLocaleString()} CFM that is about{' '}
                    <strong>{(derived.totalCfm / 400).toFixed(1)} ft²</strong> of free area. If your grilles do not add up to roughly that, the
                    return is undersized — and undersized returns cause most of the noise and high static pressure in DIY systems.
                </p>
            </Panel>
        </>
    );
}
