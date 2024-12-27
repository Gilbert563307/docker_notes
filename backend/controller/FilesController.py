from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from .dependencies import get_token_header
from config.constants import (
    MAX_FILE_UPLOAD_SIZE,
)
from model.FilesLogic import FilesLogic
from pydantic import BaseModel


# Define the request body model
class DeleteFileRequest(BaseModel):
    user_uid: str
    filename: str


files_router = APIRouter(
    prefix="/files",
    tags=["files"],
    dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)


@files_router.post("/upload")
async def create_upload_files(
    files: list[UploadFile],
    folder_id: str = Form(...),
    user_uid: str = Form(...),
):

    if user_uid == "":
        return {
            "message": "The user uid cannot be empty",
            "files_uploaded": False,
        }

    uploaded_files: list[File] = []

    for file in files:
        content = await file.read()

        # Check file size
        if len(content) > MAX_FILE_UPLOAD_SIZE:
            return {
                "message": f"File {file.filename} exceeds the maximum allowed size of {MAX_FILE_UPLOAD_SIZE / 1024 / 1024} MB.",
                "files_uploaded": False,
            }, 400

        # Check file type
        if not FilesLogic.is_allowed_file(file):
            return {
                "message": f"File {file.filename} is not a valid image, PDF, text file, or document.",
                "files_uploaded": False,
            }, 400

        if FilesLogic.upload_file(file, user_uid, content):
            uploaded_files.append({"filename": file.filename})

    return {"message": "Success", "data": {"uploaded_files": uploaded_files}}


@files_router.post("/delete")
async def delete_file(request: DeleteFileRequest):
    if not request.user_uid:
        raise HTTPException(status_code=400, detail="The user uid cannot be empty")

    return FilesLogic.delete_file(request.user_uid, request.filename)
