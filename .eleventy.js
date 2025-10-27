import 'dotenv/config';
import UpgradeHelper from "@11ty/eleventy-upgrade-help";
import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import eleventySass from "eleventy-sass";
import esbuild from 'esbuild';
import fs from "fs";

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

    // Let esbuild and eleventy-sass handle JS and CSS.
    // Only passthrough copy assets that aren't processed, like images and fonts.
    // Eleventy automatically watches directories passed to addPassthroughCopy.
    eleventyConfig.addPassthroughCopy("src/assets", { filter: ["!*.js", "!*.scss"] });
    

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

    // 404 page for local development
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


    return {
        dir: {
            input: "src",
            output: "public",
            includes: "_includes" 
        },
    };
};