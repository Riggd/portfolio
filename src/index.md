---
title: Derek Onay's Portfolio
layout: "base.njk"
templateEngineOverride: njk,md
---

<!-- Portfolios should highlight challenges you faced, how you collaborated with others, what you learned, and the personal/business/end-user impact of your work. -->
<div class="hero-top fade-in">

# Hi internet, I'm Derek. 
## Product designer focused on building accessible software, design systems, and mobile apps. Oh yeah, and I love a good pair of adidas sneakers.
<div class="choose-adventure">
    <a href="mailto:derek.onay@gmail.com">Email &#8599;</a>
    <a target="_blank" href="/assets/Resume-2024.pdf" download="DerekOnay-Resume.pdf">Resume &#8599;</a>
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
        <div class="projects-grid">
            {%- for project in collections.projects | reverse -%}
                <div id="{{ project.data.client}}" class="project-card" role="button" tabindex="0" onclick="location.href='{{project.url}}'">
                    <div class="image-wrap">
                        <img alt="Project image for {{ project.data.client }}" class="project-image" src="/assets/projects/{{ project.data.client }}/{{ project.data.image }}" />
                    </div>
                    <!-- <div class="icon">
                        <img src="/assets/logos/{{ project.data.logo }}" alt="{{ project.data.title }} app icon">    
                    </div> -->
                    <div class="title">{{ project.data.title }}</div>
                    <h2>{{ project.data.description }}</h2>
                </div>
            {%- endfor -%}
        </div>
    </section>

{% include "companieslist.njk" %}
</div>

<!-- Testimonials Add in eventually -->





