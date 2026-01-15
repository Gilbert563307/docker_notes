from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tasks.presentation.FilesController import files_router


app = FastAPI()
app.include_router(files_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        # "https://tasks-tracker.online",
        # "https://tasks-tracker.online/api/",
        "https://gilbert-ssempijja.space/",
        "https://gilbert-ssempijja.space/app/",
        "https://gilbert-ssempijja.space/api/",
    ],  # Replace "*" with your React app's URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}
