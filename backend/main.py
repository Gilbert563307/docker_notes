from fastapi import FastAPI
from controller.FilesController import files_router


app = FastAPI()
app.include_router(files_router)

@app.get("/")
async def root():
    return {"message": "Hello World"}
