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
