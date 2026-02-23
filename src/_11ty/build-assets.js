import esbuild from 'esbuild';
import fs from "fs";
import * as sass from "sass";

export const buildJs = async () => {
    await esbuild.build({
        entryPoints: ['src/assets/js/index.js'],
        bundle: true,
        outfile: 'public/assets/js/bundle.js',
        sourcemap: true, // Optional: for easier debugging
        minify: process.env.ELEVENTY_RUN_MODE === 'build', // Minify only in production
    });
};

export const compileSass = () => {
    // Build tokens into SCSS
    try {
        const tokensRaw = fs.readFileSync("src/_data/tokens.json", "utf-8");
        const tokens = JSON.parse(tokensRaw);

        let scssContent = `/* AUTO-GENERATED SCSS FROM TOKENS.JSON - DO NOT EDIT DIRECTLY */\n\n:root {\n`;

        function flattenTokens(obj, prefix = '--') {
            let str = '';
            for (const key in obj) {
                if (obj[key] && obj[key].$value !== undefined) {
                    str += `    ${prefix}${key}: ${obj[key].$value};\n`;
                } else if (typeof obj[key] === 'object') {
                    str += flattenTokens(obj[key], `${prefix}${key}-`);
                }
            }
            return str;
        }

        scssContent += flattenTokens(tokens);
        scssContent += `}\n`;

        const targetPath = "src/assets/css/_generated-tokens.scss";
        let existingContent = "";

        if (fs.existsSync(targetPath)) {
            existingContent = fs.readFileSync(targetPath, "utf-8");
        }

        // Only write to the src directory if tokens actually changed to prevent infinite watch loops
        if (existingContent !== scssContent) {
            fs.writeFileSync(targetPath, scssContent);
        }
    } catch (err) {
        console.error("Token compilation error:", err);
    }

    // Ensure the output directory exists
    if (!fs.existsSync("public/assets/css")) {
        fs.mkdirSync("public/assets/css", { recursive: true });
    }

    try {
        let result = sass.compile("src/assets/css/style.scss", {
            style: "compressed",
            loadPaths: ["src/assets/css/"]
        });
        fs.writeFileSync("public/assets/css/style.css", result.css);
    } catch (err) {
        console.error("Sass compilation error:", err);
    }
};
