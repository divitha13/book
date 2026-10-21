# Book Explorer

A responsive, accessible multi-page website for searching books with the free [Open Library API](https://openlibrary.org/developers/api), plus an Express backend that saves visitor feedback.

**Live site:** _add your Netlify / GitHub Pages link here_
**Backend:** _add your Render link here_

![Screenshot of the Explore page](screenshots/explore.png)

## Features
- 3 pages (Home, Explore, Contact) sharing one stylesheet
- Search books by title or author
- Filter by subject (API) and by decade (instant, client-side)
- Loading indicator, error message, and "no results" message
- Feedback form saved by an Express server and listed on the page
- Accessible: semantic HTML, alt text, form labels, skip link, visible focus, AA color contrast, live regions for status messages

## Tech
HTML, CSS, vanilla JavaScript (fetch), Node.js, Express

## Run locally
```bash
npm install
npm start
```
Open http://localhost:3000. Express serves both the site and the `/feedback` API.

Tasks 1 and 2 also work by opening `index.html` directly; only the Contact page needs the server.

## Deploy
- **Frontend only:** push to GitHub, then enable Pages (Settings > Pages), or drag the folder into Netlify.
- **Backend:** create a Render Web Service from the repo (build: `npm install`, start: `npm start`).
  Then set `API_BASE` in `js/config.js` to your Render URL so the deployed frontend can reach it.
  Note: Render's free tier uses temporary storage, so saved feedback resets on redeploy.

## Project structure
```
index.html  explore.html  contact.html
css/styles.css
js/explore.js  js/contact.js  js/config.js
server/server.js
data/feedback.json
```

## What I learned
_Write 3-4 sentences: what was hard, what you would improve._
