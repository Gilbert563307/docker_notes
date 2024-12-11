from config.constants import ALLOWED_UPLOAD_MIME_TYPES
from fastapi import HTTPException, UploadFile


class FilesLogic:
    # Helper function to check file MIME type and validate images if necessary
    @staticmethod
    def is_allowed_file(file: UploadFile) -> bool:
        #Lazy Import of Large Libraries
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
            print(e)
            return False
