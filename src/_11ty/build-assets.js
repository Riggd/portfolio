import esbuild from 'esbuild';
import fs from "fs";
import path from "path";
import * as sass from "sass";

const isProduction = () => process.env.ELEVENTY_RUN_MODE === 'build';

/*
Each entry becomes one bundle. The site script and the /hvac
React applet are kept separate so visitors to either one only
download what that page needs.
*/
const JS_BUNDLES = [
    { entryPoints: ['src/assets/js/index.js'], outfile: 'public/assets/js/bundle.js' },
    { entryPoints: ['src/_hvac/index.jsx'], outfile: 'public/assets/js/hvac.js', jsx: 'automatic' },
];

const CSS_BUNDLES = [
    { entry: 'src/assets/css/style.scss', outfile: 'public/assets/css/style.css', loadPaths: ['src/assets/css/'] },
    { entry: 'src/_hvac/styles.scss', outfile: 'public/assets/css/hvac.css', loadPaths: ['src/_hvac/'] },
];

export const buildJs = async () => {
    await Promise.all(
        JS_BUNDLES.map(({ jsx, ...bundle }) =>
            esbuild.build({
                ...bundle,
                bundle: true,
                sourcemap: true, // Optional: for easier debugging
                minify: isProduction(),
                ...(jsx ? { jsx } : {}),
            })
        )
    );
};

export const compileSass = () => {
    for (const { entry, outfile, loadPaths } of CSS_BUNDLES) {
        fs.mkdirSync(path.dirname(outfile), { recursive: true });

        try {
            const result = sass.compile(entry, { style: "compressed", loadPaths });
            fs.writeFileSync(outfile, result.css);
        } catch (err) {
            console.error(`Sass compilation error in ${entry}:`, err);
        }
    }
};
