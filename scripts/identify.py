import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

from app.config import get_settings  # noqa: E402
from app.faces.service import FaceService  # noqa: E402
from app.faces.store import FaceStore  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="Identify faces in an image")
    parser.add_argument("image", type=Path)
    args = parser.parse_args()

    settings = get_settings()
    store = FaceStore(settings.db_path)
    service = FaceService(store, match_threshold=settings.face_match_threshold)

    results = service.identify(args.image.read_bytes())
    output = [
        {
            "bbox": list(item.bbox),
            "name": item.match.name if item.match else None,
            "confidence": item.match.confidence if item.match else None,
        }
        for item in results
    ]
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()
