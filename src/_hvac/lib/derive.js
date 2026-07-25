/*
One place where the worksheet turns into results.

Every calculator reads from here instead of doing its own
math, which is why a change on the airflow screen instantly
moves the duct sizes on the sizing screen. That chain is the
whole point of the app: eight steps, one connected answer.
*/

import {
    MATERIALS,
    availableStaticPressure,
    distributeCfm,
    frictionRate,
    gradeFrictionRate,
    systemCfm,
} from './ductMath.js';

import { STARTER_SELECTIONS, totalEffectiveLength } from './fittings.js';

let nextRoomId = 0;
const room = (name, area, exposure) => ({ id: `room-${nextRoomId++}`, name, area, exposure });

/* A believable 3-ton, single-trunk basement system to start from. */
export const DEFAULT_SYSTEM = {
    tons: 3,
    cfmPerTon: 400,
    rooms: [
        room('Living room', 320, 1.35),
        room('Kitchen / dining', 260, 1.15),
        room('Primary bedroom', 200, 1.35),
        room('Bedroom 2', 140, 1.15),
        room('Bedroom 3', 130, 1.15),
        room('Hallway / office', 150, 1.0),
    ],
    blowerEsp: 0.7,
    drops: {
        coil: 0.25,
        filter: 0.15,
        supplyRegisters: 0.03,
        returnGrilles: 0.03,
        balancingDampers: 0.03,
        accessories: 0,
    },
    supplyRun: 45,
    returnRun: 25,
    fittings: { ...STARTER_SELECTIONS },
    material: 'galvanized',
};

export function derive(system) {
    const totalCfm = systemCfm(system.tons, system.cfmPerTon);
    const rooms = distributeCfm(system.rooms, totalCfm);
    const { spent, available } = availableStaticPressure(system.blowerEsp, system.drops);

    const tel = totalEffectiveLength({
        supplyRun: system.supplyRun,
        returnRun: system.returnRun,
        selections: system.fittings,
    });

    const rate = frictionRate(available, tel.total);

    return {
        totalCfm,
        rooms,
        spent,
        available,
        tel,
        rate,
        rateGrade: gradeFrictionRate(rate),
        material: MATERIALS[system.material],
        materialFactor: MATERIALS[system.material].factor,
        largestRoomCfm: rooms.reduce((max, item) => Math.max(max, item.cfm), 0),
    };
}
