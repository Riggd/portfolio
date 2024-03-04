module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("./src/assets");
    eleventyConfig.addPassthroughCopy("./src/css");
    eleventyConfig.addPassthroughCopy("./src/js");

    eleventyConfig.addWatchTarget("./src/css/");
    eleventyConfig.addWatchTarget("./src/js/");

    eleventyConfig.addShortcode('year', () => {
        return `${new Date().getFullYear()}`;
    });
    
    eleventyConfig.addPassthroughCopy({
        "./node_modules/medium-zoom/dist/medium-zoom.min.js": "./js/medium-zoom.min.js"
    });

    const markdownIt = require('markdown-it');
    const markdownItAttrs = require('markdown-it-attrs');

    const markdownItOptions = {
        html: true,
        breaks: false,
        linkify: true
    };

    const markdownLib = markdownIt(markdownItOptions).use(markdownItAttrs);
    eleventyConfig.setLibrary('md', markdownLib);

    const eleventySass = require("eleventy-sass");
    eleventyConfig.addPlugin(eleventySass);

    return {
        dir: {
            input: "src",
            output: "public"
        },
    };
};