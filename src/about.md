---
title: My Process
layout: "base.njk"
templateEngineOverride: njk,md
---
<div class="about">
    <!-- <img src="/assets/profile-thumb.png" alt="Personal Photo Small" width=250 height=250> -->
    <!-- <img src="/assets/headshot.jpg" alt="Personal Photo Small" width=300 style="border-radius:1rem;"> -->
    <div class="top fade-in">
        <div class="headshot">&nbsp;</div>
        <h1 style="font-size:4rem; font-weight: 600; margin:0;">About Me</h1>
        <h2>
            I'm a product designer with 9 years of experience driving business outcomes through design, both within startups and large organizations. My expertise lies in transforming complex problems into intuitive, accessible, and engaging user experiences. I advocate for research and data to drive product strategy. With a background in computer science and a collaborative approach honed through soccer coaching, I work seamlessly alongside product and engineering teams to deliver exceptional results.
        </h2>
        <h2>
            Outside of work, I'm an avid soccer player, concertgoer, and sneaker enthusiast (my current favorites are inspired by Wes Anderson's The Life Aquatic). I also enjoy coding to stay up-to-date with the latest technologies – check out what I've used to build this site below.
        </h2>
    </div>

<section class="fade-in">
{% include "resume.njk" %}
</section>

<section class="fade-in">
{% include "capabilities.njk" %}
</section>

<section>
<b>This site <strike>was likely</strike> <b>may</b> be over engineered...</b>

- built with <a href="https://www.11ty.dev/" target="_blank">Eleventy</a>
- deployed on <a href="https://www.netlify.com/" target="_blank">Netlify</a> 
- hosted on <a href="https://pages.github.com/" target="_blank">GitHub Pages</a>

- Last commit {% convertTime github.lastCommit %}
</section>