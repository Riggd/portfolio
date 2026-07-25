/*
Self-check questions. Each one targets a specific mistake
that shows up in real DIY installs, and the explanation is
the actual lesson — getting it wrong should teach you more
than getting it right.
*/

export const QUIZ = [
    {
        question: 'Total effective length is the sum of…',
        options: [
            'Every duct in the house, plus fittings',
            'The longest supply run plus the longest return run, plus the fittings on that path',
            'The trunk length only',
            'The distance from the air handler to the thermostat',
        ],
        answer: 1,
        explanation:
            'One path only. Summing all the ductwork in the building gives you a huge TEL, a tiny friction rate, and duct sizes that will not fit in your joists. The air travels out and back, so supply and return are added together.',
    },
    {
        question: 'Your math says a branch needs 9.8" of round duct. You install…',
        options: ['9" — closest size', '10" — round up', '8" — it will be fine', '12" — round up two sizes to be safe'],
        answer: 1,
        explanation:
            'Always round up to the next available size, never down. Friction and velocity rise on a curve, so the inch you shave off costs more than it looks like it should. Rounding up two sizes is not wrong, just unnecessary spending — and very low velocity has its own problems.',
    },
    {
        question: 'A 90° rectangular elbow with no turning vanes costs about how much equivalent length?',
        options: ['1 foot — it is only a foot long', '5 feet', '45 feet', '200 feet'],
        answer: 2,
        explanation:
            'About 45 equivalent feet. Add turning vanes and the same elbow drops to roughly 15. Fittings, not straight duct, are usually the majority of total effective length — which is why deleting a fitting beats upsizing a duct.',
    },
    {
        question: 'You have a 1,200 CFM system. How much air does the return path need to carry?',
        options: [
            'About 400 CFM — returns are shared',
            'Whatever the biggest room needs',
            'The full 1,200 CFM, at a lower velocity than the supply',
            'Half the supply, since return duct is bigger',
        ],
        answer: 2,
        explanation:
            'Every cubic foot pushed out has to come back. Size the return for the entire blower airflow at a lower velocity — 300 to 500 fpm through the grille free area — and then go up a size. Undersized returns are the number one defect in DIY duct systems.',
    },
    {
        question: 'Your blower table shows 1,200 CFM at 0.7 in.wc. After subtracting coil, filter, and grilles you have 0.22 in.wc left, and your TEL is 275 ft. What is the friction rate?',
        options: ['0.0008', '0.08', '0.22', '2.75'],
        answer: 1,
        explanation:
            '(0.22 × 100) ÷ 275 = 0.08 in.wc per 100 ft. That is a healthy residential number. Notice it is well below the old 0.10 default — which is exactly why using 0.10 blindly undersizes real systems.',
    },
    {
        question: 'A bedroom has one supply register, no return, and the door stays closed at night. What happens?',
        options: [
            'Nothing — the door undercut handles it',
            'The room pressurizes, airflow into it drops, and the pressure pushes air through gaps in the walls',
            'The register gets louder but airflow is unaffected',
            'The return grille in the hallway pulls air through the wall',
        ],
        answer: 1,
        explanation:
            'It becomes a balloon. Air cannot get out, so less gets in, the room drifts out of temperature, and the pressure difference drives unconditioned air through every gap. Fix it with a dedicated return, a jump duct, or a transfer grille. A 1" undercut on a 30" door passes only about 50 CFM.',
    },
    {
        question: 'You need to use flex duct for a branch. Compared to rigid metal of the same size, fully stretched flex has…',
        options: ['Identical friction', 'About 1.5× the friction', 'Less friction — it is smoother', 'About 10× the friction'],
        answer: 1,
        explanation:
            'Roughly 1.5× when pulled drum tight, and it gets much worse as it goes slack or compresses. Working rule: go up one nominal size, pull it tight, cut off the excess, and support it every 4 to 5 feet with 1.5" straps.',
    },
    {
        question: 'Which change most improves a duct system, dollar for dollar?',
        options: [
            'Upgrading every branch one size',
            'Getting the ductwork inside conditioned space',
            'Adding a second filter',
            'Using rectangular duct instead of round',
        ],
        answer: 1,
        explanation:
            'Ducts in a vented attic can lose 20 to 30% of their capacity to leakage and heat transfer no matter how well they are sized. A slightly undersized duct in a conditioned basement beats a perfectly sized one in a 130°F attic. Round beats rectangular, by the way — the last option is backwards.',
    },
    {
        question: 'Where do balancing dampers belong?',
        options: [
            'At the register, so you can adjust them from the room',
            'At the trunk takeoff, accessible from the basement or attic',
            'Inside the plenum',
            'Nowhere — balance by closing registers',
        ],
        answer: 1,
        explanation:
            'At the takeoff, where the trunk splits. Dampers at the register whistle and put the noise in the room. Closing registers to balance raises system static pressure and makes everything worse.',
    },
    {
        question: 'The first thing to measure on a finished system is…',
        options: [
            'Refrigerant pressure',
            'Total external static pressure, with a manometer at ports before and after the air handler',
            'Room temperature',
            'The electric bill next month',
        ],
        answer: 1,
        explanation:
            'Static pressure is the blood pressure of the system. Two 3/8" test ports, one reading, five minutes, and you know whether the duct system you built matches the one you designed. Then measure the drop across each component to find which one is the problem.',
    },
];
