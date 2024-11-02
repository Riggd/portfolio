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
            I've spent the last 9 years as a product designer and product manager to help companies drive outcomes to their business. Having worked in both small startups and large orgs, I distill complex problems into design solutions that are clear, accessible, and engaging.
        </h2>
        <h2>
            My background in computer science and soccer coaching, allow me to collaborate seamlessly with product and engineering teams. Doing something alone is impressive, but with a team? Man, that's what makes it fun! 
        </h2>
        <h2>
            I spend my free time playing soccer, attending concerts with my partner, and obsessing over which pair of adidas sneakers I'll be buying next. My current favorite are a nod to Wes Anderson's film, The Life Aquatic with Steve Zissou. I write some code here and there to keep me sharp, check below for what I'm using to build this site.
        </h2>
    </div>

<section class="fade-in">
{% include "resume.njk" %}
</section>

<section class="fade-in">
{% include "capabilities.njk" %}
</section>

<section class="fade-in">
<b>Over-engineered, because I that's how you learn</b>

- built with <a href="https://www.11ty.dev/" target="_blank">Eleventy</a>
- deployed on <a href="https://www.netlify.com/" target="_blank">Netlify</a> 
- hosted on <a href="https://pages.github.com/" target="_blank">GitHub Pages</a>

- Last commit {% convertTime github.lastCommit %}
</section>