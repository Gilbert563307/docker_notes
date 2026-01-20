from typing import Annotated
from dotenv import load_dotenv
from fastapi import Header, HTTPException
from security.SecurityConfig import SecurityConfig

load_dotenv()

async def get_token_header(x_token: Annotated[str, Header()] = ""):
    return SecurityConfig.is_token_valid(x_token)

#TODO do not use
# async def get_query_token(token: str):
#     if token != "SECRET_TOKEN" or token == "":
#         raise HTTPException(status_code=400, detail="No token | wrong token provided")
#