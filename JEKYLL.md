# Jekyll, GitHub Pages, Ruby, and this repo's microsite

This document explains **exactly what is happening in this repository's GitHub Pages setup**.

It is written for someone who may not already know:

- what **GitHub Pages** is
- what **Jekyll** is
- why **Ruby** is involved
- what a **Gemfile** is
- how the page is actually rendered in this repository

---

## 1. The short version

This repository now has a promotional microsite in:

`/home/runner/work/LinkedIn-Feed-Vanisher/LinkedIn-Feed-Vanisher/docs`

GitHub Pages can be configured to host a site directly from that `docs/` folder.

In this repo:

1. `README.md` remains the main source of product information.
2. `scripts/sync-pages-data.js` reads `README.md`.
3. That script extracts selected sections and writes structured data to `docs/_data/readme.json`.
4. Jekyll reads files in `docs/`.
5. Jekyll renders `docs/index.html` using:
   - `docs/_config.yml`
   - `docs/_layouts/default.html`
   - `docs/_data/readme.json`
   - `docs/assets/site.css`
6. The final result is a static website that GitHub Pages can serve.

So the overall pipeline is:

`README.md -> sync-pages-data.js -> docs/_data/readme.json -> Jekyll render -> static HTML site`

---

## 2. What GitHub Pages is

**GitHub Pages** is GitHub's static website hosting service.

It takes files from a repository and publishes them as a website.

For this repository, the intended setup is:

- **source folder:** `docs/`
- **published site:** the generated Pages URL for this repository

Important point: GitHub Pages does **not** run this repo like a server application. It does not run Express, Flask, Rails, PHP, or a database. It publishes a **static site**: HTML, CSS, images, and other assets.

That means the output must end up as ordinary files a browser can download.

---

## 3. What Jekyll is

**Jekyll** is a static site generator.

A static site generator takes:

- templates
- content files
- configuration
- data files

and builds them into plain static files.

In this repo, Jekyll is being used as the "builder" for the GitHub Pages microsite.

That means Jekyll is responsible for combining:

- the page template in `docs/_layouts/default.html`
- the page content in `docs/index.html`
- the structured data in `docs/_data/readme.json`
- the config in `docs/_config.yml`
- the stylesheet in `docs/assets/site.css`

and turning that into a finished HTML page.

---

## 4. Why Ruby is involved

Jekyll is a **Ruby** application.

That is the main reason Ruby appears at all in this repository's microsite workflow.

The browser extension itself is primarily JavaScript-based. But **the GitHub Pages build tool** is Jekyll, and Jekyll runs on Ruby.

So:

- **Node / npm** are used here for repo scripts like `npm run sync:pages`
- **Ruby / Bundler** are used here for the Jekyll site build and local preview

They are separate roles:

- **Node** prepares the site data from `README.md`
- **Ruby/Jekyll** renders the website from that data

---

## 5. What a Gemfile is

If you have never used Ruby before, a **gem** is the Ruby ecosystem's equivalent of a package/library dependency.

You can think of:

- **npm package** in JavaScript
- **gem** in Ruby

as roughly comparable ideas.

The file:

`/home/runner/work/LinkedIn-Feed-Vanisher/LinkedIn-Feed-Vanisher/docs/Gemfile`

declares which Ruby dependencies are needed for the microsite.

Current contents:

- `github-pages`
- `webrick`

### Why `github-pages` is in the Gemfile

The `github-pages` gem gives you a local Ruby dependency set that matches GitHub Pages closely.

That matters because GitHub Pages does **not** allow arbitrary Jekyll/plugin combinations. It supports a known set of dependencies and versions.

Using the `github-pages` gem locally helps reduce "works on my machine but not on GitHub Pages" problems.

### Why `webrick` is in the Gemfile

`webrick` is a small Ruby web server used for local preview in modern Ruby environments.

It is not there to power production hosting on GitHub. It is there so `bundle exec jekyll serve` can run a local preview server on your machine.

---

## 6. What Bundler is

**Bundler** is the Ruby tool that installs and manages the gems listed in the `Gemfile`.

If you are used to JavaScript, the rough analogy is:

- `Gemfile` is somewhat like `package.json` for Ruby dependencies
- `bundle install` is somewhat like `npm install`
- `bundle exec ...` is somewhat like "run the command using the dependencies from this project"

