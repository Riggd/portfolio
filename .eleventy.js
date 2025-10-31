import 'dotenv/config';
import UpgradeHelper from "@11ty/eleventy-upgrade-help";
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import esbuild from 'esbuild';
import fs from "fs";
import path from "path";
import * as sass from "sass";

export default function(eleventyConfig) {

    // Add a build event to trigger esbuild
    eleventyConfig.on('eleventy.before', async () => {
        await esbuild.build({
        entryPoints: ['src/assets/js/index.js'],
        bundle: true,
        outfile: 'public/assets/js/bundle.js',
        sourcemap: true, // Optional: for easier debugging
        minify: process.env.ELEVENTY_RUN_MODE === 'build', // Minify only in production
        });
    });
    
    eleventyConfig.addGlobalData("env", process.env);

    // Passthrough copy the entire assets directory to the output.
    // This will copy CSS, images, and any other static files.
    // JavaScript files are handled separately by the esbuild step.
    eleventyConfig.addPassthroughCopy("src/assets");
    

    // Adding Spotify access
    /* eleventyConfig.addFilter("getTrack", async function(spotifyData, req) {
        const recentTrack = await getRecentlyPlayedTrack(req);
        return recentTrack;
    }); */

    eleventyConfig.addShortcode('year', () => {
        return `${new Date().getFullYear()}`;
    });

    eleventyConfig.addShortcode('convertTime', (UTCDate) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
        return `${new Date(UTCDate).toLocaleDateString(undefined,options)}`;
    });
    
    const markdownItOptions = {
        html: true,
        breaks: false,
        linkify: true
    };

    const markdownLib = markdownIt(markdownItOptions).use(markdownItAttrs);
    eleventyConfig.setLibrary('md', markdownLib);

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

    // This is a development-only feature.
    // It should not run in a production build environment.
    if (process.env.ELEVENTY_RUN_MODE === "serve") {
        eleventyConfig.setBrowserSyncConfig({
            callbacks: {
                ready: function(err, bs) {
    
                    bs.addMiddleware("*", (req, res) => {
                        const content_404 = fs.readFileSync('public/404.html');
                        // Add 404 http status code in request header.
                        res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
                        // Provides the 404 content without redirect.
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
            includes: "_includes" 
        },
    };
};
