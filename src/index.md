---
title: Derek Onay's Portfolio
layout: "base.njk"
templateEngineOverride: njk,md
---

<!-- Portfolios should highlight challenges you faced, how you collaborated with others, what you learned, and the personal/business/end-user impact of your work. -->
<div class="hero-top fade-in">
    <div class="intro">
        <p style="color: var(--button-primary)">Hey internet, I'm</p>
        <h1>Derek Onay</h1>
        <h2>Product designer building accessible software, design systems, and web products. Oh, and I love a good pair of adidas sneakers.</h2>
        <!-- Testing Spotify implementation -->        
        {# {% set recentTrack = spotify | getTrack(req) %}  #}
        <section>
            <div class="now-playing">
                <div class="icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                {{ lastfm.recentSong }} - {{ lastfm.artist }}
            </div>
        </section>
    </div>
<div class="choose-adventure">
    <a href="mailto:derek.onay@gmail.com">Email &#8599;</a>
    <a target="_blank" href="/assets/resume-2024.pdf" download="DerekOnay-Resume.pdf">Resume &#8599;</a>
    <a target="_blank" href="https://www.linkedin.com/in/derek-onay/">LinkedIn &#8599;</a>
    <!-- <a href="/" class="button-inverse">experience the chaos</a> -->
</div>
</div>


<div id="projects" name="projects" class="project-container fade-in">
    <div class="top">
        <h2>Work I'm proud to share</h2>
        <span style="color: var(--font-secondary);">Want to learn more about my approach to design? <a href="/process">Read about my process</a></span>
    </div>
    <section>
        {% from "macros/project-card.njk" import projectCard %}
        <div class="projects-grid">
            {%- for project in collections.projects | reverse -%}
                {{ projectCard(project) }}
            {%- endfor -%}
        </div>
    </section>

{% include "companieslist.njk" %}
</div>