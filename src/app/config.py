from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    data_dir: Path = Path("./data")
    cors_origins: str = "http://localhost:5173"
    face_match_threshold: float = 0.35
    product_match_threshold: float = 0.75

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def db_path(self) -> Path:
        return self.data_dir / "app.db"

    @property
    def faces_index_path(self) -> Path:
        return self.data_dir / "faces.index"

    @property
    def products_index_path(self) -> Path:
        return self.data_dir / "products.index"

    @property
    def reference_images_dir(self) -> Path:
        return self.data_dir / "reference_images"


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    settings.reference_images_dir.mkdir(parents=True, exist_ok=True)
    return settings
