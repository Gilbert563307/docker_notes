from typing import Annotated
from dotenv import load_dotenv
from fastapi import Header, HTTPException
from model.SessionLogic import SessionLogic

load_dotenv()

async def get_token_header(x_token: Annotated[str, Header()] = ""):
    return SessionLogic.is_token_valid(x_token)


async def get_query_token(token: str):
    if token != "SECRET_TOKEN" or token == "":
        raise HTTPException(status_code=400, detail="No token | wrong token provided")
