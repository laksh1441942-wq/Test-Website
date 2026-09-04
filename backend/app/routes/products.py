from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.models import Product
from app.schemas.schemas import ProductResponse

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("/search", response_model=list[ProductResponse])
def search_products(q: str = "", db: Session = Depends(get_db)):
    if settings.DEMO_VULN_SQLI:
        # INTENTIONALLY VULNERABLE: raw SQL with string interpolation
        # This is SELECT-only to keep it non-destructive
        sql = f"SELECT * FROM products WHERE name ILIKE '%{q}%' OR description ILIKE '%{q}%' OR category ILIKE '%{q}%'"
        result = db.execute(text(sql))
        rows = result.mappings().all()
        return [
            ProductResponse(
                id=row["id"],
                name=row["name"],
                description=row["description"],
                category=row["category"],
                price=row["price"],
                stock=row["stock"],
                image_url=row["image_url"],
                created_at=row["created_at"],
            )
            for row in rows
        ]
    else:
        products = (
            db.query(Product)
            .filter(
                Product.name.ilike(f"%{q}%")
                | Product.description.ilike(f"%{q}%")
                | Product.category.ilike(f"%{q}%")
            )
            .all()
        )
        return [ProductResponse.model_validate(p) for p in products]


@router.get("", response_model=list[ProductResponse])
def list_products(
    search: str = "",
    category: str = None,
    db: Session = Depends(get_db),
):
    query = db.query(Product)
    if search:
        query = query.filter(
            Product.name.ilike(f"%{search}%")
            | Product.description.ilike(f"%{search}%")
        )
    if category:
        query = query.filter(Product.category == category)
    return [ProductResponse.model_validate(p) for p in query.all()]


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return ProductResponse.model_validate(product)
