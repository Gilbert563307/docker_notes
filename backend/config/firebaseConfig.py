import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from dotenv import load_dotenv
import os
load_dotenv()

cred = credentials.Certificate(
    {
        "type": os.getenv("BACKEND_FIREBASE_TYPE"),
        "project_id": os.getenv("BACKEND_FIREBASE_PROJECT_ID"),
        "private_key_id": os.getenv("BACKEND_FIREBASE_PRIVATE_KEY_ID"),
        "private_key": os.getenv("BACKEND_FIREBASE_PRIVATE_KEY"),
        "client_email": os.getenv("BACKEND_FIREBASE_CLIENT_EMAIL"),
        "client_id": os.getenv("BACKEND_FIREBASE_CLIENT_ID"),
        "auth_uri": os.getenv("BACKEND_FIREBASE_AUTH_URI"),
        "token_uri": os.getenv("BACKEND_FIREBASE_TOKEN_URI"),
        "auth_provider_x509_cert_url": os.getenv(
            "BACKEND_FIREBASE_AUTH_PROVIDER_X509_CERT_URL"
        ),
        "client_x509_cert_url": os.getenv("BACKEND_FIREBASE_CLIENT_X590_CERT_URL"),
        "universe_domain": os.getenv("BACKEND_FIREBASE_UNIVERSE_DOMAIN"),
    }
)
app = firebase_admin.initialize_app(cred)
db = firestore.client()

