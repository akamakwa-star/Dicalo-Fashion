from fastapi import APIRouter

router = APIRouter(prefix="/api/categories", tags=["categories"])


@router.get("")
def list_categories() -> dict:
    categories = ["menswear", "womenswear", "accessories", "footwear"]
    return {"categories": categories}
