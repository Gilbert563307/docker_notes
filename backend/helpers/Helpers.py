import os

class Helpers:
    def __init__(self) -> None:
        pass

    def ensure_directory_exists(directory_path: str):
        """
        Checks if a directory exists; if not, creates it.

        Parameters:
            directory_path (str): Path to the directory to check or create.
        """
        if not os.path.exists(directory_path):
            try:
                os.makedirs(directory_path)
                print(f"Directory created at: {directory_path}")
            except Exception as e:
                print(f"An error occurred while creating the directory: {e}")
        else:
            print(f"Directory already exists at: {directory_path}")
