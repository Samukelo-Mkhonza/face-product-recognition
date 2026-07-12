# Product test fixtures

Mirrors [tests/fixtures/faces/README.md](../faces/README.md) — no product
photos are bundled by default (avoids scraped/licensed-restricted images,
see the "Dataset notes" in
[docs/TECH_STACK.md](../../../docs/TECH_STACK.md)). Synthetic images can't
reliably trigger YOLOv8 detections (it's trained on real-world COCO
objects), so the "known product" / "unknown product" tests in
`tests/test_products.py` are skipped unless you add your own photos here:

```
tests/fixtures/products/
  product_1.jpg              # a product you'll add to the catalog
  product_1_other_angle.jpg  # a second photo of the SAME product
  unknown_product.jpg        # a product NOT in the catalog
```

Any JPEG/PNG containing a clear, recognizable object (something in
YOLOv8's COCO classes, e.g. a bottle, cup, book) works best. The "no
products detected" test always runs — it uses a generated blank image, not
a real photo.
