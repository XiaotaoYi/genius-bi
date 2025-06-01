from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
import uvicorn
import os
from fastapi.staticfiles import StaticFiles
from src.web import routers
from fastapi.responses import ORJSONResponse, RedirectResponse
from fastapi.exceptions import RequestValidationError
# https://fastapi.tiangolo.com/advanced/events/#lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup events
    pipe_components = generate_components(settings.components)
    app.state.service_container = create_service_container(pipe_components, settings)
    app.state.service_metadata = create_service_metadata(pipe_components)

    yield

app = FastAPI(
    title="genius-bi-service API Docs",
    lifespan=lifespan,
    redoc_url=None,
    default_response_class=ORJSONResponse)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="visualization/templates")
app.mount("/static", StaticFiles(directory="visualization/static"), name="static")
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    """Render the homepage"""
    return templates.TemplateResponse("index.html", {"request": request})

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


# Import and include the process_query router
app.include_router(routers.chat)

if __name__ == "__main__":
    uvicorn.run("src.__main__:app", host="0.0.0.0", port=8081, reload=True) 