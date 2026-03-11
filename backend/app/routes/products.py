import itertools
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

router = APIRouter(prefix="/api/products", tags=["products"])

_PRODUCTS = [
    {
        "id": 1,
        "name": "Classic Linen Shirt",
        "category": "menswear",
        "description": "Breathable long-sleeve linen shirt.",
        "stock": 20,
        "price": 32.0,
        "rating": 4.6,
        "image": "",
        "sourcePlatform": "Dicalo",
        "sourceUrl": "",
    },
    {
        "id": 2,
        "name": "Tailored Summer Dress",
        "category": "womenswear",
        "description": "Lightweight structured summer dress.",
        "stock": 14,
        "price": 48.0,
        "rating": 4.7,
        "image": "",
        "sourcePlatform": "Dicalo",
        "sourceUrl": "",
    },
]
_PRODUCT_ID = itertools.count(start=3)


class ProductPayload(BaseModel):
    name: str
    category: str = "uncategorized"
    description: str = ""
    stock: int = 0
    price: float = 0
    rating: float = 4
    image: str = ""
    sourcePlatform: str = "Dicalo"
    sourceUrl: str = ""


@router.get("")
def list_products(
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=200),
    q: str = Query(default=""),
    category: str = Query(default=""),
    min_price: Optional[float] = Query(default=None),
    max_price: Optional[float] = Query(default=None),
) -> dict:
    filtered = _PRODUCTS

    if q:
        filtered = [p for p in filtered if q.lower() in p["name"].lower()]
    if category:
        filtered = [p for p in filtered if p["category"].lower() == category.lower()]
    if min_price is not None:
        filtered = [p for p in filtered if float(p["price"]) >= min_price]
    if max_price is not None:
        filtered = [p for p in filtered if float(p["price"]) <= max_price]

    start = (page - 1) * per_page
    end = start + per_page
    return {
        "products": filtered[start:end],
        "page": page,
        "per_page": per_page,
        "total": len(filtered),
    }


@router.get("/{product_id}")
def get_product(product_id: int) -> dict:
    product = next((item for item in _PRODUCTS if item["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", status_code=201)
def create_product(payload: ProductPayload) -> dict:
    product = payload.model_dump()
    product["id"] = next(_PRODUCT_ID)
    _PRODUCTS.insert(0, product)
    return {"product": product}


@router.put("/{product_id}")
def update_product(product_id: int, payload: ProductPayload) -> dict:
    product = next((item for item in _PRODUCTS if item["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    updates = payload.model_dump()
    for key, value in updates.items():
        product[key] = value
    return {"product": product}


@router.delete("/{product_id}")
def delete_product(product_id: int) -> dict:
    index = next((idx for idx, item in enumerate(_PRODUCTS) if item["id"] == product_id), None)
    if index is None:
        raise HTTPException(status_code=404, detail="Product not found")
    _PRODUCTS.pop(index)
    return {"message": "Product deleted"}
