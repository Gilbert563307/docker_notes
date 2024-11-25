from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
import os
from .dependencies import get_token_header
from typing import List
from werkzeug.utils import secure_filename
from config.constants import (
    MAX_FILE_UPLOAD_SIZE,
    UPLOAD_DIRECTORY,
)
from model.FilesLogic import FilesLogic


files_router = APIRouter(
    prefix="/files",
    tags=["files"],
    dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)


@files_router.post("/uploadfile/")
async def create_upload_files(files: List[UploadFile] = File(...), user_uid: str = ""):
    if len(user_uid) == 0:
        raise HTTPException(status_code=400, detail=f"The user uid cannot be empty")

    uploaded_files: list[File] = []

    for file in files:
        content = await file.read()

        # Check file size
        if len(content) > MAX_FILE_UPLOAD_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File {file.filename} exceeds the maximum allowed size of {MAX_FILE_UPLOAD_SIZE / 1024 / 1024} MB.",
            )

        # Check file type
        if not FilesLogic().is_allowed_file(file):
            raise HTTPException(
                status_code=400,
                detail=f"File {file.filename} is not a valid image, PDF, text file, or document.",
            )

        # Secure the filename and save the file
        secure_name = secure_filename(file.filename)
        file_location = os.path.join(UPLOAD_DIRECTORY, secure_name)

        with open(file_location, "wb") as f:
            f.write(content)

        uploaded_files.append({"filename": secure_name, "size": len(content)})

    return {"message": "Success", "data": {"uploaded_files": uploaded_files}}
