from fastapi import Header, HTTPException
from config.firebaseConfig import database
from datetime import datetime
from google.cloud.firestore_v1.base_query import FieldFilter


class SecurityConfig:

    @staticmethod
    def is_token_valid(x_token: str):
        try:
            if not x_token:
                raise HTTPException(status_code=400, detail="No X-Token provided")

            # Query Firestore for the token
            doc_ref = database.collection("sessions").where(
                filter=FieldFilter("token", "==", x_token)
            )

            documents = doc_ref.get()

            # If no document is found, the token is invalid
            if len(documents) == 0:
                raise HTTPException(status_code=400, detail="X-Token header invalid")

            # Document exists, get the expiration date
            doc = documents[0].to_dict()
            expire_date: datetime = doc.get("expire_date")

            # Get the current time in UTC
            current_time = datetime.now()   

            #expire _datetime needs to be converted to a datime ob so that whe can compare then
            converted_date_time: datetime = datetime.fromtimestamp(
                expire_date.timestamp()
            )
            # Check if the token is expired
            if converted_date_time <= current_time:
                raise HTTPException(status_code=400, detail="X-Token has expired")

            # Token is valid
            return True

        except Exception as e:
            raise HTTPException(
                status_code=401, detail=f"Something went wrong: {str(e)}"
            )
