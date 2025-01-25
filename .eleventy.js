import 'dotenv/config';
import UpgradeHelper from "@11ty/eleventy-upgrade-help";
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import eleventySass from "eleventy-sass";

export default function(eleventyConfig) {
    
    eleventyConfig.addGlobalData("env", process.env);

    eleventyConfig.addPassthroughCopy("./src/assets");
    eleventyConfig.addPassthroughCopy("./src/css");
    eleventyConfig.addPassthroughCopy("./src/js");

    eleventyConfig.addWatchTarget("./src/css/");
    eleventyConfig.addWatchTarget("./src/js/");

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
    
    eleventyConfig.addPassthroughCopy({
        "./node_modules/medium-zoom/dist/medium-zoom.min.js": "./js/medium-zoom.min.js"
    });

    const markdownItOptions = {
        html: true,
        breaks: false,
        linkify: true
    };

    const markdownLib = markdownIt(markdownItOptions).use(markdownItAttrs);
    eleventyConfig.setLibrary('md', markdownLib);

    eleventyConfig.addPlugin(eleventySass);    
    
    eleventyConfig.addPlugin(UpgradeHelper);

    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        extensions: "html",
        urlPath: "/assets/",
        formats: ["webp"],
        widths: ["auto"],
    });


    return {
        dir: {
            input: "src",
            output: "public",
            includes: "_includes" 
        },
    };
};