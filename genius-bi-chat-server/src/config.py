import logging

import yaml
from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings

logger = logging.getLogger("genius-ai-service")


class Settings(BaseSettings):
    """
    Configuration settings for the Genius BI service.

    The settings are loaded in the following order of precedence:
    1. Default values: Defined in the class attributes.
    2. Environment variables: Overrides default values if set.
    3. .env.dev file: Loads additional settings or overrides previous ones.
    4. config.yaml file: Provides the highest priority configuration.

    This hierarchical loading allows for flexible configuration management
    across different environments and deployment scenarios.
    """

    host: str = Field(default="127.0.0.1", alias="GENIUS_BI_SERVICE_HOST")
    port: int = Field(default=4444, alias="GENIUS_BI_SERVICE_PORT")
    # debug config
    logging_level: str = Field(default="INFO")
    development: bool = Field(default=False)

    # this is used to store the config like type: llm, embedder, etc. and we will process them later
    config_path: str = Field(default="config.yaml")
    _components: list[dict]

    def __init__(self):
        load_dotenv(".env.dev", override=True)
        super().__init__()
        raw = self.config_loader()
        self.override(raw)
        self._components = [
            component for component in raw if "settings" not in component
        ]

    def config_loader(self):
        try:
            with open(self.config_path, "r") as file:
                return list(yaml.load_all(file, Loader=yaml.SafeLoader))
        except FileNotFoundError:
            message = f"Warning: Configuration file {self.config_path} not found. Using default settings."
            logger.warning(message)
            return []
        except yaml.YAMLError as e:
            logger.exception(f"Error parsing YAML file: {e}")
            return []

    def override(self, raw: list[dict]) -> None:
        override_settings = {}

        for doc in raw:
            if "settings" in doc:
                override_settings = doc["settings"]
                break

        for key, value in override_settings.items():
            if hasattr(self, key):
                setattr(self, key, value)
            else:
                message = f"Warning: Unknown configuration key '{key}' in YAML file."
                logger.warning(message)

    @property
    def components(self) -> list[dict]:
        return self._components


settings = Settings()
