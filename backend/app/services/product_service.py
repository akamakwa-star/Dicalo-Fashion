from sqlalchemy.orm import Session
from app.models.product import Product
from app.schemas.product_schema import ProductCreate


def create_product(db: Session, product: ProductCreate):

    new_product = Product(**product.dict())

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


def get_products(db: Session):

    return db.query(Product).all()