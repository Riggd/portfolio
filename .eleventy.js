import 'dotenv/config';
import UpgradeHelper from "@11ty/eleventy-upgrade-help";
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import fs from "fs";

import { year, convertTime } from './src/_11ty/shortcodes.js';
import { convertTime as convertTimeFilter } from './src/_11ty/filters.js';
import { buildJs, compileSass } from './src/_11ty/build-assets.js';

export default function (eleventyConfig) {

    // Add build events
    eleventyConfig.on('eleventy.before', async () => {
        await buildJs();
        compileSass();
    });

    eleventyConfig.addGlobalData("env", process.env);

    // Passthrough copy
    eleventyConfig.addPassthroughCopy("src/assets");

    // Shortcodes
    eleventyConfig.addShortcode('year', year);
    eleventyConfig.addShortcode('convertTime', convertTime);

    // Filters
    eleventyConfig.addFilter('convertTime', convertTimeFilter);

    // Markdown Configuration
    const markdownItOptions = {
        html: true,
        breaks: false,
        linkify: true
    };

    const markdownLib = markdownIt(markdownItOptions).use(markdownItAttrs);
    eleventyConfig.setLibrary('md', markdownLib);

    // Plugins
    eleventyConfig.addPlugin(UpgradeHelper);
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        extensions: "html",
        formats: ["webp"],
        widths: ["auto"],
        defaultAttributes: {
            loading: "lazy",
            sizes: "100vw",
            decoding: "async",
        },
    });

    // Development Settings
    if (process.env.ELEVENTY_RUN_MODE === "serve") {
        eleventyConfig.setBrowserSyncConfig({
            callbacks: {
                ready: function (err, bs) {
                    bs.addMiddleware("*", (req, res) => {
                        const content_404 = fs.readFileSync('public/404.html');
                        res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
                        res.write(content_404);
                        res.end();
                    });
                }
            }
        });
    }

    return {
        dir: {
            input: "src",
            output: "public",
            includes: "_includes",
            layouts: "_layouts"
        },
    };
};
