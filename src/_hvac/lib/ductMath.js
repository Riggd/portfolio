/*
===================================================
DUCT MATH
===================================================
Every number the app shows comes from a function in
this file. They are all pure so they can be tested
without a browser (see ductMath.test.js).

The core relationship is the ASHRAE friction-chart
approximation for round galvanized duct:

    dP100 = 0.109136 * CFM^1.9 / D^5.02

    dP100 = pressure lost per 100 ft, inches of water column
    CFM   = airflow, cubic feet per minute
    D     = inside diameter, inches

Solved for D it becomes the "ductulator" every HVAC
tech carries in their pocket.
*/

const FRICTION_COEFFICIENT = 0.109136;
const CFM_EXPONENT = 1.9;
const DIAMETER_EXPONENT = 5.02;

/*
Roughness multipliers relative to smooth galvanized pipe.
These are teaching approximations. ACCA Manual D has real
tables per material — use those for permit drawings.
*/
export const MATERIALS = {
    galvanized: { label: 'Rigid metal pipe', factor: 1.0, note: 'The baseline. Smoothest, cheapest per CFM delivered.' },
    ductBoard: { label: 'Fiberglass duct board', factor: 1.3, note: 'Rougher inside than metal. Size up if runs are long.' },
    flexTight: { label: 'Flex, pulled drum tight', factor: 1.5, note: 'Acceptable for short branch runs when fully stretched.' },
    flexSloppy: { label: 'Flex, slightly slack', factor: 2.4, note: 'What most DIY installs actually look like. Avoid.' },
};

/* Sizes you can actually buy off the shelf at a supply house. */
export const ROUND_SIZES = [4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24];

/* Sheet metal trunk depths that fit common joist and soffit cavities. */
export const RECT_DEPTHS = [6, 8, 10, 12, 14];

/*
---------------------------------------------------
AIRFLOW
---------------------------------------------------
*/

/*
Nominal airflow for a system. 400 CFM per ton is the
textbook number; drop toward 350 in humid climates so the
coil has time to wring out moisture, and push toward 450
in dry climates or heat-dominated systems.
*/
export const CFM_PER_TON_PRESETS = [
    { value: 350, label: '350 — humid climate, dehumidification matters' },
    { value: 400, label: '400 — standard cooling default' },
    { value: 450, label: '450 — dry climate or heating-dominated' },
];

export function systemCfm(tons, cfmPerTon = 400) {
    return tons * cfmPerTon;
}

/*
Room-by-room airflow. A real Manual J calculates the heat
gain of every room and splits the air by load share. This
is the beginner stand-in: floor area weighted by how hard
the room is to condition. It gets you close enough to buy
the right fittings, and it teaches the right instinct —
air follows load, not square footage.
*/
export const EXPOSURE_FACTORS = [
    { value: 1.0, label: 'Interior room, no exterior walls' },
    { value: 1.15, label: 'One exterior wall, normal windows' },
    { value: 1.35, label: 'Corner room, or a big window wall' },
    { value: 1.6, label: 'Bonus room over garage, attic room, sunroom' },
];

export function distributeCfm(rooms, totalCfm) {
    const weights = rooms.map((room) => Math.max(0, room.area) * room.exposure);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

    return rooms.map((room, index) => ({
        ...room,
        share: totalWeight > 0 ? weights[index] / totalWeight : 0,
        cfm: totalWeight > 0 ? Math.round((weights[index] / totalWeight) * totalCfm) : 0,
    }));
}

/*
---------------------------------------------------
PRESSURE BUDGET
---------------------------------------------------
The blower can only push so hard. Everything bolted into
the airstream takes a bite out of that. Whatever survives
is what the duct runs get to spend.
*/

/* Typical drops in inches of water column. Always prefer the real spec sheet. */
export const COMPONENT_DROPS = [
    { id: 'coil', label: 'Indoor coil (wet)', typical: 0.25, hint: 'Check the blower table first — cased units often include it.' },
    { id: 'filter', label: 'Air filter', typical: 0.15, hint: '1" pleated at design flow. A 4" media filter is closer to 0.08.' },
    { id: 'supplyRegisters', label: 'Supply registers', typical: 0.03, hint: 'Per the grille catalog, at the airflow the register actually sees.' },
    { id: 'returnGrilles', label: 'Return grilles', typical: 0.03, hint: 'Filter-back return grilles run much higher — 0.10 and up.' },
    { id: 'balancingDampers', label: 'Balancing dampers', typical: 0.03, hint: 'Budget for them even if you plan to leave them wide open.' },
    { id: 'accessories', label: 'Humidifier, UV, zone dampers', typical: 0.0, hint: 'Anything else in the airstream. Add it up.' },
];

