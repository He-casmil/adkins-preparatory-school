# Adkins Preparatory School Website

This workspace contains a responsive static school website for Adkins Preparatory School.

## Files
- `index.html` - Home page
- `about.html` - About page
- `academics.html` - Academics page
- `admission.html` - Admission page
- `apply-now.html` - Application form
- `school-life.html` - School life, activities, and community page
- `news-events.html` - News & Events page
- `gallery.html` - Photo gallery page
- `contact.html` - Contact page
- `styles.css` - Shared stylesheet and responsive design
- `scripts.js` - Mobile menu, active navigation, and CMS content loading
- `content/pages/` - Editable page content, news, and events in JSON format
- `content/gallery/` - Gallery album content in JSON format
- `content/info/` - School information content in JSON format
- `admin/` - Netlify CMS configuration and admin entry point
- `validate_html.py` - HTML structure validation script
- `manifest.json`, `robots.txt`, `sitemap.xml` - Website metadata and search engine files

## Deploy Online

You can publish this site with GitHub Pages or any static site host. This site has no build step; publish the project root directory.

### GitHub Pages
1. Create a GitHub repository and push these files.
2. In repository settings, enable GitHub Pages from the `main` branch.
3. Your site will be available at `https://<username>.github.io/<repository-name>/`.

### Netlify
1. Create a Netlify account.
2. Connect your GitHub repository.
3. Deploy the site as a static project.
4. Leave the build command blank and use `./` as the publish directory.
5. Open the generated Netlify URL.

Before deploying, update the placeholder repository in `admin/config.yml` and the placeholder domain in `sitemap.xml` and `robots.txt`.

## Content Management

This site is CMS-ready using Netlify CMS.

- Open `/admin/index.html` in the browser after deployment.
- Replace `YOUR_GITHUB_USERNAME/REPO_NAME` in `admin/config.yml` with the actual repository path.
- Page content, news, and events are stored under `content/pages/*.json`.
- Gallery albums are stored under `content/gallery/*.json`.
- School information is stored under `content/info/school.json`.
- The CMS can edit hero text, intro sections, page metadata, news, events, and gallery albums.

## Local Preview

Open `index.html` in a browser or use a local web server. A local server is recommended for CMS content and asset paths.

To validate the HTML structure from the project folder, run:

```powershell
python validate_html.py
```


