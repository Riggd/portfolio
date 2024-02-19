---
title: eFuse Twitch Extension
description: "Improving eSports tournament fan engagement by 5% through Twitch"
problem: ""
client: eFuse
image: eFuse.png
logo: efuse.png
responsibilities:
    - Twitch Extension
    - Research Support
    - Design System Creation
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

## Problem
The existing Twitch extension ([Link to Extension](https://dashboard.twitch.tv/extensions/7n05t3351hle0tx07a4uejyjmk8aay-1.4.6)) did not support all bracket types, and was unable to be used as a tool to drive more user engagement to marketing and sponsorship placements across the eRena ecosystem. 

### Old Extension
![Old Extension](/assets/projects/efuse/old-extension.png)

</section>
<section>

## Goals
- Add support for additional bracket types (Round Robin, Double/Single Elimination, Swiss, and Point Race)

- Increase impressions for Event Sponsors and advertisers through additional sponsorship placements and link-outs. 

- Increase engagement from fans and enthusiasts viewing events hosted by eFuse or influencers participating in events. 

- Improve visual design & content being displayed in the twitch extension
</section>
<section>

## Initial Exploration
Assuming we could rebuild the Twitch Extension based on anything a fan or enthusiast would desire, our competitive analysis suggested we included features for viewing full bracket visualizations, polls, and team details. You can see some of the explorations below:

![Initial Mocks](/assets/projects/efuse/efuse-old-mocks.png)
*Initial designs that included polls, team details, and bracket visualization*
</section>
<section>

## The Research
Due to the time constraints of this project, we focused our research efforts on testing completed designs, rather than generative research. There was an existing extension which needed improved to support other business goals. My role as research support for this project was to help deliver a discussion guide and hypothesis for what we wanted to learn from the 6 user interviews we conducted. 
<br><br>

### Hypothesis
Our hypothesis was fans wanted more information about the event the streamers were participating in without having to leave Twitch.com. Additionally, if we put too much emphasis on sponsors we will cause users ad-blindness and thus not increase sponsor impressions.
<br><br>

### Research Methodology
Myself and the Research Lead, compiled a discussion guide to answer questions about what information is most important about an event and the streamer playing, so that the designs could accurately reflect those user needs. 

The Twitch platform itself makes discoverability of any extension a challenge. This led to removing functionality early on which would have provided fans the ability to participate in polls and view the visual bracket format, and rather focus on two core ideas: 
- What is the event? What's the format? Prizing?

- How is this streamer performing? Are they winning/losing/progressing to future stages?
<br><br>

### Participants
- 4 Tournament Operations

- 2 Broadcast Technicians

- 0 Fans/Enthusiasts, due to time constraints

Both of these user personas are responsible for providing fans and players of the events with a best-in-class experience, and thus their insights helped inform direction on exactly what information about an event could be beneficial to display within an updated Twitch extension.
<br><br>

### Results
The research led to cutting scope such as match & player details, polls, and team features early on to focus on **Event Details** and **Standings/Results**. The rest of the information could be found via linking back to the core product, and allows the extension to stay focused.

From all 6 interviews we learned:
- Fans and enthusiasts prefer to stay on stream vs leaving for additional content

- Providing event and standings content in the twitch extension helps answer the most common questions asked by fans during a broadcast

- All 6 participants preferred the new solution to what they have at their disposal today
</section>
<section>

## The build phase
I worked closely to define requirements directly with the engineers on the project. The primary focus here was to  Since this was a Twitch Extension, we were unable to use our existing design system. This led to a more hands-on design review process where I was reviewing development work at all defined milestones. 

A decision I made early on to reduce development cost was to design a single model for every bracket type other than Point Race standings, and then provide links out to our core product which would provide fans any additional information or views they would want. This allowed for the engineers to quickly stand up the extension, without needing to build a view for all 5 event types.
</section>
<section>

## That's great Derek, but what did the fans think?
This project is currently being launched, and thus hasn't been utilized in an event yet. Next steps on this project would be to look at our analytics we built in to see if fans were engaging first with the extension, and then looking specifically at the amount of impressions we were delivering to sponsors.
</section>
<section>

## Check out the interactive prototype
You can view all of the event type interfaces by tapping on the Leader board/Results title within the prototype.
<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="100%" height="600" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FmauJERpc2w2i6EteeTsLd0%2FTwitch-Extension%3Fpage-id%3D226%253A143151%26type%3Ddesign%26node-id%3D226-157507%26viewport%3D401%252C-120%252C0.05%26t%3Dx4POUBsirglu2NmA-1%26scaling%3Dmin-zoom%26starting-point-node-id%3D226%253A157507%26mode%3Ddesign" allowfullscreen></iframe>
</section>
<section>


</section>