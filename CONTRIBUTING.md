# Contributing

Thanks for considering a contribution. This is a small, open-source-only
face/product recognition app — read [docs/PLAN.md](docs/PLAN.md) for the
roadmap and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how it fits
together before diving in.

## Ground rules

- **Open-source only.** No proprietary/paid vision APIs (AWS Rekognition,
  Azure Face, Google Vision, etc.), and no new dependency without checking
  its license against [docs/TECH_STACK.md](docs/TECH_STACK.md). If you add a
  dependency, add a row to that table in the same PR.
- **Docs before code.** Planning docs (PLAN/ARCHITECTURE/API) are updated in
  the same PR that changes the behavior they describe, not after.
- Be respectful — see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Getting set up

See [docs/SETUP.md](docs/SETUP.md) for the full local dev environment.
Quick version:

```bash
# Backend
python -m venv .venv
.venv\Scripts\activate        # Windows; `source .venv/bin/activate` on macOS/Linux
pip install -r requirements.txt -r requirements-dev.txt
pytest

# Frontend
cd frontend
npm install
npm run dev
```

Or `docker compose up --build` to run everything at once.

## Making a change

1. Open an issue first for anything non-trivial (new model/library,
   endpoint shape change, UI redesign) so the approach can be agreed on
   before you invest time.
2. Branch from `main`.
3. Keep changes scoped — one logical change per PR.
4. Run linters and tests locally before opening the PR:
   - Backend: `ruff check .`, `black --check .`, `pytest`
   - Frontend: `npm run lint` and `npm run build` (in `frontend/`)
5. Update relevant docs (`docs/API.md` for endpoint changes, `docs/PLAN.md`
   checkboxes for phase progress, `docs/TECH_STACK.md` for new
   dependencies).
6. Open a PR against `main` using the PR template. CI must be green.

## Commit style

Plain, descriptive commit messages in the imperative mood (`Add product
embedding cache`, not `Added`/`Adds`). No strict convention enforced beyond
that.

## Reporting bugs / requesting features

Use the issue templates under `.github/ISSUE_TEMPLATE/`. For security
issues, see [SECURITY.md](SECURITY.md) instead of opening a public issue.

## License

By contributing, you agree that your contributions will be licensed under
the project's [MIT License](LICENSE).
