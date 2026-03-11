from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/cart", tags=["cart"])

_CART_ITEMS = []
_NEXT_ID = 1


class CartItemPayload(BaseModel):
    product_id: int
    quantity: int = 1


class CartUpdatePayload(BaseModel):
    quantity: int


def _snapshot() -> dict:
    normalized = []
    total = 0.0

    for item in _CART_ITEMS:
        subtotal = float(item["price"]) * int(item["quantity"])
        normalized.append(
            {
                "id": item["id"],
                "product_id": item["product_id"],
                "name": item["name"],
                "price": item["price"],
                "quantity": item["quantity"],
                "subtotal": round(subtotal, 2),
            }
        )
        total += subtotal

    return {"items": normalized, "total": round(total, 2)}


@router.get("")
def get_cart() -> dict:
    return _snapshot()


@router.post("", status_code=201)
def add_to_cart(payload: CartItemPayload) -> dict:
    global _NEXT_ID
    _CART_ITEMS.append(
        {
            "id": _NEXT_ID,
            "product_id": payload.product_id,
            "name": "Catalog Item",
            "price": 25.0,
            "quantity": max(1, payload.quantity),
        }
    )
    _NEXT_ID += 1
    return _snapshot()


@router.put("/{cart_item_id}")
def update_cart_item(cart_item_id: int, payload: CartUpdatePayload) -> dict:
    item = next((entry for entry in _CART_ITEMS if entry["id"] == cart_item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if payload.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than zero")
    item["quantity"] = payload.quantity
    return _snapshot()


@router.delete("/{cart_item_id}")
def delete_cart_item(cart_item_id: int) -> dict:
    index = next((idx for idx, entry in enumerate(_CART_ITEMS) if entry["id"] == cart_item_id), None)
    if index is None:
        raise HTTPException(status_code=404, detail="Cart item not found")
    _CART_ITEMS.pop(index)
    return _snapshot()

