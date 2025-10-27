import 'dotenv/config';
import UpgradeHelper from "@11ty/eleventy-upgrade-help";
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import eleventySass from "eleventy-sass";
import esbuild from 'esbuild';

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

    // Watch the entire assets directory for changes
    eleventyConfig.addWatchTarget("./src/assets/");

    // Passthrough the entire assets directory
    eleventyConfig.addPassthroughCopy("./src/assets");

    

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

    eleventyConfig.addPlugin(eleventySass, {
        sass: {
            loadPaths: ["node_modules"]
        },
        out: "public/assets/css"
    });    
    
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

    


    return {
        dir: {
            input: "src",
            output: "public",
            includes: "_includes" 
        },
    };
};