from abc import ABCMeta, abstractmethod
from hamilton.async_driver import AsyncDriver
from hamilton.driver import Driver
from haystack import Pipeline
from typing import Any, Dict

class BasicPipeline(metaclass=ABCMeta):
    def __init__(self, pipe: Pipeline | AsyncDriver | Driver):
        self._pipe = pipe

    @abstractmethod
    def run(self, *args, **kwargs) -> Dict[str, Any]:
        ...