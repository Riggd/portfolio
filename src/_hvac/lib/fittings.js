/*
===================================================
FITTING EQUIVALENT LENGTHS
===================================================
A fitting does not cost you inches, it costs you feet.
Every elbow, tee, boot and takeoff is converted into the
length of straight duct that would lose the same pressure,
then added to the tape-measure length. The sum is Total
Effective Length (TEL).

Values below are rounded, representative numbers in the
spirit of ACCA Manual D Appendix 3. They are correct enough
to size a house and to build the right instincts. Pull the
real tables if you are stamping drawings.
*/

export const FITTING_GROUPS = [
    {
        id: 'departure',
        title: 'Leaving the equipment',
        fittings: [
            { id: 'plenum-takeoff-angled', label: 'Angled / 45° takeoff off the plenum', ef: 35 },
            { id: 'plenum-takeoff-square', label: 'Square 90° takeoff off the plenum', ef: 55 },
            { id: 'plenum-takeoff-bellmouth', label: 'Bellmouth or conical takeoff', ef: 15 },
            { id: 'trunk-takeoff-angled', label: 'Angled takeoff off the side of a trunk', ef: 35 },
            { id: 'trunk-takeoff-square', label: 'Square takeoff off the side of a trunk', ef: 50 },
            { id: 'trunk-takeoff-bottom', label: 'Takeoff out the bottom of a trunk', ef: 65 },
        ],
    },
    {
        id: 'turns',
        title: 'Turns',
        fittings: [
            { id: 'elbow-45', label: '45° elbow, round', ef: 10 },
            { id: 'elbow-90-smooth', label: '90° elbow, round, long radius', ef: 15 },
            { id: 'elbow-90-adjustable', label: '90° elbow, round, adjustable (gored)', ef: 20 },
            { id: 'elbow-90-flex', label: '90° bend in flex duct, generous radius', ef: 25 },
            { id: 'elbow-90-flex-tight', label: '90° bend in flex duct, tight radius', ef: 50 },
            { id: 'elbow-90-rect-vanes', label: '90° rectangular elbow with turning vanes', ef: 15 },
            { id: 'elbow-90-rect-plain', label: '90° rectangular elbow, no vanes', ef: 45 },
        ],
    },
    {
        id: 'splits',
        title: 'Splits and transitions',
        fittings: [
            { id: 'wye', label: 'Wye fitting (branch leg)', ef: 25 },
            { id: 'tee', label: 'Straight tee (branch leg)', ef: 40 },
            { id: 'trunk-reducer', label: 'Trunk reduction fitting', ef: 10 },
            { id: 'transition', label: 'Round-to-rectangular transition', ef: 10 },
        ],
    },
    {
        id: 'arrival',
        title: 'Arriving at the room',
        fittings: [
            { id: 'boot-straight', label: 'Straight boot into a register', ef: 35 },
            { id: 'boot-90', label: 'Boot with a 90° turn (stud or joist boot)', ef: 60 },
            { id: 'boot-end', label: 'End boot, air turns 90° and stops', ef: 70 },
        ],
    },
    {
        id: 'return',
        title: 'On the return side',
        fittings: [
            { id: 'return-grille-box', label: 'Return grille and box', ef: 30 },
            { id: 'return-filter-grille', label: 'Filter-back return grille and box', ef: 60 },
            { id: 'panned-joist', label: 'Panned joist bay used as return (do not)', ef: 90 },
            { id: 'return-drop', label: 'Return drop into the equipment', ef: 20 },
        ],
    },
];

export const ALL_FITTINGS = FITTING_GROUPS.flatMap((group) => group.fittings);

export function findFitting(id) {
    return ALL_FITTINGS.find((fitting) => fitting.id === id);
}

/*
TEL is measured along ONE path: the longest supply run plus
the longest return run. Not the total of all duct in the
house — a mistake that produces absurdly small friction
rates and comically oversized ducts.
*/
export function totalEffectiveLength({ supplyRun = 0, returnRun = 0, selections = {} }) {
    const fittingLength = Object.entries(selections).reduce((sum, [id, count]) => {
        const fitting = findFitting(id);
        return fitting ? sum + fitting.ef * (Number(count) || 0) : sum;
    }, 0);

    return {
        measured: supplyRun + returnRun,
        fittings: fittingLength,
        total: supplyRun + returnRun + fittingLength,
    };
}

/*
A starting kit for someone who has never done this. It is a
believable single-trunk basement system and it lands on a
friction rate in the normal range, which is the point.
*/
export const STARTER_SELECTIONS = {
    'plenum-takeoff-angled': 1,
    'elbow-90-smooth': 2,
    'trunk-takeoff-angled': 1,
    'boot-90': 1,
    'return-grille-box': 1,
    'return-drop': 1,
};
