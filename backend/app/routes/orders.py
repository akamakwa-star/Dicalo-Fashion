import itertools
from datetime import datetime

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/orders", tags=["orders"])

_ORDER_ID = itertools.count(start=1)
_ORDERS = []


class CheckoutPayload(BaseModel):
    phone_number: str
    customer_name: str
    email: str
    currency: str = "KES"
    return_url: str = ""


@router.post("", status_code=201)
def create_order() -> dict:
    order = {
        "id": next(_ORDER_ID),
        "status": "pending_payment",
        "created_at": datetime.utcnow().isoformat() + "Z",
    }
    _ORDERS.insert(0, order)
    return order


@router.get("/my-orders")
def my_orders() -> list:
    return _ORDERS


@router.get("/{order_id}")
def get_order(order_id: int) -> dict:
    order = next((item for item in _ORDERS if item["id"] == order_id), None)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/{order_id}/pay/ecobank/checkout")
def checkout_ecobank(order_id: int, payload: CheckoutPayload) -> dict:
    order = next((item for item in _ORDERS if item["id"] == order_id), None)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order["status"] = "payment_initiated"
    order["customer_name"] = payload.customer_name
    order["email"] = payload.email
    order["phone_number"] = payload.phone_number

    return {
        "order_id": order_id,
        "provider": "ecobank",
        "status": "initiated",
        "checkout_url": payload.return_url or "https://example.ecobank.checkout/session/dev",
    }
