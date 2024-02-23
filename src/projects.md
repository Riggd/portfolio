---
title: The Work
layout: "base.njk"
templateEngineOverride: njk,md
---

<div id="projects" name="projects" class="projects-container fade-in">

<h1 style="font-size:4rem; font-weight:600; margin-top:35vh">Selected projects</h1>
<span style="color: var(--font-secondary);">Want to learn more about my approach to design? <a href="/process">see my process &#8599;</span>
<section>
    <div class="projects-grid">
        {%- for project in collections.projects -%}
            <div id="{{ project.data.client}}" class="project-card" role="button" tabindex="0" onclick="location.href='{{project.url}}'">
                <div class="image-wrap">
                    <img id="project-image" src="/assets/projects/{{ project.data.client }}/{{ project.data.image }}" />
                </div>
                <div class="icon">
                    <img src="/assets/logos/{{ project.data.logo }}" alt="{{ project.data.title }} app icon">
                    <div class="title">{{ project.data.title }}</div>
                </div>
                <h2>{{ project.data.description }}</h2>
            </div>
        {%- endfor -%}
    </div>
</section>

{% include "companieslist.njk" %}
</div>