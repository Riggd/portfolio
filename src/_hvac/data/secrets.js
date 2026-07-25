/*
The cheat sheet. Everything an experienced installer knows
that no beginner guide bothers to say out loud, grouped so
it is scannable on a phone in a crawlspace.
*/

export const SECRET_GROUPS = [
    {
        title: 'Sizing',
        secrets: [
            {
                rule: 'Calculate the friction rate once, then reuse it everywhere.',
                why: 'One number from the worst run in the house sizes every duct in the building. Beginners think each run gets its own calculation. It does not.',
            },
            {
                rule: 'Always round up to the next available size.',
                why: 'Friction and velocity rise on a curve, not a line. Rounding 9.8" down to 9" costs far more than the inch suggests, and the pressure is gone permanently.',
            },
            {
                rule: 'Do not blindly use 0.10 in.wc per 100 ft.',
                why: 'It was a fair guess for compact 1960s systems. Modern filters, coils, and longer runs put real houses between 0.06 and 0.10. Using 0.10 makes every duct one size too small.',
            },
            {
                rule: 'Total effective length is one path, not all the duct.',
                why: 'Longest supply run plus longest return run. Summing the whole house produces a tiny friction rate and comically oversized ducts.',
            },
            {
                rule: 'Never run a single branch over about 400 CFM.',
                why: 'Two smaller branches are quieter, easier to balance, and easier to route than one big one.',
            },
        ],
    },
    {
        title: 'Returns',
        secrets: [
            {
                rule: 'Size the return for the whole blower, at lower velocity, then go up one size.',
                why: 'Return duct is the cheapest insurance in HVAC. Undersized returns cause high static pressure, low airflow, frozen coils, and most noise complaints.',
            },
            {
                rule: 'One square foot of net free grille area per 400 CFM.',
                why: 'The fastest sanity check there is. A 1,200 CFM system needs roughly 3 sq ft of free area — about 4 sq ft of grille face on a stamped grille.',
            },
            {
                rule: 'Every bedroom with a closed door needs a way for air to get out.',
                why: 'Otherwise it pressurizes, airflow stalls, and the pressure difference drags unconditioned air through the walls. Jump duct or transfer grille — a door undercut alone rarely does it.',
            },
            {
                rule: 'Never use stud bays or panned joists as ducts.',
                why: 'They leak enormously, cannot be sealed or cleaned, pull air from attics and crawlspaces, and are prohibited by most current codes.',
            },
        ],
    },
    {
        title: 'Fittings and layout',
        secrets: [
            {
                rule: 'Deleting a fitting beats upsizing a duct.',
                why: 'One rectangular elbow without vanes is 45 equivalent feet. Moving the air handler to delete two elbows is free performance and less noise.',
            },
            {
                rule: 'Turning vanes, angled takeoffs, side takeoffs.',
                why: 'Three cheap substitutions that routinely save 60+ equivalent feet: vanes drop an elbow from 45 ft to 15, angled takeoffs beat square by 15 ft, side beats bottom by 30.',
            },
            {
                rule: 'Round beats rectangular whenever it fits.',
                why: 'Less surface per unit area, less friction, cheaper, faster, easier to seal. Use rectangular only to fit a cavity, and keep aspect ratio under 4:1.',
            },
            {
                rule: 'Keep takeoffs 6–12" clear of elbows, transitions, and end caps.',
                why: 'Air coming out of a turn is turbulent and will not divide evenly. Never take off within 18" of the plenum.',
            },
            {
                rule: 'Reduce the trunk in 2" steps, and stop at 8".',
                why: 'Reduce width and keep depth so it stays in the same cavity. Below 8" the fittings cost more than the metal you save.',
            },
            {
                rule: 'Balancing dampers at the trunk takeoff, never at the register.',
                why: 'Dampers at the register whistle and put the noise in the room. Dampers at the trunk are quiet, and you can reach them without a ladder.',
            },
        ],
    },
    {
        title: 'Equipment and pressure',
        secrets: [
            {
                rule: 'Read the fine print above the blower table.',
                why: 'Many manufacturers publish airflow with the cased coil and filter already installed. Subtract them again and you will design duct the size of a car.',
            },
            {
                rule: 'A bigger filter is the cheapest upgrade in the system.',
                why: 'Pressure drop tracks face velocity. Double the area and you roughly halve the drop and double the service interval. Aim for 2 sq ft per 400 CFM, 4 if it fits.',
            },
            {
                rule: 'Budget for a dirty filter, not a clean one.',
                why: 'A 1" pleated filter can go from 0.10 to 0.25 in.wc as it loads. Design at the dirty number or the system falls apart every three months.',
            },
            {
                rule: 'Oversized equipment cannot be fixed with ductwork.',
                why: 'It short-cycles, never dehumidifies, and wears out early. Get a real Manual J before you buy. "500 square feet per ton" has ruined more houses than bad ducts.',
            },
        ],
    },
    {
        title: 'Installation craft',
        secrets: [
            {
                rule: 'Mastic, not duct tape.',
                why: 'Cloth duct tape fails on ducts — the test is famous. Brush mastic a nickel thick, mesh tape any gap over 1/8". UL 181 foil tape is acceptable on clean dry metal.',
            },
            {
                rule: 'Seal the plenum and the first five feet obsessively.',
                why: 'That is the highest-pressure duct in the system, so it leaks the most per square inch of hole. Seal the equipment cabinet too.',
            },
            {
                rule: 'Flex duct must be pulled drum tight and cut to length.',
                why: 'A few percent of compression can cost a third of the capacity. Support every 4–5 ft with 1.5" straps, max 1/2" sag per foot, bend radius at least one diameter.',
            },
            {
                rule: 'Keep ducts inside conditioned space.',
                why: 'The largest efficiency win available, bigger than any sizing decision. Attic ducts can lose 20–30% of capacity to leakage and heat gain even when perfectly sized.',
            },
            {
                rule: 'Seal before you insulate.',
                why: 'Nobody ever goes back and does it afterward.',
            },
        ],
    },
    {
        title: 'Verification',
        secrets: [
            {
                rule: 'Own a manometer. Measure static pressure on every job.',
                why: 'It is the blood pressure of the system and the fastest diagnostic there is. Two test ports and five minutes tell you more than an hour of guessing.',
            },
            {
                rule: 'Measure the drop across each component separately.',
                why: 'Filter, coil, supply, return. The one reading far above spec is your problem. Most weak-airflow complaints are one restrictive filter or one crushed flex run.',
            },
            {
                rule: 'Balance from the closest room outward, and re-check the far rooms.',
                why: 'Closing a near damper pushes air everywhere else. Every adjustment changes every other room, so it takes two or three passes.',
            },
            {
                rule: 'Tape a card with the design numbers inside the air handler door.',
                why: 'Design CFM, friction rate, measured static, room airflows, damper positions, date. In five years it is worth more than your memory.',
            },
        ],
    },
];
