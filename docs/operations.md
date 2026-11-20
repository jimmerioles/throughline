# Operations

Throughline is a static site. Operations are intentionally small: build, deploy, verify, roll back.

## Local development

```bash
npm ci
npm run dev
```

Open the printed URL in Chrome 157 or later.

For older Chromium or Brave:

1. Open `chrome://flags/#canvas-draw-element`.
2. Enable the flag.
3. Relaunch the browser.

## Quality gate

```bash
npm run check
```

This runs format check, lint, typecheck, tests, and the production build.

Useful individual commands:

```bash
npm run format
npm run typecheck
npm run test:run
npm run test:coverage
npm run build
npm run preview
```

## Browser support

| Browser                                          | Experience                               |
| ------------------------------------------------ | ---------------------------------------- |
| Chrome 157+                                      | Canvas view, API on by default           |
| Chromium 147 to 156 with the flag                | Canvas view, legacy `layoutsubtree` path |
| Brave with the flag                              | Canvas view                              |
| Safari                                           | Flat fallback                            |
| Firefox                                          | Flat fallback                            |
| Any browser at or below 760px wide or 520px tall | Compact flat view                        |

The app checks for `drawElementImage` at runtime. Do not branch on user agent for the primary path.

## Deploy

The build output is `dist`. The Vite config uses a relative base, so the build works at a domain root or under a repository path.

### GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`.

1. Push to `main`.
2. In GitHub, open Settings, Pages.
3. Set Source to GitHub Actions.
4. Open the deployment URL from the workflow run.

The public site is <https://jimmerioles.github.io/throughline/>. The case study uses hash routing, so Pages needs no rewrite rule. The board is at the base URL and the case study is at `#/case-study`.

### Cloudflare Pages, Netlify, or Vercel

Use these settings:

- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`
- Node version: read `.nvmrc` or set Node 24

No environment variables are required.

## Release process

1. Confirm `main` is green.
2. Run the manual test plan for the changed areas.
3. Update `CHANGELOG.md`.
4. Merge the release change.
5. Let the Pages workflow deploy.
6. Open the public URL in Chrome 157 and one fallback browser.
7. Confirm the canvas view and flat view both render.

## Rollback

The app has no runtime state. Roll back by reverting the deploy commit and pushing to `main`, or by re-running the last green Pages deployment.

If the issue is only the canvas view, the flat view is still available in unsupported browsers. For a severe canvas regression, the safest public fallback is to deploy a build with the compact query forced on or to temporarily point the public URL at a previous artifact.

## Observability

There is no backend and no analytics by default.

- Browser console is the primary signal for canvas and paint errors.
- The Structure view shows the real DOM behind the canvas.
- CI uploads the `dist` artifact for inspection.
- GitHub Pages shows deployment history.

If analytics are added later, keep them privacy-friendly and document the change in the PRD.

## Incident playbooks

### Blank canvas

1. Confirm the browser is Chrome 157+ or has the flag.
2. Confirm the canvas has `content="drawable"` and `layoutsubtree`.
3. Confirm cards are direct children with `drawable`.
4. Check the console for errors in the paint handler.
5. Check the deployed build's `index.html` and asset paths.
6. If the API changed, feature detect the new method and update the renderer.

### Clicks land in the wrong place

1. Reproduce at 100 percent zoom.
2. Check whether the issue appears after a zoom gesture. Wait for the render scale to settle.
3. Confirm the canvas backing store size matches `devicePixelRatio`.
4. Confirm the draw coordinates and card DOM sizes use CSS pixels.
5. If a custom transform was added, check the 2D geometry sync and `preserveElementGeometry`.

### Export fails

1. Check the console for a tainted canvas error.
2. Confirm no external image was added without CORS.
3. Confirm the export waited for a `paint` event.
4. Try a smaller viewport.

### Hydration or blank page on first load

1. Confirm the build used `npm ci` and `npm run build`.
2. Check the browser console for a module or MIME error.
3. Confirm the static host serves `index.html` at the base path. Hash routes need no server rewrite.
4. Confirm the base path matches the host path.

## Security

- The site has no backend, no accounts, and no secrets.
- Fonts are bundled. There are no runtime third-party font requests.
- localStorage holds demo state only. It is not sensitive.
- Dependencies are updated weekly by Dependabot.
- Report vulnerabilities using the process in `SECURITY.md`.

## Data and privacy

- No analytics, cookies, or tracking pixels.
- No network requests after the app loads except the static assets.
- localStorage key: `throughline:board:v1`.
- Reset demo clears the key.

## Cost

Static hosting on GitHub Pages is free for public repositories. There is no database, queue, function, or paid API.
