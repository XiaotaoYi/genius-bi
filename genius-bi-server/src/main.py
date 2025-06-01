from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from routers import (
    analysis_assistant_datasets,
    analysis_assistants,
    datasets,
    metrics,
    dimensions,
    models,
    databases,
    llms,
    terms
)

app = FastAPI()

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

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"} 

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True) 