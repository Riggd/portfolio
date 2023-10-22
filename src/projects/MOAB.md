---
title: MOAB Design System
description: "An extension of the core erena product to provide a better esports fan expereince, by bringing the content directly to the streams people are watching."
problem: ""
client: eFuse
image: eFuse.png
logo: efuse-logo.png
responsibilities:
    - System Education & Governance
    - Component Maintanence & Additions

roles: 
    - Product Designer
team:
    - Ryan Perdue, Product Manager
duration: May 2023 - September 2023
---
I most recently worked with eFuse, an esports startup with a mission to change lives through gaming, to help with the Design System adoption, education, and governance, as well as design new features to support the erena tournament platform. 

My role as a Sr. Product Designer had me work closely with another product designer, and engineers to start transitioning from just a UI library to a robust system maintained in code, and saving time for the business.

Design System Team
2 Designers / 3 Engineers
The design system team was cross functional design-led effort. Every team member also was responsible for delivering product functionality. Our biggest organization problem was adoption and transitioning components from design -> engineering.  


eFuse products intended to use the system:
erena, tournament platform
esports.gg, gaming news platform
mynt.gg, web3 community engagement platform
sidekick.gg, streamer tools
Core Design System Issues
Design solutions aren’t aligned across products. Users didn’t feel they were still using an eFuse product when moving from esports.gg > erena, for instance.
[Visual of headers & nav across Mynt, Esports.gg, Erena]
Styled components were implemented inconsistently in the code, and caused a diminished user experience
[Stat of # of custom implementations]
[Biggest culprits]
Design reviews were spent giving feedback on visual inconsistencies vs whether or not the proper solution was in place
Most of the MOAB design system had yet to be built into code, due to lack of resources and overarching implementation process

Design System Structure
The MOAB design system is structured with a core foundation library, a Web UI library, and then product-specific component libraries 
[Visual breakdown of systems & what’s inside, look at the Ford example from Config]
It’s worth mentioning, this decision to split Web components from product specific was to allow for custom implementations across different products that served different users and functions, while still providing consistency within the larger design style and visual language
My contributions
Design System Governance (2 types, ad-hoc vs intentional changes)
Design Review Sessions (ad-hoc)
Goals
Ensure consistency across 4 products
Identify areas for exploration vs adoption
Educate & provide documentation to designers to help point the 
Add/Edit existing components process (intentional)
[Visual of diagram to add new component]
Core components vs Product-specific component
Goal: Allow teams to move quickly while keeping core DS goals in mind
Testing process
With a small team, we had to be flexible in how we introduced new components

What worked well
We built out process & began educating Product & Engineering leadership of the value the system would provide
We reduced custom styled components for buttons and 

Why wasn’t everything sunshine & rainbows
New product launches delayed many new components from being realized in the Storybook efui library
Team Reorgs & Product Launches, slowed new development 
Product wasn’t fully integrated in the DS team, so priority for component updates was always behind other work even if development would’ve been sped up on all future features had there been time to build components
