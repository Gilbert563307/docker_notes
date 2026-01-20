from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from .dependencies import get_token_header
from config.constants import (
    MAX_FILE_UPLOAD_SIZE,
)


from tasks.application.service.FilesService import FilesService

from pydantic import BaseModel


# Define the request body model
class FileRequest(BaseModel):
    user_uid: str
    filename: str


files_router = APIRouter(
    prefix="/api/files",
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
        if FilesService.is_allowed_file(file) == False:
            return {
                "message": f"File {file.filename} is not a valid image, PDF, text file, or document.",
                "files_uploaded": False,
            }, 400

        if FilesService.upload_file(file, user_uid, content):
            uploaded_files.append({"filename": file.filename})

    return {"message": "Success", "data": {"uploaded_files": uploaded_files}}


@files_router.post("/delete")
async def delete_file(request: FileRequest):
    if not request.user_uid:
        raise HTTPException(status_code=400, detail="The user uid cannot be empty")

    file_deleted = FilesService.delete_file(request.user_uid, request.filename)
    if file_deleted:
        return {"message": "File deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="File not found or could not be deleted")


@files_router.post("/get")
async def get_file_to_download(request: FileRequest):
    if not request.user_uid:
        raise HTTPException(status_code=400, detail="The user uid cannot be empty")
    file_to_download = FilesService.get_download_file(request.user_uid, request.filename)
    if file_to_download is None:
        raise HTTPException(status_code=404, detail="File not found") 
