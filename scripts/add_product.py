import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

from app.config import get_settings  # noqa: E402
from app.products.service import ProductService  # noqa: E402
from app.products.store import ProductStore  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="Add a product to the catalog")
    parser.add_argument("name")
    parser.add_argument("image", type=Path)
    parser.add_argument("--sku", default=None)
    args = parser.parse_args()

    settings = get_settings()
    store = ProductStore(settings.db_path)
    service = ProductService(
        store,
        match_threshold=settings.product_match_threshold,
        reference_images_dir=settings.reference_images_dir,
    )

    product = service.add_product(
        name=args.name, sku=args.sku, image_bytes=args.image.read_bytes()
    )
    print(f"Added '{product.name}' ({product.sku or 'no SKU'}) as {product.id}")


if __name__ == "__main__":
    main()
