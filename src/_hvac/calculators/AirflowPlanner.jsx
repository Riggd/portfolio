import { CFM_PER_TON_PRESETS, EXPOSURE_FACTORS } from '../lib/ductMath.js';
import { Fields, NumberField, SelectField, TextField } from '../components/Field.jsx';
import { Panel, Stat, StatRow } from '../components/Results.jsx';

/*
Step 1 worksheet: total airflow, then the room-by-room split.
Everything downstream reads these numbers.
*/

let roomCounter = 0;

export function AirflowPlanner({ system, update, derived }) {
    const updateRoom = (id, patch) =>
        update({ rooms: system.rooms.map((room) => (room.id === id ? { ...room, ...patch } : room)) });

    const addRoom = () =>
        update({ rooms: [...system.rooms, { id: `room-new-${roomCounter++}`, name: 'New room', area: 120, exposure: 1.15 }] });

    const removeRoom = (id) => update({ rooms: system.rooms.filter((room) => room.id !== id) });

    return (
        <>
            <Panel title="Total system airflow" description="Start from the equipment you have, or the equipment a load calculation told you to buy.">
                <Fields>
                    <NumberField
                        label="System capacity"
                        value={system.tons}
                        onChange={(tons) => update({ tons })}
                        suffix="tons"
                        step={0.5}
                        min={0.5}
                        max={10}
                        hint="12,000 BTU/h per ton"
                    />
                    <SelectField
                        label="Airflow per ton"
                        value={String(system.cfmPerTon)}
                        onChange={(value) => update({ cfmPerTon: Number(value) })}
                        options={CFM_PER_TON_PRESETS.map((preset) => ({ value: String(preset.value), label: preset.label }))}
                    />
                </Fields>

                <StatRow>
                    <Stat label="Total airflow" value={derived.totalCfm.toLocaleString()} unit="CFM" tone="primary" />
                    <Stat label="Rooms on the plan" value={system.rooms.length} />
                    <Stat
                        label="Largest single room"
                        value={derived.largestRoomCfm}
                        unit="CFM"
                        tone={derived.largestRoomCfm > 400 ? 'warn' : 'neutral'}
                        hint={derived.largestRoomCfm > 400 ? 'Over 400 — split it into two branches' : 'Fits on one branch'}
                    />
                </StatRow>
            </Panel>

            <Panel
                title="Room-by-room split"
                description="Area weighted by exposure. A stand-in for a room-by-room Manual J, close enough to buy the right fittings."
                footnote="Shares are relative, so the airflows always add up to the system total no matter what you type."
            >
                <div className="table-scroll">
                    <table className="room-table">
                        <thead>
                            <tr>
                                <th>Room</th>
                                <th>Floor area</th>
                                <th>Exposure</th>
                                <th className="numeric">Share</th>
                                <th className="numeric">Airflow</th>
                                <th aria-label="Remove" />
                            </tr>
                        </thead>
                        <tbody>
                            {derived.rooms.map((room) => (
                                <tr key={room.id}>
                                    <td>
                                        <TextField label="" value={room.name} onChange={(name) => updateRoom(room.id, { name })} />
                                    </td>
                                    <td>
                                        <NumberField
                                            label=""
                                            value={room.area}
                                            onChange={(area) => updateRoom(room.id, { area: Number(area) || 0 })}
                                            suffix="ft²"
                                            step={10}
                                        />
                                    </td>
                                    <td>
                                        <SelectField
                                            label=""
                                            value={String(room.exposure)}
                                            onChange={(value) => updateRoom(room.id, { exposure: Number(value) })}
                                            options={EXPOSURE_FACTORS.map((factor) => ({ value: String(factor.value), label: factor.label }))}
                                        />
                                    </td>
                                    <td className="numeric">{Math.round(room.share * 100)}%</td>
                                    <td className="numeric strong">{room.cfm} CFM</td>
                                    <td>
                                        <button type="button" className="button button--quiet" onClick={() => removeRoom(room.id)} aria-label={`Remove ${room.name}`}>
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button type="button" className="button" onClick={addRoom}>
                    Add a room
                </button>
            </Panel>
        </>
    );
}