export function availableStaticPressure(blowerEsp, drops) {
    const spent = Object.values(drops).reduce((sum, drop) => sum + (Number(drop) || 0), 0);
    return { spent, available: blowerEsp - spent };
}

/*
Friction rate is the budget spread over the distance the
air has to travel. This single number drives every duct
size in the house.
*/
export function frictionRate(availablePressure, totalEffectiveLength) {
    if (totalEffectiveLength <= 0) return 0;
    return (availablePressure * 100) / totalEffectiveLength;
}

/*
Sanity check on a friction rate. Manual D flags anything
outside roughly 0.06–0.18 as a system that needs rethinking
rather than resizing.
*/
export function gradeFrictionRate(rate) {
    if (rate <= 0) return { level: 'bad', message: 'No pressure left. The equipment, filter, or coil is eating the whole budget.' };
    if (rate < 0.06) return { level: 'bad', message: 'Very low. Ducts will be huge and expensive. Shorten runs, cut fittings, or find a blower with more capacity.' };
    if (rate < 0.08) return { level: 'warn', message: 'Low but workable. Expect generous duct sizes — that is the honest cost of a long run.' };
    if (rate <= 0.18) return { level: 'good', message: 'Healthy range. Standard sizing practice applies.' };
    return { level: 'warn', message: 'High. Ducts will be small and possibly noisy. Double-check your effective length — short runs are the usual cause.' };
}

/*
---------------------------------------------------
ROUND DUCT SIZING
---------------------------------------------------
*/

export function frictionPer100ft(cfm, diameter, materialFactor = 1) {
    if (cfm <= 0 || diameter <= 0) return 0;
    return (FRICTION_COEFFICIENT * Math.pow(cfm, CFM_EXPONENT) * materialFactor) / Math.pow(diameter, DIAMETER_EXPONENT);
}

/* The ductulator, solved for diameter. */
export function requiredDiameter(cfm, rate, materialFactor = 1) {
    if (cfm <= 0 || rate <= 0) return 0;
    const numerator = FRICTION_COEFFICIENT * Math.pow(cfm, CFM_EXPONENT) * materialFactor;
    return Math.pow(numerator / rate, 1 / DIAMETER_EXPONENT);
}

export function cfmAtSize(diameter, rate, materialFactor = 1) {
    if (diameter <= 0 || rate <= 0) return 0;
    const numerator = (rate * Math.pow(diameter, DIAMETER_EXPONENT)) / (FRICTION_COEFFICIENT * materialFactor);
    return Math.pow(numerator, 1 / CFM_EXPONENT);
}

/* Never round down. Rounding down is how systems get loud. */
export function nextRoundSize(diameter) {
    return ROUND_SIZES.find((size) => size >= diameter) ?? ROUND_SIZES[ROUND_SIZES.length - 1];
}

/* 144 sq in per sq ft, circle area = pi * d^2 / 4  ->  cfm * 183.35 / d^2 */
export function roundVelocity(cfm, diameter) {
    if (diameter <= 0) return 0;
    return (cfm * 4 * 144) / (Math.PI * diameter * diameter);
}

export function rectVelocity(cfm, width, height) {
    if (width <= 0 || height <= 0) return 0;
    return (cfm * 144) / (width * height);
}

/*
---------------------------------------------------
RECTANGULAR EQUIVALENTS
---------------------------------------------------
Two rectangular ducts with the same equivalent diameter
lose the same pressure per foot:

    De = 1.30 * (a*b)^0.625 / (a+b)^0.25
*/

export function equivalentDiameter(width, height) {
    if (width <= 0 || height <= 0) return 0;
    return (1.3 * Math.pow(width * height, 0.625)) / Math.pow(width + height, 0.25);
}

/*
There is no clean algebraic inverse, so bisect. The
function is monotonic in width, which makes this reliable
and about ten lines shorter than the alternatives.
*/
export function widthForEquivalentDiameter(height, targetDe, tolerance = 0.01) {
    let low = 1;
    let high = 200;

    while (high - low > tolerance) {
        const mid = (low + high) / 2;
        if (equivalentDiameter(mid, height) < targetDe) low = mid;
        else high = mid;
    }
    return (low + high) / 2;
}

/* Round up to the next even inch — that is how sheet metal is fabricated. */
function roundUpToEvenInch(value) {
    return Math.ceil(value / 2) * 2;
}

export function rectangularOptions(targetDe, cfm, depths = RECT_DEPTHS) {
    return depths
        .map((depth) => {
            const width = roundUpToEvenInch(widthForEquivalentDiameter(depth, targetDe));
            return {
                width,
                depth,
                aspectRatio: width / depth,
                velocity: rectVelocity(cfm, width, depth),
            };
        })
        .filter((option) => option.width >= option.depth);
}

