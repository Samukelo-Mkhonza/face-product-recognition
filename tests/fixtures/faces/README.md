# Face test fixtures

This directory intentionally ships empty (its contents are gitignored except
this file) — see the "Dataset notes" in
[docs/TECH_STACK.md](../../../docs/TECH_STACK.md) for why no public face
dataset is bundled.

To run the "known face" / "unknown face" test cases in
`tests/test_faces.py` locally, add your own consented photos here:

```
tests/fixtures/faces/
  known_1.jpg     # a face you'll enroll under a test name
  known_2.jpg     # a second photo of the SAME person, for the identify test
  unknown.jpg     # a photo of a different person, not enrolled
  multiple.jpg    # optional: a photo with 2+ faces, for the multi-face test
```

Any JPEG/PNG with exactly one clear, front-facing face works. If these
files aren't present, the tests that need them are skipped automatically
(the "no face detected" test always runs — it uses a generated blank
image, not a real photo).
