from fastapi import APIRouter

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/users")
def list_users() -> list:
    return [
        {
            "id": 1,
            "email": "admin@dicalo.local",
            "full_name": "Dicalo Admin",
            "role": "admin",
        }
    ]


@router.get("/orders")
def list_orders() -> list:
    return []
