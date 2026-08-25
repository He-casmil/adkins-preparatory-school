# Owner Guide — Adkins Preparatory School Website

## Purpose
This guide explains how to manage the site content and how to use the CMS setup I added for you.

## What is included
- The site is a static HTML/CSS project.
- A CMS layer is added using Netlify CMS.
- Editable content is stored in `content/pages/*.json`.
- The site design is controlled by `styles.css`.
- Navigation and CMS page loading are handled in `scripts.js`.

## How to edit content
### Recommended way: Netlify CMS
1. Deploy the site to Netlify.
2. Open `https://<your-site-domain>/admin/index.html`.
3. Log in with the Git provider configured in `admin/config.yml`.
4. Edit the pages from the CMS interface.
5. Save changes and the site will publish automatically.

### Direct edit (if you prefer)
1. Open `content/pages/*.json` in a text editor.
2. Change the page title, description, hero text, and intro text.
3. Save the file and push the update to Git.

## How to set up Netlify CMS
1. Open `admin/config.yml`.
2. Replace `YOUR_GITHUB_USERNAME/REPO_NAME` with your actual GitHub repository name.
3. Deploy the site to Netlify.
4. Make sure the `admin` folder and `content/pages` folder are published.

## What you can update easily
- Page headlines and descriptions
- Hero section text and buttons
- Intro blocks for each page
- News and events text
- Contact form copy

## What to avoid unless you want a design change
- Editing `styles.css` unless you want a new look
- Changing the HTML page structure unless you need a new section
- Renaming `data-page` or `data-cms` attributes unless you know what they do

## Deployment notes
- Use Netlify or any static hosting provider.
- Build command: none / leave blank.
- Publish directory: `./`.

### Quick Netlify deployment checklist
1. Create a Netlify account and connect your GitHub repository.
2. Set the publish directory to `./`.
3. Leave build command blank.
4. Deploy the site.
5. Open `https://<your-site-domain>/admin/index.html` to manage content.

## If you want help next
- I can help deploy the site to Netlify.
- I can help polish the homepage visuals.
- I can help add a new page or a blog section.
