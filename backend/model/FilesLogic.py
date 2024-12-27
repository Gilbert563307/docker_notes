from config.constants import ALLOWED_UPLOAD_MIME_TYPES, UPLOAD_DIRECTORY
from fastapi import HTTPException, UploadFile
import os
from fastapi import File


class FilesLogic:
    # Helper function to check file MIME type and validate images if necessary
    @staticmethod
    def is_allowed_file(file: UploadFile) -> bool:
        # Lazy Import of Large Libraries
        import mimetypes
        from PIL import Image
        from io import BytesIO

        try:
            mime_type, _ = mimetypes.guess_type(file.filename)

            if mime_type is None:
                raise HTTPException(
                    status_code=400, detail="Unable to determine file type."
                )

            if mime_type not in ALLOWED_UPLOAD_MIME_TYPES:
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

            file_name = file.filename

            # Create folder called 'uploads' if it doesn't exist
            uploads_path = os.path.join(current_dir, UPLOAD_DIRECTORY)
            os.makedirs(uploads_path, exist_ok=True)

            # Create a folder called user_uid within uploads folder if it doesn't exist
            user_upload_folder_path = os.path.join(uploads_path, user_uid)
            os.makedirs(user_upload_folder_path, exist_ok=True)

            # Check if file already exists
            file_upload_path = os.path.join(user_upload_folder_path, file_name)

            # Write new content to the file (overwriting if it exists)
            with open(file_upload_path, "wb") as f:
                f.write(file_content)  # Write bytes directly

            return True
        except Exception as e:
            print(f"[upload_file]]: {e}")
            return False
