---
title: The Work
layout: "base.njk"
templateEngineOverride: njk,md
---

<div id="projects" name="projects" class="projects-container fade-in">

# Work Samples
A few of my past works & projects. If you would like to discuss further please <a href="mailto:derek.onay@gmail.com"> get in touch</a>.
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
</div>

{% include "companieslist.njk" %}