import { useState } from 'react';

import {
    MATERIALS,
    ROUND_SIZES,
    VELOCITY_LIMITS,
    cfmAtSize,
    gradeAspectRatio,
    gradeVelocity,
    nextRoundSize,
    rectangularOptions,
    requiredDiameter,
    roundVelocity,
} from '../lib/ductMath.js';

import { Fields, NumberField, SelectField } from '../components/Field.jsx';
import { Panel, Stat, StatRow, Verdict } from '../components/Results.jsx';

/*
Step 4 worksheet, in three parts:

  1. Size one duct, and see why.
  2. A schedule for the whole house, generated from the rooms
     entered in Step 1 — this is the sheet you take shopping.
  3. A ductulator table, computed rather than pasted, so you
     can look sizes up without the app.
*/

const REFERENCE_RATES = [0.06, 0.08, 0.1, 0.12, 0.15];

const ROLE_OPTIONS = Object.entries(VELOCITY_LIMITS).map(([value, limit]) => ({
    value,
    label: `${limit.label} (${limit.min}–${limit.max} fpm)`,
}));

function SingleDuct({ defaultCfm, rate, materialFactor }) {
    const [cfm, setCfm] = useState(defaultCfm);
    const [role, setRole] = useState('supplyBranch');

    const exactDiameter = requiredDiameter(cfm, rate, materialFactor);
    const nominal = nextRoundSize(exactDiameter);
    const velocity = roundVelocity(cfm, nominal);
    const rects = rectangularOptions(exactDiameter, cfm);
    const noise = gradeVelocity(velocity, role);

    return (
        <Panel
            title="Size one duct"
            description="Airflow plus the friction rate from Step 3. Round up to a size you can buy, then check the velocity."
            footnote="Rectangular options are matched by equivalent diameter — the round pipe that loses the same pressure per foot."
        >
            <Fields>
                <NumberField label="Airflow through this duct" value={cfm} onChange={setCfm} suffix="CFM" step={25} min={10} />
                <SelectField label="What is this duct" value={role} onChange={setRole} options={ROLE_OPTIONS} />
            </Fields>

            <StatRow>
                <Stat label="Calculated diameter" value={exactDiameter.toFixed(1)} unit="in" hint="What the equation asks for" />
                <Stat label="Install this" value={nominal} unit="in round" tone="primary" hint="Next size up. Never round down." />
                <Stat label="Velocity at that size" value={Math.round(velocity).toLocaleString()} unit="fpm" tone={noise.level} />
            </StatRow>

            <Verdict grade={noise} prefix="Noise check:" />

            <h4 className="panel__subhead">If a cavity forces rectangular</h4>
            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Size</th>
                            <th className="numeric">Aspect ratio</th>
                            <th className="numeric">Velocity</th>
                            <th>Verdict</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rects.map((option) => {
                            const grade = gradeAspectRatio(option.aspectRatio);
                            return (
                                <tr key={`${option.width}x${option.depth}`}>
                                    <td className="strong">
                                        {option.width}" × {option.depth}"
                                    </td>
                                    <td className="numeric">{option.aspectRatio.toFixed(1)}:1</td>
                                    <td className="numeric">{Math.round(option.velocity).toLocaleString()} fpm</td>
                                    <td className={`cell--${grade.level}`}>{grade.message}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Panel>
    );
}

function Schedule({ rooms, totalCfm, rate, materialFactor }) {
    const trunkDiameter = requiredDiameter(totalCfm, rate, materialFactor);
    const trunkNominal = nextRoundSize(trunkDiameter);

    const rows = [
        {
            key: 'trunk',
            name: 'Supply trunk (at the plenum)',
            cfm: totalCfm,
            role: 'supplyTrunk',
            diameter: trunkDiameter,
            nominal: trunkNominal,
        },
        ...rooms.map((room) => {
            const diameter = requiredDiameter(room.cfm, rate, materialFactor);
            return {
                key: room.id,
                name: room.name,
                cfm: room.cfm,
                role: 'supplyBranch',
                diameter,
                nominal: nextRoundSize(diameter),
            };
        }),
    ];

    return (
        <Panel
            title="Your duct schedule"
            description="Generated from the rooms in Step 1 at your friction rate. This is the list you take to the supply house."
            footnote="Branches over 400 CFM should be split into two runs. Size the trunk sections as air peels off — see Step 6."
        >
            <div className="table-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Run</th>
                            <th className="numeric">Airflow</th>
                            <th className="numeric">Calculated</th>
                            <th className="numeric">Buy</th>
                            <th className="numeric">Velocity</th>
                            <th>Check</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => {
                            const velocity = roundVelocity(row.cfm, row.nominal);
                            const grade = gradeVelocity(velocity, row.role);
                            return (
                                <tr key={row.key}>
                                    <td>{row.name}</td>
                                    <td className="numeric">{row.cfm} CFM</td>
                                    <td className="numeric muted">{row.diameter.toFixed(1)}"</td>
                                    <td className="numeric strong">{row.nominal}" round</td>
                                    <td className="numeric">{Math.round(velocity).toLocaleString()} fpm</td>
                                    <td className={`cell--${grade.level}`}>{grade.level === 'good' ? 'Good' : grade.message}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Panel>
    );
}

function ReferenceTable({ materialFactor }) {
    return (
        <Panel
            title="Pocket ductulator"
            description="Maximum airflow for round duct, computed from the friction equation. Read down your friction rate column."
            footnote="Values shown for the material selected above. Rigid metal is the baseline every published chart assumes."
        >
            <div className="table-scroll">
                <table className="reference">
                    <thead>
                        <tr>
                            <th>Round size</th>
                            {REFERENCE_RATES.map((rate) => (
                                <th key={rate} className="numeric">
                                    {rate.toFixed(2)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ROUND_SIZES.map((size) => (
                            <tr key={size}>
                                <td className="strong">{size}"</td>
                                {REFERENCE_RATES.map((rate) => (
                                    <td key={rate} className="numeric">
                                        {Math.round(cfmAtSize(size, rate, materialFactor))}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="panel__footnote">Columns are friction rate in in.wc per 100 ft. Cells are CFM.</p>
        </Panel>
    );
}

export function DuctSizer({ system, update, derived }) {
    const [rateOverride, setRateOverride] = useState(null);
    const rate = rateOverride ?? derived.rate;

    return (
        <>
            <Panel
                title="Design inputs"
                description="Carried forward from Steps 1 through 3. Override the friction rate here if you want to explore."
            >
                <Fields>
                    <NumberField
                        label="Friction rate"
                        value={Number(rate.toFixed(3))}
                        onChange={(value) => setRateOverride(Number(value) || 0.0001)}
                        suffix="in.wc/100ft"
                        step={0.01}
                        min={0.01}
                        max={0.5}
                        hint={rateOverride === null ? 'From your worksheet' : 'Overridden — clear to go back'}
                    />
                    <SelectField
                        label="Duct material"
                        value={system.material}
                        onChange={(material) => update({ material })}
                        options={Object.entries(MATERIALS).map(([value, item]) => ({ value, label: `${item.label} — ${item.factor}× friction` }))}
                        hint={derived.material.note}
                    />
                </Fields>
                {rateOverride !== null && (
                    <button type="button" className="button button--quiet" onClick={() => setRateOverride(null)}>
                        Use my worksheet rate ({derived.rate.toFixed(3)})
                    </button>
                )}
                <Verdict grade={derived.rateGrade} prefix="Worksheet rate:" />
            </Panel>

            <SingleDuct defaultCfm={Math.max(75, derived.largestRoomCfm)} rate={rate} materialFactor={derived.materialFactor} />
            <Schedule rooms={derived.rooms} totalCfm={derived.totalCfm} rate={rate} materialFactor={derived.materialFactor} />
            <ReferenceTable materialFactor={derived.materialFactor} />
        </>
    );
}
