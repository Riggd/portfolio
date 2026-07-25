/*
===================================================
CURRICULUM
===================================================
Lessons are data, not markup. Each lesson is a list of
blocks, and one block type maps to one small component in
components/Prose.jsx. Adding a lesson means adding an
object here — no new components, no new routes.

Block types:
  { p }                     paragraph
  { h }                     subheading
  { list }                  bullets
  { steps }                 numbered list
  { note: { kind, title, body } }   kind: secret | warn | tip
  { formula: { expression, legend } }
  { table: { head, rows } }

Inline **double asterisks** render bold. That is the only
markup, on purpose.
*/

export const LESSONS = [
    /* ------------------------------------------------ */
    {
        id: 'start',
        step: null,
        nav: 'Start here',
        title: 'Ductwork, demystified',
        subtitle: 'Eight steps from a bare basement to a system that is quiet, balanced, and passes inspection.',
        blocks: [
            {
                p: 'Sizing ductwork looks like a trade secret because the people who do it well make it look like guessing. It is not. It is one number — the **friction rate** — followed by a lookup table. This app walks you to that number, then hands you the table.',
            },
            { h: 'The whole process in one breath' },
            {
                steps: [
                    'Decide how much air the equipment moves, and how much of it each room deserves.',
                    'Find out how hard the blower can push, then subtract everything that steals pressure.',
                    'Measure how far the air has to travel — counting fittings as if they were feet of pipe.',
                    'Divide the leftover pressure by that distance. That is your friction rate.',
                    'Look up a duct size for every run at that friction rate. Check the velocity so it stays quiet.',
                    'Size the returns for the whole blower, because that is what kills most DIY systems.',
                    'Lay it out with the fewest, gentlest turns you can manage.',
                    'Build it airtight, then measure it to prove you were right.',
                ],
            },
            {
                note: {
                    kind: 'secret',
                    title: 'The secret hiding in plain sight',
                    body: 'Professionals are not calculating harder than you. They are calculating **once**, on the longest run, and then reusing that one friction rate for the entire house. Every duct in the building gets sized off the same number.',
                },
            },
            { h: 'What you should have on hand' },
            {
                list: [
                    'The **blower table** from your furnace or air handler manual — the page with CFM at different static pressures. This is the single most important document you own.',
                    'A floor plan with room dimensions. Graph paper is fine.',
                    'A tape measure and a willingness to crawl.',
                    'A **manometer** (a digital dual-port one costs less than a bad service call). You cannot verify any of this without it.',
                ],
            },
            {
                note: {
                    kind: 'warn',
                    title: 'What this app is and is not',
                    body: 'This teaches you the real method with honest simplifications, and every number it prints comes from the standard equations. It is not a stamped Manual J/D/S report. Many jurisdictions require one for a permit, and your equipment warranty may too. Use this to understand your system, plan it, and check somebody else’s work — then get the load calc done properly before you spend money on equipment.',
                },
            },
        ],
    },

    /* ------------------------------------------------ */
    {
        id: 'basics',
        step: 0,
        nav: 'How air moves',
        title: 'Think in pressure, not pipes',
        subtitle: 'Four ideas. Everything else in this app is bookkeeping.',
        blocks: [
            { h: '1. CFM is the delivery, not the goal' },
            {
                p: 'Airflow is measured in **cubic feet per minute**. A room does not need "a vent," it needs a quantity of air proportional to how much heat it gains or loses. Undersize the airflow and no amount of thermostat fiddling fixes that room.',
            },
            { h: '2. Static pressure is the fuel, and the tank is tiny' },
            {
                p: 'Your blower is rated to overcome a fixed amount of resistance — commonly **0.5 in.wc** on an older PSC blower and **0.7 to 0.8** on a modern ECM. That is inches of water column, and it is a shockingly small budget: 0.5 in.wc is about 1/50th of a PSI. A dirty filter can eat a third of it.',
            },
            {
                note: {
                    kind: 'tip',
                    title: 'Why techs obsess over static pressure',
                    body: 'It is the blood pressure of the system. High static means the blower is straining, airflow is down, the coil is freezing or overheating, and the equipment is dying young. It is measurable in five minutes and it tells you more than any other single reading.',
                },
            },
            { h: '3. Friction rate ties the two together' },
            {
                p: 'Air rubbing against duct wall loses pressure at a rate that depends on how fast it is moving and how big the pipe is. Express that loss per 100 feet of duct and you have the **friction rate** — the unit that duct charts are indexed by.',
            },
            {
                formula: {
                    expression: 'Friction rate = (Available static pressure × 100) ÷ Total effective length',
                    legend: [
                        'Available static pressure — what the blower has left after the coil, filter, and grilles take their cut, in in.wc',
                        'Total effective length — the longest supply run plus the longest return run, with fittings counted as equivalent feet',
                    ],
                },
            },
            { h: '4. Fittings cost feet, not inches' },
            {
                p: 'This is the idea beginners are missing when their system does not work. A sheet metal elbow is 12 inches long and costs the same pressure as **15 feet** of straight pipe. A boot that turns the air 90° into a floor register costs **60 feet**. In a typical house, fittings are more than half of the total effective length.',
            },
            {
                note: {
                    kind: 'secret',
                    title: 'Corollary worth tattooing on your forearm',
                    body: 'The cheapest performance upgrade is always **deleting a fitting**. Moving the air handler ten feet to eliminate two elbows beats going up a duct size, costs nothing in material, and makes the system quieter.',
                },
            },
            { h: 'Two rules you will use constantly' },
            {
                list: [
                    '**Round beats rectangular.** Same cross-sectional area, less surface for the air to rub on, cheaper, faster to install, easier to seal. Use rectangular only where you need to fit a cavity.',
                    '**Doubling the diameter carries about 5.7× the air** at the same friction. Duct capacity scales viciously fast, which is why going up one nominal size fixes so many problems.',
                ],
            },
        ],
    },

    /* ------------------------------------------------ */
    {
        id: 'airflow',
        step: 1,
        nav: 'Step 1 · Airflow',
        title: 'How much air, and who gets it',
        subtitle: 'Total CFM for the equipment, then a fair split between rooms.',
        calculator: 'AirflowPlanner',
        blocks: [
            { h: 'Total airflow' },
            {
                p: 'Start from the equipment, not the ducts. Cooling systems are designed around roughly **400 CFM per ton** of capacity. A 3-ton system moves about 1,200 CFM. Adjust for climate:',
            },
            {
                table: {
                    head: ['CFM per ton', 'When to use it', 'Why'],
                    rows: [
                        ['350', 'Humid climates, high latent load', 'Slower air spends longer on the coil and pulls out more moisture'],
                        ['400', 'The default', 'What manufacturers rate equipment at'],
                        ['450', 'Dry climates, heating-dominated', 'Sensible cooling only, or you need furnace airflow'],
                    ],
                },
            },
            {
                note: {
                    kind: 'warn',
                    title: 'Do not size equipment from a rule of thumb',
                    body: 'CFM per ton tells you the airflow **for the tonnage you already have**. It does not tell you what tonnage the house needs. That is a Manual J load calculation, and "500 square feet per ton" has oversized more houses than any other sentence in this trade. An oversized system short-cycles, never dehumidifies, and cannot be fixed with ductwork.',
                },
            },
            { h: 'Splitting it between rooms' },
            {
                p: 'Air follows **load**, not floor area. A south-facing room with three windows needs far more air than a same-sized interior hallway. The right tool is a room-by-room Manual J. The calculator below is the honest beginner stand-in: floor area weighted by how exposed the room is.',
            },
            {
                list: [
                    'Interior room, no exterior walls — factor **1.0**',
                    'One exterior wall, normal windows — factor **1.15**',
                    'Corner room, or a wall of glass — factor **1.35**',
                    'Room over a garage, attic room, sunroom — factor **1.6**',
                ],
            },
            {
                note: {
                    kind: 'secret',
                    title: 'The room that is always wrong',
                    body: 'The bonus room over the garage. It has conditioned air on one side and outdoor temperatures on the other five, it sits at the end of the longest duct run, and it was sized by floor area. If you have one, give it its own generous branch straight off the plenum — or its own mini-split and stop fighting it.',
                },
            },
            { h: 'Sanity checks on the split' },
            {
                list: [
                    'No single branch should carry more than about **400 CFM**. Beyond that, run two branches — it is quieter and easier to balance.',
                    'A bedroom typically lands at **75 to 150 CFM**. A living room at **200 to 400**.',
                    'Bathrooms and closets usually get nothing. Exhaust fans handle bathrooms.',
                    'If your split says a room needs 500 CFM, re-read the exposure factors before you believe it.',
                ],
            },
        ],
    },

    /* ------------------------------------------------ */
    {
        id: 'pressure',
        step: 2,
        nav: 'Step 2 · Pressure budget',
        title: 'What the blower has left to spend',
        subtitle: 'Start with the blower rating, subtract every obstacle, keep the change.',
        calculator: 'PressureBudget',
        blocks: [
            {
                p: 'Open your equipment manual to the blower performance table. Find the row for the airflow you need at the speed tap you plan to use. The column heading tells you the maximum **external static pressure** the blower can work against and still deliver that CFM. That is the entire budget.',
            },
            {
                note: {
                    kind: 'secret',
                    title: 'The double-counting trap',
                    body: 'Read the fine print above the blower table. Many manufacturers publish airflow **with the cased coil and a clean filter already installed**. If you then subtract the coil and filter again, you will end up with almost no available pressure and duct sizes the size of a car. Check whether the table says "wet coil" or "with filter" before you subtract anything.',
                },
            },
            { h: 'Everything that takes a bite' },
            {
                table: {
                    head: ['Component', 'Typical drop (in.wc)', 'Notes'],
                    rows: [
                        ['Indoor coil, wet', '0.20 – 0.30', 'Wet is what matters — a dry coil reading flatters you'],
                        ['1" pleated filter', '0.10 – 0.25', 'Rises steeply as it loads. Budget for dirty, not clean'],
                        ['4" media filter', '0.05 – 0.10', 'More surface, less resistance, longer intervals'],
                        ['Filter-back return grille', '0.10 – 0.20', 'Convenient, expensive in pressure'],
                        ['Supply registers', '0.03 – 0.05', 'From the grille catalog, at actual CFM'],
                        ['Return grilles', '0.03 – 0.05', 'Per grille, at actual CFM'],
                        ['Balancing dampers', '0.03', 'Budget for them even if left open'],
                        ['Humidifier / UV / zone dampers', '0.05 – 0.20', 'Anything in the airstream counts'],
                    ],
                },
            },
            {
                note: {
                    kind: 'tip',
                    title: 'Bigger filters are free performance',
                    body: 'Pressure drop across a filter depends on **face velocity**. Double the filter area and you roughly halve the drop, and it lasts twice as long between changes. Aim for at least 2 square feet of filter per 400 CFM — 4 square feet if you can fit it. This is the highest-return decision in the whole design and it costs almost nothing at rough-in.',
                },
            },
            { h: 'What good looks like' },
            {
                list: [
                    'A modern ECM air handler rated **0.7 in.wc**, minus a wet coil, decent filter, and grilles, leaves roughly **0.20 to 0.30 in.wc** for the ducts.',
                    'An older PSC furnace rated **0.5 in.wc** may leave only **0.10 to 0.15**. Long runs on that budget need genuinely large ducts. That is not a mistake in your math — it is the truth about that blower.',
                    'If your available pressure lands near zero, the fix is upstream: a bigger filter, a better coil, a stronger blower, or shorter duct runs. Do not "just make the ducts smaller."',
                ],
            },
        ],
    },

    /* ------------------------------------------------ */
    {
        id: 'length',
        step: 3,
        nav: 'Step 3 · Effective length',
        title: 'The longest path, in equivalent feet',
        subtitle: 'Count the fittings. This is where the friction rate comes from.',
        calculator: 'EffectiveLength',
        blocks: [
            {
                p: 'Find the **worst run in the house**: from the blower, out through the supply plenum, along the trunk, down the branch, into the register of the farthest or most awkward room. Then the worst return path back to the blower. Measure both with a tape, then add an equivalent length for every fitting on the way.',
            },
            {
                formula: {
                    expression: 'TEL = supply feet + return feet + Σ (fitting equivalent lengths)',
                    legend: [
                        'One path only — not the total of every duct in the house',
                        'Supply side and return side are added together, because the air travels both',
                    ],
                },
            },
            {
                note: {
                    kind: 'warn',
                    title: 'The most common beginner error in this whole app',
                    body: 'Do **not** add up all the ductwork in the building. TEL is one path: the single longest supply run plus the single longest return run. Summing everything gives you an enormous TEL, a microscopic friction rate, and duct sizes that will not fit in your joists.',
                },
            },
            { h: 'Why fittings dominate' },
            {
                p: 'Look at what the fittings cost in the calculator below. A plain square 90° rectangular elbow is **45 equivalent feet**. Add turning vanes to that same elbow and it drops to **15**. A takeoff out the bottom of a trunk costs **65 feet**; the same takeoff angled off the side costs **35**.',
            },
            {
                note: {
                    kind: 'secret',
                    title: 'Where the free wins are',
                    body: 'Three substitutions cost almost nothing and routinely save 60+ equivalent feet: **turning vanes** in rectangular elbows, **angled or bellmouth takeoffs** instead of square ones, and taking off the **side** of a trunk instead of the bottom. That is more improvement than going up a duct size, for the price of better fittings.',
                },
            },
            { h: 'Reading your result' },
            {
                table: {
                    head: ['Friction rate', 'Verdict', 'What to do'],
                    rows: [
                        ['Below 0.06', 'Trouble', 'Ducts will be enormous. Shorten the run, delete fittings, or find more blower'],
                        ['0.06 – 0.08', 'Low but workable', 'Expect generous sizes. That is the honest price of a long run'],
                        ['0.08 – 0.18', 'Healthy', 'Normal residential territory. Size away'],
                        ['Above 0.18', 'Suspicious', 'Usually means you understated TEL. Recount your fittings'],
                    ],
                },
            },
            {
                note: {
                    kind: 'tip',
                    title: 'Why 0.10 is not the default',
                    body: 'Old guides say "just use 0.10 in.wc per 100 ft." That was a reasonable guess for a compact 1960s system with a low-resistance filter. Modern houses have longer runs and modern filters and coils eat more pressure, so real systems commonly land between **0.06 and 0.10**. Using 0.10 blindly makes every duct in the house one size too small.',
                },
            },
        ],
    },

    /* ------------------------------------------------ */
    {
        id: 'sizing',
        step: 4,
        nav: 'Step 4 · Size the ducts',
        title: 'CFM plus friction rate equals a duct size',
        subtitle: 'The payoff. Then a velocity check so you can sleep at night.',
        calculator: 'DuctSizer',
        blocks: [
            {
                p: 'You now have everything. For each run, feed in its CFM and the one friction rate you calculated for the whole house, and read off a size. Do this for the trunk, then every branch. It is genuinely this mechanical.',
            },
            {
                formula: {
                    expression: 'Pressure loss per 100 ft = 0.109136 × CFM^1.9 ÷ D^5.02',
                    legend: [
                        'D is inside diameter in inches, for smooth round metal pipe',
                        'This is the equation printed on the back of every ductulator — solved for D, it gives you the size',
                    ],
                },
            },
            { h: 'Two checks, always' },
            {
                steps: [
                    '**Friction check** — is the duct big enough to move the air within the pressure budget? That is what the equation above answers.',
                    '**Velocity check** — is the air moving slowly enough to be quiet? Friction sizing alone will happily hand you a duct that works perfectly and sounds like a wind tunnel.',
                ],
            },
            {
                table: {
                    head: ['Location', 'Target velocity (fpm)', 'Symptom if exceeded'],
                    rows: [
                        ['Supply trunk', '650 – 900', 'Audible rush through the house'],
                        ['Supply branch', '450 – 700', 'Whistling and register noise in the room'],
                        ['Return trunk', '550 – 800', 'Roar near the air handler'],
                        ['Return branch', '350 – 600', 'The return grille becomes the loudest thing in the hall'],
                    ],
                },
            },
            {
                note: {
                    kind: 'secret',
                    title: 'Always round up. Never round down.',
                    body: 'If the math says 9.8 inches, install 10 — never 9. Rounding down raises velocity and friction on a curve, not a line, and the pressure you lose is gone forever. Rounding up costs a few dollars of metal and buys you quiet, plus headroom for the dirty filter you will inevitably run too long.',
                },
            },
            { h: 'Rectangular when you must' },
            {
                p: 'Cavities force rectangular duct. Convert using **equivalent diameter** — the round pipe that loses the same pressure per foot. Keep the aspect ratio under **4:1**, ideally under **2:1**. A 20×5 duct and a 10×10 duct have nearly the same area, but the flat one uses more metal, loses more pressure, and costs more to fabricate.',
            },
            {
                note: {
                    kind: 'tip',
                    title: 'Flex duct is not free',
                    body: 'Fully stretched, flex duct has roughly **1.5×** the friction of metal at the same size. Let it sag and go slack and it can double again. As a working rule: if you must use flex, **go up one nominal size**, pull it drum tight, and support it every 4 to 5 feet. The calculator lets you pick the material so you can see the penalty.',
                },
            },
        ],
    },

    /* ------------------------------------------------ */
    {
        id: 'returns',
        step: 5,
        nav: 'Step 5 · Returns',
        title: 'The half everyone forgets',
        subtitle: 'Undersized returns are the number one defect in DIY duct systems.',
        calculator: 'ReturnSizer',
        blocks: [
            {
                p: 'Every cubic foot the blower pushes out has to come back. If your supply system can deliver 1,200 CFM and your return path can only feed 800, you do not get 1,200 — you get a starving blower, high static pressure, a frozen or overheating coil, and a house that never quite gets comfortable.',
            },
            {
                note: {
                    kind: 'secret',
                    title: 'The single highest-value rule in this app',
                    body: 'Size the return path for the **entire blower airflow**, at a **lower velocity** than the supply. Then go one size bigger. Return duct is the cheapest insurance in HVAC — nobody has ever regretted an oversized return, and half of all "my system is too loud" complaints are an undersized one.',
                },
            },
            { h: 'Grille sizing by face velocity' },
            {
                p: 'A grille is mostly blades. **Free area** is the actual hole — around 70% of the face on a stamped grille, 85% on a bar grille. Size by the velocity through that free area:',
            },
            {
                list: [
                    'Return grilles: **300 – 500 fpm** net. Above 500 you will hear it; above 600 you will hate it.',
                    'Supply registers: **400 – 700 fpm** net, and check the manufacturer’s throw so the air actually reaches the far side of the room.',
                    'Rule of thumb worth memorizing: **1 square foot of net free area per 400 CFM**. A 1,200 CFM system needs about 3 square feet of return free area — call it 4 square feet of grille face.',
                ],
            },
            {
                note: {
                    kind: 'tip',
                    title: 'Two returns beat one',
                    body: 'A single 1,200 CFM return grille is enormous, loud, and gathers dust in one hallway. Two grilles at 600 CFM each are quieter, cheaper to fabricate, and pull air more evenly from the house. Put them in central spaces — hallways and living areas, high or low depending on your climate.',
                },
            },
            { h: 'Closed doors are a hidden return problem' },
            {
                p: 'A bedroom with a supply register, a closed door, and no return becomes a pressurized balloon. Air stops flowing in, the room drifts out of temperature, and the pressure difference pulls unconditioned air through every gap in the wall. The fixes, best first:',
            },
            {
                steps: [
                    'A **dedicated return** in the room. Best performance, most work.',
                    'A **jump duct** — a short flex loop over the wall from the room ceiling to the hallway ceiling. Quiet and preserves privacy.',
                    'A **transfer grille** — a pair of offset wall grilles in the same stud bay. Cheap, but sound passes through.',
                    'Undercutting the door. Better than nothing, and rarely enough on its own — a 1" undercut on a 30" door passes maybe 50 CFM.',
                ],
            },
            {
                note: {
                    kind: 'warn',
                    title: 'Never use building cavities as ducts',
                    body: 'Panned joist bays, stud cavities, and "the space between the floors" are not ductwork. They leak enormously, they are impossible to seal or clean, they pull air out of the attic and crawlspace, and in most current codes they are simply not allowed. Run actual duct.',
                },
            },
        ],
    },

    /* ------------------------------------------------ */
    {
        id: 'layout',
        step: 6,
        nav: 'Step 6 · Layout',
        title: 'Draw it before you cut anything',
        subtitle: 'Layout decisions cost pennies on paper and hundreds in sheet metal.',
        blocks: [
            { h: 'Pick a shape' },
            {
                table: {
                    head: ['Layout', 'How it works', 'Best for'],
                    rows: [
                        ['Trunk and branch', 'One main duct with takeoffs along it, reducing as air peels off', 'Basements and crawlspaces. The workhorse — use this unless you have a reason not to'],
                        ['Radial', 'Individual runs from a central plenum to each room', 'Slab-on-grade, compact single-story, attic installs'],
                        ['Extended plenum', 'Constant-size trunk with branches, no reduction', 'Short runs under about 24 ft, where reducing is not worth the fittings'],
                    ],
                },
            },
            { h: 'Where the equipment goes' },
            {
                p: 'Central is the single biggest lever you have. Every foot the air handler moves toward the middle of the floor plan shortens the worst run, raises your friction rate, and shrinks every duct in the house.',
            },
            {
                note: {
                    kind: 'secret',
                    title: 'The efficiency win that beats all the sizing math',
                    body: 'Keep the ductwork **inside conditioned space**. Ducts in a vented attic can lose 20–30% of their capacity to leakage and heat transfer even when perfectly sized. A slightly undersized duct in a conditioned basement outperforms a perfectly sized one in a 130°F attic. If ducts must go in the attic, bury them in insulation or build a conditioned chase.',
                },
            },
            { h: 'Reducing the trunk' },
            {
                p: 'As branches peel off, the trunk carries less air. Resize it so velocity stays in range instead of dropping to nothing:',
            },
            {
                list: [
                    'Reduce in **2 inch** increments — for rectangular trunk, reduce the **width** and keep the depth constant so it stays in the same cavity.',
                    'Do not reduce for every branch. Reduce roughly every time you shed **a third of the airflow**, or when velocity falls below its target.',
                    'Stop reducing at about **8 inches**. Below that the fittings cost more than the metal you save.',
                    'A reducing fitting is only about **10 equivalent feet** — reducing is cheap. Use a gradual transition, not an abrupt step.',
                ],
            },
            { h: 'Takeoffs and branches' },
            {
                list: [
                    'Take off the **side** of the trunk, not the bottom. Side takeoffs cost 35 equivalent feet; bottom takeoffs cost 65.',
                    'Keep takeoffs at least **6 to 12 inches** away from elbows, transitions, and the end cap — air coming out of a turn is turbulent and will not divide evenly.',
                    'Never put a takeoff in the **first 18 inches** off the plenum. That air is still swirling off the blower.',
                    'Put a **balancing damper at every takeoff**, at the trunk, where you can reach it. Not at the register — dampers at the register are the ones that whistle.',
                    'Feed the farthest room from the **end** of the trunk, and give it a slightly generous branch. Distance always wins arguments.',
                ],
            },
            { h: 'Registers in the room' },
            {
                list: [
                    'Cold climates: registers **low, under windows**, throwing up across the glass to wash the cold surface.',
                    'Hot climates: registers **high**, throwing across the ceiling so cool air falls through the room.',
                    'Aim the throw across the room, not into a wall three feet away, and not straight at where people sit.',
                    'Keep supply and return **apart**. Air that leaves a supply and returns immediately has done nothing for the room.',
                ],
            },
            {
                note: {
                    kind: 'tip',
                    title: 'Draw the whole thing to scale first',
                    body: 'Sketch the plan, mark CFM at every register, then walk the trunk from the plenum outward writing the running total beside each section. Ten minutes with a pencil catches the joist you cannot cross and the beam you cannot get past — and that is the mistake that costs a weekend.',
                },
            },
        ],
    },

    /* ------------------------------------------------ */
    {
        id: 'install',
        step: 7,
        nav: 'Step 7 · Build it',
        title: 'Craft is what separates working from good',
        subtitle: 'Sealing, supporting, and insulating — where the design gets thrown away or kept.',
        blocks: [
            { h: 'Sealing' },
            {
                note: {
                    kind: 'secret',
                    title: 'Duct tape does not seal ducts',
                    body: 'Cloth duct tape dries out, curls off, and fails within a few years — it famously fails the test named after it. Use **water-based mastic** brushed on to about the thickness of a nickel, reinforced with mesh tape on any gap over 1/8". **UL 181 foil tape** is legitimate on clean, dry metal. Every longitudinal seam, every joint, every takeoff, and the equipment cabinet itself.',
                },
            },
            {
                list: [
                    'Mechanically fasten before you seal: **three screws minimum** per round joint, then mastic over the whole seam.',
                    'Seal the **plenum and the first five feet** obsessively. Leaks there are at the highest pressure in the system and leak the most air.',
                    'Seal **before** you insulate. Nobody has ever gone back and done it after.',
                    'Boots get sealed to the **subfloor or drywall**, not just to the duct. That connection leaks straight into the floor cavity.',
                ],
            },
            { h: 'Supporting' },
            {
                list: [
                    'Rigid metal: support every **8 to 10 feet**, and within 2 feet of every fitting.',
                    'Flex duct: support every **4 to 5 feet** with straps at least **1.5 inches wide**. Wire and zip ties cut into the liner and choke the duct.',
                    'Maximum sag: **1/2 inch per foot** of strap spacing. Flex duct sagging between supports is a series of hidden elbows.',
                    'Never let duct rest on a joist edge, a pipe, or a wire. It crushes and it rattles.',
                ],
            },
            { h: 'Flex duct, done properly' },
            {
                p: 'Flex is fast, quiet, and forgiving of imperfect geometry. It is also the most abused material in residential HVAC.',
            },
            {
                steps: [
                    'Pull it **drum tight** and cut to length. Compressed flex loses capacity fast — a few percent of compression can cost a third of the airflow.',
                    'Cut the excess off. Do not coil the leftover in the attic "in case."',
                    'Bend radius at least **one duct diameter**. Tighter than that and a single 90° bend costs 50 equivalent feet.',
                    'Attach the inner liner to the collar with a **draw band on the liner**, seal with mastic, then bring the insulation and outer jacket over and band that separately.',
                    'Never run flex over a sharp edge or through a hole barely big enough for it.',
                ],
            },
            { h: 'Insulating' },
            {
                list: [
                    'Unconditioned attic or crawlspace: **R-8 minimum** (many codes now require R-8; check yours).',
                    'Conditioned basement: insulation is optional for energy, but useful for **condensation control** on cooling ducts and for noise.',
                    'Any duct carrying cold air through humid unconditioned space needs a **continuous vapor barrier**, taped at every seam, or it will rain on your ceiling.',
                ],
            },
            { h: 'Tools that earn their keep' },
            {
                list: [
                    '**Manometer**, dual port — non-negotiable for verification.',
                    '**Snips** (left, right, and straight), hand seamer, and crimpers.',
                    '**Hole saw or duct knife** for takeoff collars.',
                    '**Mastic and mesh tape**, plus a cheap brush you will throw away.',
                    '**Self-tapping screws**, 3/8" hex head. A magnetic impact driver bit.',
                    '**Anemometer** or flow hood for balancing. A vane anemometer plus a known free area is enough to get close.',
                ],
            },
            {
                note: {
                    kind: 'warn',
                    title: 'Wear gloves and eye protection',
                    body: 'Cut sheet metal edges are genuinely dangerous, and fiberglass insulation in an attic is worse. Long sleeves, gloves, safety glasses, and a respirator when handling insulation or working in an old attic. Kneel on plywood, not on the drywall between joists.',
                },
            },
        ],
    },

    /* ------------------------------------------------ */
    {
        id: 'verify',
        step: 8,
        nav: 'Step 8 · Verify',
        title: 'Measure it, or you only think it works',
        subtitle: 'Four readings that confirm the design and one that finds the leaks.',
        blocks: [
            {
                p: 'A design is a hypothesis. These measurements test it, and they take under an hour once the system is running.',
            },
            { h: '1. Total external static pressure' },
            {
                steps: [
                    'Drill two 3/8" test ports: one in the **return** just before the air handler (upstream of the filter and coil), one in the **supply** plenum just after.',
                    'Run the blower on the speed you designed for, with a clean filter and all registers open.',
                    'Read both ports with the manometer and add the magnitudes. That is your total external static pressure.',
                    'Compare it to the blower table. Higher than rated means the system is more restrictive than you planned.',
                    'Plug the ports with the supplied caps when you are done.',
                ],
            },
            {
                note: {
                    kind: 'secret',
                    title: 'The diagnostic pros run first, every time',
                    body: 'Measure the drop across each component individually — filter, coil, supply side, return side. The one with a drop far above its spec is your problem, and now you know exactly what to fix instead of guessing. Most "weak airflow" calls are one restrictive filter or one crushed flex run.',
                },
            },
            { h: '2. Airflow at the registers' },
            {
                p: 'A flow hood is ideal. A vane anemometer plus the register’s published free area gets you within about 10%, which is plenty for balancing. Compare each room to your Step 1 target and adjust the **trunk takeoff dampers** — starve the close rooms so the far ones get their share. Work from the closest room outward, and re-check the far rooms after every adjustment.',
            },
            { h: '3. Temperature split' },
            {
                p: 'Measure dry-bulb temperature in the return and the supply. Cooling should show roughly a **16 to 22°F** drop. A split much larger than that usually means airflow is too low; much smaller usually means low refrigerant charge or too much airflow. It is a crude check that catches gross errors fast.',
            },
            { h: '4. Room-to-room temperature' },
            {
                p: 'On a design day, no room should be more than about **2°F** from the thermostat. More than that and either the airflow split is wrong or that room’s load is bigger than you estimated.',
            },
            { h: '5. Find the leaks' },
            {
                list: [
                    'Run the blower and feel every joint with the back of your hand. You will find more than you expect.',
                    'A stick of incense makes leaks visible in dim light.',
                    'A **duct blaster** test gives you a real leakage number — many jurisdictions require one on new work anyway.',
                    'Sealed properly, total duct leakage should be a few percent of system airflow. Typical unsealed residential ductwork leaks **20 to 30%**.',
                ],
            },
            {
                note: {
                    kind: 'tip',
                    title: 'Write it down and leave it in the cabinet',
                    body: 'Tape a card inside the air handler door: design CFM, design friction rate, measured static pressure, measured CFM per room, damper positions, and the date. In five years that card is worth more than your memory, and the next person to touch the system will thank you.',
                },
            },
        ],
    },
];

export function findLesson(id) {
    return LESSONS.find((lesson) => lesson.id === id);
}