/*
Aspect ratio is a cost and performance tax. A 4:1 duct
moves the same air as a 1:1 duct of equal area while
using far more metal and losing more pressure.
*/
export function gradeAspectRatio(ratio) {
    if (ratio <= 2) return { level: 'good', message: 'Efficient shape' };
    if (ratio <= 4) return { level: 'warn', message: 'Acceptable, more metal and more friction' };
    return { level: 'bad', message: 'Too flat — poor performer, avoid' };
}

/*
---------------------------------------------------
VELOCITY LIMITS
---------------------------------------------------
Friction sizing tells you what fits the pressure budget.
Velocity tells you whether you will be able to sleep in
the room. Residential targets, feet per minute.
*/
export const VELOCITY_LIMITS = {
    supplyTrunk: { min: 650, max: 900, label: 'Supply trunk' },
    supplyBranch: { min: 450, max: 700, label: 'Supply branch' },
    returnTrunk: { min: 550, max: 800, label: 'Return trunk' },
    returnBranch: { min: 350, max: 600, label: 'Return branch' },
};

export function gradeVelocity(velocity, limitKey) {
    const limit = VELOCITY_LIMITS[limitKey];
    if (velocity > limit.max) {
        return { level: 'bad', message: `Above ${limit.max} fpm — expect audible rush. Go up a size.` };
    }
    if (velocity < limit.min) {
        return { level: 'warn', message: `Below ${limit.min} fpm — quiet, but the air may not reach the far wall. Fine if you meant it.` };
    }
    return { level: 'good', message: `In the ${limit.min}–${limit.max} fpm sweet spot.` };
}

/*
---------------------------------------------------
GRILLES AND REGISTERS
---------------------------------------------------
A grille's face is mostly blades, not opening. Free area
ratio converts face size to the hole the air actually
squeezes through.
*/
export const GRILLE_TYPES = {
    stamped: { label: 'Stamped face (the cheap ones)', freeArea: 0.7 },
    bar: { label: 'Bar or louvered face', freeArea: 0.85 },
};

/* Net free area needed, in square inches. */
export function requiredFreeArea(cfm, faceVelocity) {
    if (faceVelocity <= 0) return 0;
    return (cfm * 144) / faceVelocity;
}

export function requiredGrilleFaceArea(cfm, faceVelocity, freeAreaRatio) {
    if (freeAreaRatio <= 0) return 0;
    return requiredFreeArea(cfm, faceVelocity) / freeAreaRatio;
}

/*
Return sizing is where DIY systems fail most often, so the
app gives it its own answer: the return path has to carry
the entire blower airflow, not one room's worth.
*/
export function returnPlan(totalCfm, { faceVelocity = 400, grilleType = 'stamped', materialFactor = 1, rate = 0.08 } = {}) {
    const freeArea = GRILLE_TYPES[grilleType].freeArea;
    const faceArea = requiredGrilleFaceArea(totalCfm, faceVelocity, freeArea);
    const diameter = requiredDiameter(totalCfm, rate, materialFactor);

    return {
        faceAreaSqIn: faceArea,
        faceAreaSqFt: faceArea / 144,
        singleGrille: squareSideFor(faceArea),
        twoGrilles: squareSideFor(faceArea / 2),
        ductDiameter: diameter,
        nominalDuct: nextRoundSize(diameter),
        equivalentDe: diameter,
    };
}

function squareSideFor(areaSqIn) {
    return Math.ceil(Math.sqrt(Math.max(0, areaSqIn)) / 2) * 2;
}

/*
---------------------------------------------------
TRUNK REDUCTION
---------------------------------------------------
Walk the trunk from the plenum outward, subtracting each
branch as it peels off, and resize when the remaining air
no longer needs the section it is in. Two rules keep it
practical: reduce in 2" steps, and stop at 8" — smaller
trunks cost more in fittings than they save in metal.
*/
export function reduceTrunk(startCfm, branches, rate, materialFactor = 1, minDepth = 8) {
    let remaining = startCfm;

    return branches.map((branch) => {
        const before = remaining;
        remaining = Math.max(0, remaining - branch.cfm);
        const de = requiredDiameter(remaining, rate, materialFactor);

        return {
            ...branch,
            cfmBefore: before,
            cfmAfter: remaining,
            requiredDe: de,
            nominalRound: remaining > 0 ? nextRoundSize(de) : 0,
            keepDepth: Math.max(minDepth, 0),
        };
    });
}
