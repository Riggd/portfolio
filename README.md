# derekonay.com

The source code for [derekonay.com](https://derekonay.com), my personal portfolio website.

[![derekonay.com](/src/assets/OG_image.png)](https://derekonay.com)

## 🚀 Overview

This is a static site generated using [Eleventy](https://www.11ty.dev/). It features:
- **Markdown** for content management.
- **Esbuild** for bundling and minifying JavaScript.
- **Eleventy Image** for high-performance image optimization.
- **Netlify** for deployment.

## 🛠️ Tech Stack

- **SSG**: [Eleventy v3.0](https://www.11ty.dev/)
- **Bundler**: [esbuild](https://esbuild.github.io/)
- **Styling**: CSS / Sass
- **Deployment**: [Netlify](https://www.netlify.com/)

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/portfolio.git
    cd portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## 🏃‍♂️ Running Locally

To start the development server with hot-reloading:

```bash
npm start
```

This runs `eleventy --serve` and will be accessible at `http://localhost:8080`.

## 🏗️ Build

To build the project for production:

```bash
npm run build
```

This command:
1.  Cleans the output directory (`public`).
2.  Runs Eleventy to generate static HTML.
3.  Optimizes images.
4.  Bundles JavaScript via esbuild.

## 🌬️ The `/hvac` applet

`/hvac` is a self-contained React app — an interactive guide to sizing and
installing HVAC ductwork. It lives in `src/_hvac/` and ships as its own JS and CSS
bundle, so the rest of the site is unaffected and visitors to either one only
download what that page needs.

- **Content is data.** Lessons live in `src/_hvac/data/` as block lists; a block
  type maps to one small component in `components/Prose.jsx`. No raw HTML in content.
- **Math is pure and tested.** Everything the app calculates comes from
  `lib/ductMath.js`, verified against published ductulator and ASHRAE
  equivalent-diameter values. Run `npm test`.
- **One worksheet, eight steps.** `lib/derive.js` turns the worksheet into results,
  so a change on the airflow screen moves the duct sizes on the sizing screen.
- **No extra dependencies** beyond `react` and `react-dom` — routing is the URL hash
  and state is `useState` plus `localStorage`.

## 📂 Project Structure

- `src/`: Source files.
    - `_data/`: Global data files.
    - `_hvac/`: React source for the `/hvac` applet (build input, not shipped as-is).
    - `_includes/`: Layouts and partials.
    - `assets/`: Static assets (CSS, JS, Images, Fonts).
    - `projects/`: Project content pages.
- `.eleventy.js`: Eleventy configuration.
- `netlify.toml`: Netlify deployment configuration.