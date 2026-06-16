from fastapi import FastAPI

from routes.analyst import router

app = FastAPI()

app.include_router(
    router,
    prefix="/api/v1/analyst",
    tags=["Analyst"]
)