---
title: Field Notes
layout: "base.njk"
templateEngineOverride: njk
description: An assortment of daily findings and discoveries on the web
pagination:
  data: collections.fieldnotes
  size: 20
  alias: notes
  reverse: true
---
<div class="fade-in field-notes">
    <div class="top">
        <h1 style="font-size:4rem; font-weight: 600; margin:0;">Field Notes</h1>
        <h2>An assortment of daily findings and discoveries on the web.</h2>
    </div>

    <section class="notes-content">        
        <div class="field-notes-container">
            {% set lastDate = "" %}
            {% for note in notes %}
                {% set currentDate = note.date.toISOString().split('T')[0] %}
                <div class="field-note-entry">
                    <div class="field-note-date">
                        {% if currentDate != lastDate %}
                            {{ note.date | convertTime }}
                        {% endif %}
                    </div>
                    <div class="field-note-items">
                        <div class="field-note-item">
                            <a href="{{ note.data.link }}" target="_blank" class="field-note-link">{{ note.data.title }}</a>
                            <div class="field-note-text">
                                {{ note.templateContent | safe }}
                            </div>
                        </div>
                    </div>
                </div>
                {% set lastDate = currentDate %}
            {% endfor %}
        </div>

        {% if pagination.href.next or pagination.href.previous %}
        <nav class="pagination-nav" style="margin-top: 4rem; display: flex; gap: 2rem; font-family: 'Inconsolata', monospace;">
            {% if pagination.href.previous %}
                <a href="{{ pagination.href.previous }}">← Newer Notes</a>
            {% endif %}
            {% if pagination.href.next %}
                <a href="{{ pagination.href.next }}">Older Notes →</a>
            {% endif %}
        </nav>
        {% endif %}
    </section>
</div>
