---
# eleventyExcludeFromCollections: true
title: eFuse Design System
description: "Speeding up engineering by bringing 4 products under 1 roof"
problem: ""
client: MOAB
image: moab.png
logo: moab.svg
responsibilities:
    - System Education & Governance
    - Component Creation & Maintenance 
roles: 
    - Product Design
team:
    - Ryan Perdue
duration: May 2023 - September 2023
wins: 
    - Established governance & maintenance process
    - Began company design system education
    - Reduced custom styled components in the code by roughly 15%. Primarily buttons and custom typography.
issues:
    - Launching to every team wasn't going to happen overnight
    - New product launches cause delays to any design system work  
    - Team reorgs, slowed new development 
    - We had to be okay with components living outside of the system until teams could pick up the work
---
<section>

### Overview
eFuse, an eSports startup, had an existing design system but lacked the process and adoption necessary to make an impact on development cost and design speed for both products and users. 
<br/><br/>

#### Fragmented & expensive, our design system needed to solve some core issues
- Engineering teams were rebuilding components for new features

- Updates to the existing system were scattered across slack, clickup, and word of mouth

- cross-product customers were provided visual experiences that didn't align with eFuse brand
</section>


<section>

### My Role
For the design system project, I collaborated with the design system lead, and engineers to transition from a Figma component library to a robust system maintained in Storybook to save time and resources for eFuse. 

My focus was
- maintaining existing and adding new components to the system

- driving developer adoption, education, and governance across

- establishing a prioritization process & Kanban board for future design system needs

</section>
<section>

### Core Problems
- Design solutions aren’t aligned across products. For example, users didn’t feel they were still engaging with an eFuse product when moving from esports.gg to eRena or mynt.gg.

- Styled components were implemented inconsistently in the code, and caused a diminished user experience

- Design reviews were spent giving feedback on visual inconsistencies vs whether or not the proper solution was in place

- Most of the MOAB design system had yet to be built into code, due to lack of resources and overarching implementation process
</section>
<section>

### eFuse product ecosystem
- eRena, tournament platform

- esports.gg, gaming news platform

- mynt.gg, web3 community engagement platform

- sidekick.gg, streamer tools
</section>
<section>

![MOAB Design System Structure](/assets/projects/moab/structure.svg){data-zoomable}
*Breakdown of the design system structure*
### Design System Structure
The MOAB design system is structured with a core foundation library, style libraries, a Web UI library, and then product-specific component libraries.

The decision to split Web components from product specific was to allow for custom implementations across different products that served different users and functions, while still providing consistency within the larger design style and visual language.
</section>

<section>

### MOAB Design System Governance

#### Design System Updates
- Built intake form for requests to add to design system backlog

- Built out Kanban board to track progress of system updates

- Worked with Marketing & Social teams to establish voice & tone guidelines

- Build out process to allow any designer to understand whether or not a new component needs to live in the system or be a part of the product-specific library

#### Changed the design review process 
- Increased length, but lowered cadence to allow the team to dive deep into projects to ensure consistency across the four products

- Opened up dedicated time to explore and test new or updated components

- Used additional time to educate & provide documentation to designers to aid in pushing adoption within their squads  

</section>

<section>

#### Component Samples
<div class="image-grid">
    <div class="column">
        <img src="/assets/projects/moab/button-spec.svg" alt="Button specs documentation" data-zoomable />
        <img src="/assets/projects/moab/anatomy.svg" alt="Button anatomy documentation" data-zoomable />
        <img src="/assets/projects/moab/button-layout.svg" alt="Button layout documentation" data-zoomable />
    </div>
    <div class="column">
        <img src="/assets/projects/moab/cards.svg" alt="Documentation showing variations of card components" data-zoomable />
    </div>
    <div class="column">
        <img src="/assets/projects/moab/Application.png" alt="Example application screen using the design system" data-zoomable />
        <img src="/assets/projects/moab/Alerts.png" alt="Example of Alert component documentation" data-zoomable />
    </div>
</div>
</section>
<!-- 
<section>

## Samples
<!-- Add {data-zoomable} to end of all mkdown image blocks, or abstract it to global for all images to have it appended 
![MOAB Design System Button](/assets/projects/moab/button-spec.svg)
*Button components*

![MOAB Design System Button Anatomy](/assets/projects/moab/anatomy.svg)
*Button anatomy*

![MOAB Design System Button Layout](/assets/projects/moab/button-layout.svg)
*Button layout*

<!-- 
![MOAB Design System Cards](/assets/projects/moab/cards.svg)
*Card components* --> 