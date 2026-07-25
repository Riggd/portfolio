import { COMPONENT_DROPS } from '../lib/ductMath.js';
import { Fields, NumberField } from '../components/Field.jsx';
import { Panel, Stat, StatRow } from '../components/Results.jsx';

/*
Step 2 worksheet. Deliberately shows the arithmetic as a
running ledger — the point of the lesson is that the budget
is small and everything in the airstream spends it.
*/

const BLOWER_PRESETS = [
    { label: 'Older PSC furnace', value: 0.5 },
    { label: 'Typical ECM air handler', value: 0.7 },
    { label: 'High-static ECM', value: 0.9 },
];

export function PressureBudget({ system, update, derived }) {
    const setDrop = (id, value) => update({ drops: { ...system.drops, [id]: Number(value) || 0 } });

    const tone = derived.available <= 0 ? 'bad' : derived.available < 0.15 ? 'warn' : 'primary';

    return (
        <>
            <Panel
                title="What the blower is rated for"
                description="From the blower performance table in your equipment manual, at the airflow and speed tap you plan to run."
            >
                <Fields columns={1}>
                    <NumberField
                        label="Rated external static pressure"
                        value={system.blowerEsp}
                        onChange={(blowerEsp) => update({ blowerEsp })}
                        suffix="in.wc"
                        step={0.05}
                        min={0.1}
                        max={2}
                        hint={`Typical: ${BLOWER_PRESETS.map((preset) => `${preset.label} ${preset.value}`).join(' · ')}`}
                    />
                </Fields>
            </Panel>

            <Panel
                title="Everything that takes a bite"
                description="Use manufacturer numbers where you have them. The typical values are starting points, not answers."
                footnote="Set a component to 0 if your blower table already includes it — double-counting the coil is the classic mistake."
            >
                <div className="table-scroll">
                    <table className="ledger">
                        <thead>
                            <tr>
                                <th>Component</th>
                                <th>Typical</th>
                                <th>Yours</th>
                                <th>Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {COMPONENT_DROPS.map((component) => (
                                <tr key={component.id}>
                                    <td>{component.label}</td>
                                    <td className="numeric muted">{component.typical.toFixed(2)}</td>
                                    <td>
                                        <NumberField
                                            label=""
                                            value={system.drops[component.id] ?? 0}
                                            onChange={(value) => setDrop(component.id, value)}
                                            step={0.01}
                                            min={0}
                                            max={1}
                                        />
                                    </td>
                                    <td className="muted small">{component.hint}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <StatRow>
                    <Stat label="Blower rating" value={system.blowerEsp.toFixed(2)} unit="in.wc" />
                    <Stat label="Spent on components" value={`−${derived.spent.toFixed(2)}`} unit="in.wc" tone="warn" />
                    <Stat
                        label="Available for ducts"
                        value={derived.available.toFixed(2)}
                        unit="in.wc"
                        tone={tone}
                        hint={
                            derived.available <= 0
                                ? 'Nothing left. Fix this upstream — bigger filter, better coil, stronger blower.'
                                : derived.available < 0.15
                                  ? 'Tight. Expect large ducts on any long run.'
                                  : 'Healthy budget to design against.'
                        }
                    />
                </StatRow>
            </Panel>
        </>
    );
}
