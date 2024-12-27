import os


def upload_files():
    try:
        # Get current directory
        current_dir = os.getcwd()

        file_name = "test.txt"
        user_id = "4a422422542e48ec029f6d21bc93c2d3cd24f823a33dba037672c5d1808c6fcf"

        # Create folder called 'uploads' if it doesn't exist
        uploads_path = os.path.join(f"{current_dir}/uploads")
        if not os.path.exists(uploads_path):
            os.makedirs(uploads_path)

        # create a folder called user_id withinn uploads folder if is not exists
        user_upload_folder_path = os.path.join(f"{uploads_path}/{user_id}")
        if not os.path.exists(user_upload_folder_path):
            os.makedirs(user_upload_folder_path)

        # check if file already exists
        file_upload_path = os.path.join(f"{user_upload_folder_path}/{file_name}")
        if os.path.isfile(file_upload_path):
            # remove old file
            os.remove(file_upload_path)
            # append new content to it
            with open(file_upload_path, "wb") as f:
                # replace with content
                f.write("content")
        else:
            with open(file_upload_path, "wb") as f:
                # replace with content
                f.write("content")


        return True
    except Exception as e:
        print(e)
        return False

