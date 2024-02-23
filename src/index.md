---
title: Derek Onay's Portfolio
layout: "base.njk"
templateEngineOverride: njk,md
---

<!-- Portfolios should highlight challenges you faced, how you collaborated with others, what you learned, and the personal/business/end-user impact of your work. -->
<div class="hero-top fade-in">

# Hi internet, I'm Derek. 
## Product designer focused on building accessible software, design systems, and mobile apps. Oh yeah, and I love a good pair of adidas sneaker.
<div class="choose-adventure">
    <a href="mailto:derek.onay@gmail.com" class="button">
        <!-- <div class="pulse"></div> &#9996; - Peace Sign -->
        Say hi! &#8599;
    </a>
    <!-- <a href="/" class="button-inverse">experience the chaos</a> -->
</div>
</div>


<div id="projects" name="projects" class="project-container fade-in">

<h2>Selected projects</h2>
<span style="color: var(--font-secondary);">Want to learn more about my approach to design? <a href="/process">see my process &#8599;</a></span>
<section>
    <div class="projects-grid">
        {%- for project in collections.projects -%}
            <div id="{{ project.data.client}}" class="project-card" role="button" tabindex="0" onclick="location.href='{{project.url}}'">
                <div class="image-wrap">
                    <img id="project-image" src="/assets/projects/{{ project.data.client }}/{{ project.data.image }}" />
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

<!-- <span class="icon-white wobble">
    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.485 6.485 2 12 2s10 4.485 10 10-4.485 10-10 10S2 17.515 2 12Zm1.5 0c0 4.685 3.815 8.5 8.5 8.5 4.685 0 8.5-3.815 8.5-8.5 0-4.685-3.815-8.5-8.5-8.5-4.685 0-8.5 3.815-8.5 8.5Zm9.25-4.5v6.69l2.22-2.22 1.06 1.06-3.145 3.145a1.245 1.245 0 0 1-.885.365c-.32 0-.64-.12-.885-.365L7.97 13.03l1.06-1.06 2.22 2.22V7.5h1.5Z" fill="#ffffff"/></svg>
</span> -->

<!-- Add as featured project -->
<!-- <div id="featured-project">
    <div class="header">
        <h3>featured.</h3>
        <a href="/projects" class="button-inverse">view more</a>
    </div>
    <div class="parent">
        <div class="div1">App image</div>
        <div class="div2"> 
            Wellkind by VMS Biomarketing
            </br>
            Dec 2022
        </div>
        <div class="div3">Logo </div>
        <div class="div4"> test</div>
        <div class="div5"> test</div>
    </div>
</div> -->

<!-- Testimonials Add in eventually -->
<!-- <section>

### What others say about my work

<div class="testimonial">
    <p>
    Derek was a wonderful designer to work with at Angie's List. He always wore a smile on his face despite all the tough challenges we had there. He's a human centered designer who obsesses over making informed decisions to create the best user experience. He also has an appetite for learning new skills and growing as a designer. If you want a designer who will be a good culture fit and has strong skills with an ability to grow and move forward, look no further.
    </p>
    <span>Adam Kendall</span>
    <span>Sr Design - Workday</span>
</div>

<div class="testimonial">
    <p>
    Derek was a wonderful designer to work with at Angie's List. He always wore a smile on his face despite all the tough challenges we had there. He's a human centered designer who obsesses over making informed decisions to create the best user experience. He also has an appetite for learning new skills and growing as a designer. If you want a designer who will be a good culture fit and has strong skills with an ability to grow and move forward, look no further.
    </p>
    <span>Adam Kendall</span>
    <span>Sr Design - Workday</span>
</div>
<div class="testimonial">
    <p>
    During my tenure at eFuse, Derek was the Product Designer attached to my team. It was obvious from the start that Derek wasn’t just simply a designer, he brought a wealth of experience and a business acumen that went way beyond just designing. His input during product discussions were hugely impactful to the direction the product took, even beyond just design.
    </p>
    <p>
    His deliverables to my team were always of the highest quality, and as I’m sure any engineer on my team would say, extremely well presented. Derek was consistently able to provide us all the information the team required to build out feature sets, usually with very little churn between teams. With that, it’s also worth calling out how dedicated Derek was to ensuring my team understood all the nuances of a design, via jumping on calls and walking them through the design during development if there were questions. Derek always ensured the work he did for our team elevated our velocity, never hindering it.
    </p>
    <span>Jason Doyle</span>
    <span>Sr. Engineering Manager - eFuse</span>
</div>

</section> -->