So when you run:

```bash
bundle install
```

Bundler installs the gems declared in `docs/Gemfile`.

And when you run:

```bash
bundle exec jekyll serve
```

Bundler makes sure the `jekyll` command uses the gem versions from this project, not some random globally installed copy.

---

## 7. What files matter in this repo's Jekyll setup

### `docs/_config.yml`

This is the main Jekyll configuration file.

In this repo it currently defines things like:

- site title
- site description
- the GitHub Pages URL/base path
- Markdown engine
- enabled plugin(s)

One especially important setting is:

- `baseurl: /LinkedIn-Feed-Vanisher`

That tells Jekyll the site is hosted under a repository subpath rather than the root of a custom domain.

So asset URLs are generated correctly for Pages hosting.

### `docs/index.html`

This is the microsite's main page.

It is not plain HTML only; it also contains **Liquid** template syntax such as:

```liquid
{% assign readme = site.data.readme %}
{{ readme.title }}
{% for feature in readme.features %}
```

Liquid is Jekyll's template language. It lets the page pull values from data files and loop over them.

### `docs/_layouts/default.html`

This is the shared page layout.

It wraps page content with the normal HTML document shell:

- `<!doctype html>`
- `<html>`
- `<head>`
- stylesheet link
- SEO tags
- `<body>`

Then it inserts page-specific content with:

```liquid
{{ content }}
```

### `docs/_data/readme.json`

This is the structured data Jekyll reads.

Jekyll automatically exposes files in `_data/` as `site.data.*`.

So this file becomes:

```liquid
site.data.readme
```

That is why `docs/index.html` can do things like:

```liquid
{{ readme.title }}
```

and:

```liquid
{% for row in readme.comparison %}
```

### `docs/assets/site.css`

This is the microsite stylesheet.

It styles the already-rendered HTML. It does **not** generate content. Jekyll simply copies it through into the built site.

### `scripts/sync-pages-data.js`

This is the bridge between the repo documentation and the microsite.

It is **not** part of Jekyll itself.

It is a Node script that:

1. reads `README.md`
2. extracts selected sections
3. writes JSON to `docs/_data/readme.json`

Without this script, the site would either:

- have to duplicate README text manually, or
- use a more complicated direct-README rendering approach

This repo intentionally uses a small explicit preprocessing step instead.

---

## 8. The rendering process in this repository

Here is the exact rendering process in practical terms.

### Step A: you edit `README.md`

Example:

- change the tagline
- update install links
- change feature bullets

### Step B: run the sync script

```bash
npm run sync:pages
```

This runs:

```bash
node scripts/sync-pages-data.js
```

That script parses `README.md` and regenerates:

```text
docs/_data/readme.json
```

### Step C: Jekyll loads the site source from `docs/`

When Jekyll runs, it reads:

- `_config.yml`
- `index.html`
- `_layouts/default.html`
- `_data/readme.json`
- `assets/site.css`

### Step D: Jekyll evaluates Liquid templates

For example, in `docs/index.html`, this:

```liquid
{{ readme.title }}
```

gets replaced with the title value from `docs/_data/readme.json`.

And this:

```liquid
{% for feature in readme.features %}
```

loops through each feature entry in the JSON and renders repeated HTML blocks.

### Step E: Jekyll writes the built static site

Locally, Jekyll writes the output into:

```text
docs/_site/
```

That `_site/` folder is the generated result, not the source you edit manually.

### Step F: GitHub Pages serves the built result

On GitHub Pages, GitHub performs a Pages/Jekyll build from the `docs/` source folder and publishes the resulting static site.

Conceptually, GitHub is doing the same kind of build step you do locally—just on GitHub's infrastructure instead of your machine.

---

## 9. What GitHub runs versus what your local machine runs

### On GitHub Pages

GitHub Pages is responsible for:

- reading the `docs/` folder as the site source
- running the Jekyll build
- publishing the generated static output

GitHub Pages is **not** expected to run `npm run sync:pages` for you in the normal Pages flow.

That means the repository should already contain an up-to-date:

```text
docs/_data/readme.json
```

when you push changes.

In other words:

- `README.md` is the human-editable source
- `docs/_data/readme.json` is a checked-in generated data artifact for Pages consumption

