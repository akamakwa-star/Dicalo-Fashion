from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    stock: int


class ProductResponse(ProductCreate):
    id: int
    image: str | None = None

    class Config:
        orm_mode = True