from typing import Annotated
from dotenv import load_dotenv
from fastapi import Header, HTTPException
import os

load_dotenv()

async def get_token_header(
    x_token: Annotated[str, Header()] = "fake-super-secret-token"
):
    if x_token != "fake-super-secret-token":
        raise HTTPException(status_code=400, detail="X-Token header invalid")


async def get_query_token(token: str):
    if token != os.getenv("SECRET_TOKEN") or token == "":
        raise HTTPException(status_code=400, detail="No token | wrong token provided")
