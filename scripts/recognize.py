import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

from app.config import get_settings  # noqa: E402
from app.products.service import ProductService  # noqa: E402
from app.products.store import ProductStore  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="Recognize products in an image")
    parser.add_argument("image", type=Path)
    args = parser.parse_args()

    settings = get_settings()
    store = ProductStore(settings.db_path)
    service = ProductService(
        store,
        match_threshold=settings.product_match_threshold,
        reference_images_dir=settings.reference_images_dir,
    )

    results = service.recognize(args.image.read_bytes())
    output = [
        {
            "bbox": list(item.bbox),
            "product_id": item.match.id if item.match else None,
            "name": item.match.name if item.match else None,
            "confidence": item.match.confidence if item.match else None,
        }
        for item in results
    ]
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()
