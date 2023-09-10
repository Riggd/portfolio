---
title: Event Leaderboard Twitch Extension
description: "An extension of the core erena product to provide a better esports fan expereince, by bringing the content directly to the streams people are watching."
problem: ""
client: eFuse
client-url: https://www.efuse.gg/
roles: [ Product Design Lead, Research Support ]
team:
    - Austin May, Product Manager
    - Jay Blumenthal, Lead Researcher
    - Ian Kunser, Engineer
---

### Role 
{% for role in roles %}
- {{ role }}
{% endfor %}

### Problem
The existing Twitch extension ([Link to Extension](https://dashboard.twitch.tv/extensions/7n05t3351hle0tx07a4uejyjmk8aay-1.4.6)) did not support all bracket types, and was unable to be used as a tool to drive more user engagment to marketing and sponsorship placements across the erena ecosystem. 

### Goals
- Increase engagement from fans and enthusiats viewing events hosted by eFuse or influencers participating in events. 

- Improve the look and feel of the twitch extension to support all bracket types (Round Robin, Double/Single Elimination, Swiss, and Point Race)

- Increase impressions for Event Sponsors and advertisers through additional sponsorship placements and link-outs. 

### Old vs New
<div class="old-new-container">

![Old Extension](/assets/projects/twitch/old-extension.png)
![New Extension](/assets/projects/twitch/extension.png)
![New Extension](/assets/projects/twitch/extension-standings.png)
</div>


### Research Methology
Due to the time contraints of this project, we focused our research efforts on testing completed designs, rather than generative research. There was an existing extension which needed improved to support other business goals. My role as research support for this project was to help deliver a discussion guide and hypothesis for what we wanted to learn from the 6 user interviews we conducted. 

Our hypothesis was fans wanted more information about the event the streamers were participating in without having to leave Twitch.com. Additionally, if we put too much emphasis on sponsors we will cause users ad-blindness and thus not increase sponsor impressiosns.

Myself and the Research Lead, compiled a discussion guide to answer questions about what information is most important about an event and the streamer playing, so that the designs could accurately reflect those user needs. 

The Twitch platform itself makes discoverability of any extension a challenge. This led to removing functionality early on which would have provided fans the ability to participate in polls and view the visual bracket format, and rather focus on two core ideas: 
- What is the event?

- How is this streamer performing? Are they winning/losing/progressing to future stages? 

#### Research Participants
- 4 Tournament Operations
- 2 Broadcast Technicians

The deadline for this project didn't allow for recruiting and paying external fans/enthusiats to participate. 

Both of these user personas are responsible for providing fans and players of the events with a best-in-class experience, and thus their insights helped inform direction on exactly what information about an event could be benficial to display within an updated Twitch extension.

#### Research Results
The research led to cutting scope early on to focus on just **Event Details** and **Standings/Results**.

From all 6 interviews we learned:
- The content being displayed was an enhancement to the existing extension

- Providing this content in the extension would answer the most commmon questions asked by fans during a broadcast

- 6 of 6 prefered the solution to what they have at their disposal today

### The build phase
This project moved on into the **Build Stage** where I worked closely to define requirements directly with the engineers on the project. Since this was a Twitch Extension, we were unable to use our existing design system. This led to a more hands-on design review process where I was reviewing development work at all defined milestones. 

A decision I made early on to reduce development cost was to design a single model for every bracket type other than Point Race standings, and then provide links out to our core product which would provide fans any additional information or views they would want. This allowed for the engineers to quickly stand up the extension, without needing to build a view for all 5 event types.

### That's great Derek, but what did the fans think?
This project is currently being launched, and thus hasn't been utilized in an event yet. Next steps on this project would be to look at our analytics we built in to see if fans were engaging first with the extension, and then looking specifically at the amount of impressions we were delivering to sponsors.

### Figma Prototype
You can view all of the event type interfaces by tapping on the Leaderboard/Results title within the prototype.
<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="600" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FmauJERpc2w2i6EteeTsLd0%2FTwitch-Extension%3Fpage-id%3D226%253A143151%26type%3Ddesign%26node-id%3D226-157507%26viewport%3D401%252C-120%252C0.05%26t%3Dx4POUBsirglu2NmA-1%26scaling%3Dmin-zoom%26starting-point-node-id%3D226%253A157507%26mode%3Ddesign" allowfullscreen></iframe>