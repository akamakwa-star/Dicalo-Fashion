from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginPayload(BaseModel):
    email: str
    password: str


class RegisterPayload(BaseModel):
    email: str
    password: str
    full_name: str = "Dicalo Customer"


def _build_user(email: str, full_name: str = "") -> dict:
    role = "admin" if email.lower().startswith("admin") else "customer"
    return {
        "id": 1,
        "email": email,
        "full_name": full_name or email.split("@")[0],
        "role": role,
    }


@router.post("/login")
def login(payload: LoginPayload) -> dict:
    if not payload.email or not payload.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    return {
        "access_token": "dev-token",
        "token_type": "bearer",
        "user": _build_user(payload.email),
    }


@router.post("/register", status_code=201)
def register(payload: RegisterPayload) -> dict:
    if not payload.email or not payload.password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    return {
        "access_token": "dev-token",
        "token_type": "bearer",
        "user": _build_user(payload.email, payload.full_name),
    }


@router.get("/me")
def me() -> dict:
    return _build_user("customer@dicalo.local", "Dicalo Customer")
