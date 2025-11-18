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

## 📂 Project Structure

- `src/`: Source files.
    - `_data/`: Global data files.
    - `_includes/`: Layouts and partials.
    - `assets/`: Static assets (CSS, JS, Images, Fonts).
    - `projects/`: Project content pages.
- `.eleventy.js`: Eleventy configuration.
- `netlify.toml`: Netlify deployment configuration.