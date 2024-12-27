from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
import os
from .dependencies import get_token_header
from typing import List
from werkzeug.utils import secure_filename
from config.constants import (
    MAX_FILE_UPLOAD_SIZE,
    UPLOAD_DIRECTORY,
)
from model.FilesLogic import FilesLogic
from pydantic import BaseModel


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
