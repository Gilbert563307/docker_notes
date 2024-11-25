from fastapi import Depends, FastAPI, APIRouter
from controller.dependencies import get_query_token, get_token_header
from controller.FilesController import files_router

# app = FastAPI(dependencies=[Depends(get_query_token)])
app = FastAPI()

app.include_router(files_router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
