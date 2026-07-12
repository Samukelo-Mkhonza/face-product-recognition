import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

from app.config import get_settings  # noqa: E402
from app.errors import MultipleFacesDetectedError, NoFaceDetectedError  # noqa: E402
from app.faces.service import FaceService  # noqa: E402
from app.faces.store import FaceStore  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="Enroll a known face")
    parser.add_argument("name", help="Name of the person")
    parser.add_argument("image", type=Path, help="Path to an image containing exactly one face")
    args = parser.parse_args()

    settings = get_settings()
    store = FaceStore(settings.db_path)
    service = FaceService(store, match_threshold=settings.face_match_threshold)

    try:
        enrolled = service.enroll(name=args.name, image_bytes=args.image.read_bytes())
    except (NoFaceDetectedError, MultipleFacesDetectedError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc

    print(f"Enrolled '{enrolled.name}' as {enrolled.id} at {enrolled.enrolled_at}")


if __name__ == "__main__":
    main()