### On your local machine

You are responsible for two separate things:

1. regenerating the JSON data from the README
2. running Jekyll locally if you want a preview

That is why local workflow usually looks like:

```bash
npm run sync:pages
cd docs
bundle install
bundle exec jekyll serve
```

---

## 10. Requirements for running this locally

To work with the microsite locally, you need:

### Required for README -> data sync

- Node.js
- npm

These are already used elsewhere in this repository.

### Required for Jekyll local preview/build

- Ruby
- RubyGems (usually comes with Ruby)
- Bundler

Then inside `docs/` you install the gems from `Gemfile`.

### Typical local setup

From the repository root:

```bash
npm install
npm run sync:pages
cd docs
gem install bundler
bundle install
bundle exec jekyll serve
```

Then open the local URL Jekyll prints, typically something like:

```text
http://127.0.0.1:4000/LinkedIn-Feed-Vanisher/
```

---

## 11. Requirements for GitHub Pages hosting

For GitHub Pages to host this correctly, the important requirements are:

1. The repository must be configured to publish from the `docs/` folder.
2. The files inside `docs/` must be valid Jekyll source.
3. `docs/_data/readme.json` must already be committed and current.
4. The site must stay within GitHub Pages' supported Jekyll/plugin model.

This repository intentionally keeps the Pages side simple:

- one config file
- one layout
- one main page
- one stylesheet
- one generated data file
- GitHub Pages-compatible gems

---

## 12. Why this repo does not just render README.md directly

That is a reasonable question.

The short answer is: **control and presentation**.

The README is written for GitHub repository readers.
The microsite is written for visitors landing on a promotional page.

Those are related audiences, but not identical.

This repo's approach keeps one canonical content source while still allowing the site to:

- present selected sections only
- rearrange content
- render call-to-action buttons
- display cards/grids rather than raw README formatting

So instead of publishing the README as-is, the repo:

1. extracts the important information
2. stores it as structured data
3. renders that data into a site-specific layout

---

## 13. What you should edit depending on the kind of change

### If you want to change product copy

Usually edit:

- `README.md`

Then run:

```bash
npm run sync:pages
```

### If you want to change the site layout/content structure

Edit:

- `docs/index.html`
- possibly `docs/_layouts/default.html`

### If you want to change site styling

Edit:

- `docs/assets/site.css`

### If you want to change how README content is extracted

Edit:

- `scripts/sync-pages-data.js`

---

## 14. What should not be edited manually

Do **not** treat `docs/_data/readme.json` as the long-term hand-edited source of truth.

It is generated from `README.md` via:

```bash
npm run sync:pages
```

If you hand-edit the JSON directly, your changes may be overwritten the next time the sync script runs.

---

## 15. Mental model: the easiest way to think about the stack

If you want the simplest possible mental model, use this:

- **GitHub Pages** = the hosting service
- **Jekyll** = the static site builder
- **Ruby** = the language Jekyll runs on
- **Bundler** = the dependency manager for Ruby gems
- **Gemfile** = the list of Ruby dependencies needed for the Jekyll site
- **Node script** = the pre-step that converts README content into structured data for Jekyll

So for this repo specifically:

- **JavaScript/Node** prepares the content
- **Ruby/Jekyll** renders the site
- **GitHub Pages** hosts the result

---

## 16. Practical workflow summary

If you edit the microsite-related docs in this repository, the usual workflow is:

```bash
# from repo root
npm run sync:pages

# optional local preview
cd docs
gem install bundler
bundle install
bundle exec jekyll serve
```

Then commit:

- `README.md` if you changed it
- `docs/_data/readme.json` after running the sync
- any Jekyll source files you changed in `docs/`
- any script changes such as `scripts/sync-pages-data.js`

Do **not** commit local preview/build artifacts such as:

- `docs/_site/`
- `docs/vendor/`
- `docs/.bundle/`

---

## 17. Final takeaway

This repository's microsite is not "magic" and it is not a dynamic application.

It is a small static-site pipeline:

1. product information lives in `README.md`
2. a Node script converts that information into JSON data
3. Jekyll uses that JSON data plus templates/layouts to build HTML
4. GitHub Pages hosts the built static site from the `docs/` source

If you understand those four steps, you understand the important technical behavior of this setup.
