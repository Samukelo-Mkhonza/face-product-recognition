# Security Policy

## Supported Versions

This project is pre-1.0 and under active development on `main`. Security
fixes are only made against `main` / the latest tagged release.

| Version | Supported |
|---|---|
| `main` | ✅ |
| tagged releases before `v0.1.0` | ❌ |

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Instead, use GitHub's
[private vulnerability reporting](https://github.com/Samukelo-Mkhonza/face-product-recognition/security/advisories/new)
for this repository, with a description of the issue, steps to reproduce,
and potential impact.

You should get an acknowledgement within a few days. This is a small,
independently maintained open-source project without a dedicated security
team, so response times are best-effort.

## Scope notes specific to this project

- This app processes **face images**. If you find an issue that could leak
  enrolled face embeddings, bypass the similarity threshold to cause a false
  identification, or otherwise expose biometric data, please treat it as
  sensitive and report it privately as above.
- The API has no authentication in its initial version (documented as a
  known gap in [docs/API.md](docs/API.md)) — that's a known limitation for
  local/single-user use, not something you need to separately report unless
  you find a way it affects a deployment that has added auth.
- Dependency vulnerabilities in third-party models/libraries (see
  [docs/TECH_STACK.md](docs/TECH_STACK.md)) are welcome reports too, even if
  the fix is just "bump the pinned version."
