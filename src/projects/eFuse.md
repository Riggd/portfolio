---
title: eFuse Twitch Extension
description: "Improving fan engagement through Twitch extension"
problem: ""
client: eFuse
image: eFuse.png
logo: efuse.png
responsibilities:
    - Research support
    - Twitch extension design
    - Development support    
client-url: https://www.efuse.gg/
roles: 
    - Product Design Lead
team:
    - Austin May, Product Manager
    - Jay Blumenthal, Lead Researcher
    - Ian Kunser, Engineer
duration: May 2023 - September 2023
---
<section>

### Overview
eFuse's existing [eRena Leaderboard Extension](https://dashboard.twitch.tv/extensions/7n05t3351hle0tx07a4uejyjmk8aay-1.4.6) was limited in functionality, and difficult for tournament operators to set up. 

I delivered research and designs to capture an additional revenue stream for the business, while improving the fans overall engagement with eFuse by
- adding support for additional bracket types

- introducing event information contextually in Twitch streams

- driving impressions to sponsors and advertisers through improved ad placement

- overhauling the visual design of the extension
</section>

<section>

### Hypothesis
By providing tournament content to the Twitch stream, fans would be more likely to engage with sponsored content. Additionally, prioritizing event information first, could avoid ad-blindness and thus increase the likelihood of a fan becoming a buyer for our sponsors.
</section>
<section>

### Exploration
Assuming we could rebuild the Twitch Extension to deliver anything a fan might need, our competitive analysis suggested we included features for viewing full bracket visualizations, polls, and team details. 

![Screenshot of the old, clunky eFuse Twitch extension.](/assets/projects/eFuse/old-extension.png){data-zoomable}
*The old extension was clunky and provided a very little information to a fan* 

![Early design mockups showing polls, team details, and bracket visualizations.](/assets/projects/eFuse/efuse-old-mocks.png){data-zoomable}
*Initial design explorations included polls, team details, and bracket visualization*
</section>
<section>

### Limited time =/= abandoning research
Due to the time constraints of this project, we focused our research efforts on testing completed designs, rather than generative research. There was an existing extension which needed improved to support other business goals. My role as research support for this project was to help deliver a discussion guide and hypothesis for what we wanted to learn from the 6 user interviews we conducted. 
<br/><br/>

#### Research Methodology
Myself and the Research Lead, compiled a discussion guide to answer questions about what information is most important about an event and the streamer playing, so that the designs could accurately reflect those user needs. 

The Twitch platform itself makes discoverability of any extension a challenge. This led to removing functionality early on which would have provided fans the ability to participate in polls and view the visual bracket format, and rather focus on two core ideas: 
- What is the event? What's the format? Prizing?

- How is this streamer performing? Are they winning/losing/progressing to future stages?
<br/><br/>

#### Participants
- 4 Tournament Operations

- 2 Broadcast Technicians

Both of these user personas are responsible for providing fans and players of the events with a best-in-class experience, and thus their insights helped inform direction on exactly what information about an event could be beneficial to display within an updated Twitch extension.
<br/><br/>

#### Results
The research led to cutting scope such as match & player details, polls, and team features early on to focus on **Event Details** and **Standings/Results**. The rest of the information could be found via linking back to the core product, and allows the extension to stay focused.

From all 6 interviews we learned:
- Fans and enthusiasts prefer to stay on stream vs leaving for additional content

- Providing event and standings content in the twitch extension helps answer the most common questions asked by fans during a broadcast

- All 6 participants preferred the new solution to what they have at their disposal today
</section>
<section>

### And so, we build.
I worked closely to define requirements directly with the engineers on the project, as the Twitch documentation for extensions is limited. The primary focus here was to develop a standard for how eFuse twitch extensions should operate and look. 

Given the technical constraints of this being a Twitch extension, we were unable to use our existing design system. This led to a more hands-on design review process where I was reviewing development work at every defined milestone for the project.

A decision I made early on to reduce development cost was to design a single but flexible component that all other bracket types, other than Point Race standings, could share. Providing links out to our core product would allow fans any additional information about the event that wasn't shown on Twitch. This decision allowed for the engineers to quickly stand up the extension, without needing to build 5 custom event views.
</section>
<section>

### That's great Derek, but what did the fans think?
This project is currently being launched, but you can check out the experience for yourself below. You can view additional event types by tapping on the Leaderboard/Results title.
<iframe title="eFuse Twitch Extension Figma Prototype" style="border: 1px solid rgba(0, 0, 0, 0.1);" width="100%" height="600" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FmauJERpc2w2i6EteeTsLd0%2FTwitch-Extension%3Fpage-id%3D226%253A143151%26type%3Ddesign%26node-id%3D226-157507%26viewport%3D401%252C-120%252C0.05%26t%3Dx4POUBsirglu2NmA-1%26scaling%3Dmin-zoom%26starting-point-node-id%3D226%253A157507%26mode%3Ddesign" allowfullscreen></iframe>
</section>