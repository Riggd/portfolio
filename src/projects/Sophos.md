---
title: Sophos Threat Graph
description: "Increased Security Analyst threat hunting speed by 50%"
client: sophos
responsibilities:
    - Application design
    - Component design
    - Development handoff
    - Sales prototype
    - Product Strategy
image: ThreatGraph.png
logo: AL.png
client-url: ""
roles: 
    - Product Design Lead
team: 
    - Jake Trowbridge, PM
    - Adrian Kwak, PM
duration: November 2023 - February 2024
wins: 
    - win
issues:
    - learnings
---

<section>

### Overview
Sophos, a leading cybersecurity company, contracted with our Innovatemap team to improve the speed at which security analysts can manage threats and detections for their clients.

Analysts are under pressure to discover root cause as fast a possible. The current MDR tools experience 
- requires analysts to use 3 different software solutions

- do not enough provide information to determine root cause quickly

- does not match the existing platform 

</section>

<section>

### Our Hypothesis 
## By providing a single tool for analyzing process data, analysts will speed up their root cause analysis, and thus improve customer satisfaction. 
</section>

<section>
<img src="/assets/projects/sophos/sophos-old.png" alt="UI sample of the original product" data-zoomable />

## Existing Tools
Speaking with the security analysts to understand how and where we could improve their threat hunting tasks. I uncovered the following core issues and needs:

1. Limited information in tree search 
    - no distinction on whether process was in the area of attack 
    - no MITRE classification
    - no impacted entities info
2. Selected process data requires horizontal scrolling, losing context to potentially important information
3. Event data was read-only, no ability to understand which event was the key event 
4. Global Search provides quick ability to pivot threat hunt, and shouldn't be lost in any sort of redesign effort
</section>
<section>
<img src="/assets/projects/sophos/fullgraph.png" alt="UI sample of a threat graph interface" data-zoomable />

### Impact
I designed a new Threat Hunting experience in the Sophos Managed Detection and Response platform which:
- reduced software needs from 3 platforms to 1 

- reduced threat hunt duration by ~50% on average

- provided tools for discovering and searching for additional IOCs

- enabled analysts to quick pivot to MDR search tool for all key event data


</section>
<section>

### Additional Product Designs
<div class="image-grid">
    <div class="column">
        <img src="/assets/projects/sophos/processtree.png" alt="Process tree UI interface" data-zoomable />
        <img src="/assets/projects/sophos/cmdline.png" alt="Interface sample of the command line UI" data-zoomable />
        <img src="/assets/projects/sophos/timeline.png" alt="Interface sample of the Timeline UI" data-zoomable />
    </div>
    <div class="column">
        <img src="/assets/projects/sophos/processnodes.png" alt="Interface sample of the process node interaction" data-zoomable />
        <img src="/assets/projects/sophos/search.png" alt="Interface sample of the search UI" data-zoomable />        
    </div>
    <div class="column">
        <img src="/assets/projects/sophos/legend.png" alt="Interface sample of the canvas legend UI" data-zoomable />   
        <img src="/assets/projects/sophos/recenter.gif" alt="Animated example of the recenter canvas animation" data-zoomable />
    </div>
</div>
</section>
