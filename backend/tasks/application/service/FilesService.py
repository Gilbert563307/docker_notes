from config.constants import ALLOWED_UPLOAD_MIME_TYPES, UPLOAD_DIRECTORY
from fastapi import HTTPException, UploadFile
from fastapi.responses import FileResponse
import os
from fastapi import File


class FilesService:
    # Helper function to check file MIME type and validate images if necessary
    @staticmethod
    def is_allowed_file(file: UploadFile) -> bool:
        # Lazy Import of Large Libraries
        import mimetypes
        from PIL import Image
        from io import BytesIO

        # Add MIME type for .docx files
        mimetypes.add_type(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".docx",
        )

        try:
            mime_type, _ = mimetypes.guess_type(file.filename)

            # TODO causes bugs for  file types like docx
            # if mime_type is None:
            #     print(f"[is_allowed_file]: Unable to determine file type.")
            #     return False

            if mime_type not in ALLOWED_UPLOAD_MIME_TYPES:
                print(f"[is_allowed_file]: File type not allowed.")
                return False

            if mime_type.startswith("image"):
                try:
                    image = Image.open(BytesIO(file.file.read()))
                    image.verify()
                except Exception:
                    return False
                finally:
                    file.file.seek(0)

            return True
        except Exception as e:
            print(f"[is_allowed_file]: {e}")
            return False

    @staticmethod
    def upload_file(file: File, user_uid: str, file_content) -> bool:
        try:
            # Get current directory
            current_dir = os.getcwd()

            # Create folder called 'uploads' if it doesn't exist
            uploads_path = os.path.join(current_dir, UPLOAD_DIRECTORY)
            os.makedirs(uploads_path, exist_ok=True)

            # Create a folder called user_uid within uploads folder if it doesn't exist
            user_upload_folder_path = os.path.join(uploads_path, user_uid)
            os.makedirs(user_upload_folder_path, exist_ok=True)

            # Check if file already exists
            file_upload_path = os.path.join(user_upload_folder_path, file.filename)

            # Write new content to the file (overwriting if it exists)
            with open(file_upload_path, "wb") as f:
                f.write(file_content)  # Write bytes directly

            return True
        except Exception as e:
            print(f"[upload_file]]: {e}  user_uid {str(user_uid)}")
            return False

    @staticmethod
    def delete_file(user_uid: str, file_name: str) -> dict:
        try:
            # Get current directory
            current_dir = os.getcwd()

            # Create file path
            file_path = os.path.join(current_dir, UPLOAD_DIRECTORY, user_uid, file_name)

            # Check if file exists
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"File successfully deleted. File {str(file_name)} user_uid {str(user_uid)} ")
                return True
              
            print(f"[delete_file error]: File {str(file_name)} not found. user_uid {str(user_uid)} ")
            return False

        except Exception as e:
            # Log the exception for debugging (use logging in production)
            print(f"[delete_file error]: {str(e)}")
            return False
            

    @staticmethod
    def get_download_file(user_uid: str, file_name: str) -> FileResponse:
        # Get current directory
        current_dir = os.getcwd()
        file_path = os.path.join(current_dir, UPLOAD_DIRECTORY, user_uid, file_name)
        if not os.path.exists(file_path):
            return None

        # Return the file as a response
        return FileResponse(file_path, filename=file_name)
