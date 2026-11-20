# Security

## Supported versions

| Version | Supported |
| ------- | --------- |
| 1.x     | Yes       |

## Reporting a vulnerability

Open a private security advisory on the GitHub repository. If advisories are unavailable, contact the maintainer through the repository profile.

Do not open a public issue for a vulnerability.

Include:

- A description of the issue.
- Reproduction steps.
- The affected browser and version.
- Any proof-of-concept code or screenshots.
- The impact you believe it has.

## Scope

Throughline is a static demo. The likely risk areas are:

- A dependency vulnerability in the Vite, React, or tooling chain.
- A cross-site scripting issue in the card content or localStorage path.
- A leaked secret in the repository. The app requires no secrets.
- A third-party asset or font with an unexpected license or network request.

The app has no backend, accounts, payments, or server-side data.

## Practices

- Dependabot opens weekly updates for npm and GitHub Actions.
- CI runs format, lint, typecheck, tests, and build on every pull request.
- The app bundles fonts and makes no runtime third-party font requests.
- localStorage contains demo state only.
- Do not commit `.env` files, tokens, or private URLs.
