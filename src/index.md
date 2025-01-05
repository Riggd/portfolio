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
        <a href="mailto:derek.onay@gmail.com">Get in touch &#8599;</a>
        <a target="_blank" href="/assets/Resume-2024.pdf" download="DerekOnay-Resume.pdf">Resume &#8599;</a>
        <a target="_blank" href="https://www.linkedin.com/in/derek-onay/">Connect with me &#8599;</a>
        <!-- <a href="/" class="button-inverse">experience the chaos</a> -->
    </div>
</div>


<div id="projects" name="projects" class="project-container fade-in">
    <div class="top">
        <h2>Work I'm proud to share</h2>
        <span style="color: var(--font-secondary);">Want to learn more about my approach to design? <a href="/process">Read about my process</a></span>
    </div>
    <section>
        <div class="projects-grid">
            {%- for project in collections.projects | reverse -%}
                <a id="{{ project.data.client}}" class="project-card fade2" tabindex="0" href="{{ project.url }}">
                    <div class="image-wrap">
                        <img alt="Project image for {{ project.data.client }}" class="project-image" src="/assets/projects/{{ project.data.client }}/{{ project.data.image }}" />
                    </div>
                    <div class="title">{{ project.data.title }}</div>
                    <h2>{{ project.data.description }}</h2>
                </a>
            {%- endfor -%}
        </div>
    </section>

<!-- This is useless and should be refactored -->
{% include "companieslist.njk" %}

{%- for thought in collections.thoughts -%}
<a href="{{ thought.url }}">
{%- endfor -%}
</div>




