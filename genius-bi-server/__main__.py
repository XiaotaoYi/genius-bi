from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse, RedirectResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager

from src.web.routers import (
    analysis_assistant_datasets,
    analysis_assistants,
    datasets,
    metrics,
    dimensions,
    models,
    databases,
    llms,
    terms,
    chat_assistants
)
# https://fastapi.tiangolo.com/advanced/events/#lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    pass
    # startup events
    #pipe_components = generate_components(settings.components)
    #app.state.service_container = create_service_container(pipe_components, settings)
    #app.state.service_metadata = create_service_metadata(pipe_components)

    #yield

app = FastAPI(
    title="genius-bi-server API Docs",
    #lifespan=lifespan,
    redoc_url=None,
    default_response_class=ORJSONResponse)

# Include all routers
app.include_router(analysis_assistant_datasets.router, tags=["Analysis Assistant Datasets"])
app.include_router(analysis_assistants.router, tags=["Analysis Assistants"])
app.include_router(datasets.router, tags=["Datasets"])
app.include_router(metrics.router, tags=["Metrics"])
app.include_router(databases.router, tags=["Databases"])
app.include_router(dimensions.router, tags=["Dimensions"])
app.include_router(models.router, tags=["Models"])
app.include_router(databases.router, tags=["Databases"])
app.include_router(llms.router, tags=["LLMs"])
app.include_router(terms.router, tags=["Terms"])
app.include_router(chat_assistants.router, tags=["Chat Assistants"])

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.exception_handler(Exception)
async def exception_handler(_, exc: Exception):
    return ORJSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )
@app.exception_handler(RequestValidationError)
async def request_exception_handler(_, exc: Exception):
    return ORJSONResponse(
        status_code=400,
        content={"detail": str(exc)},
    )

if __name__ == "__main__":
    uvicorn.run("__main__:app", reload=True) 