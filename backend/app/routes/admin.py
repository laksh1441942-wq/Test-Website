from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.models import Customer, Order, Product, SupportTicket, User, UserRole
from app.schemas.schemas import CustomerResponse, OrderResponse, ProductCreateRequest, ProductResponse, TicketResponse
from app.security.auth import get_current_user

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/customers", response_model=list[CustomerResponse])
def admin_list_customers(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if settings.DEMO_VULN_ADMIN_AUTH:
        pass
    else:
        if current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required",
            )

    customers = db.query(Customer).all()
    return [CustomerResponse.model_validate(c) for c in customers]


@router.get("/orders", response_model=list[OrderResponse])
def admin_list_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if settings.DEMO_VULN_ADMIN_AUTH:
        pass
    else:
        if current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required",
            )

    orders = db.query(Order).all()
    return [OrderResponse.model_validate(o) for o in orders]


@router.get("/products", response_model=list[ProductResponse])
def admin_list_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if settings.DEMO_VULN_ADMIN_AUTH:
        pass
    else:
        if current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required",
            )

    products = db.query(Product).all()
    return [ProductResponse.model_validate(p) for p in products]


@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def admin_create_product(
    request: ProductCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if settings.DEMO_VULN_ADMIN_AUTH:
        pass
    else:
        if current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required",
            )

    product = Product(
        name=request.name,
        description=request.description,
        category=request.category,
        price=request.price,
        stock=request.stock,
        image_url=request.image_url,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(product)


class ProductUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None


@router.put("/products/{product_id}", response_model=ProductResponse)
def admin_update_product(
    product_id: int,
    request: ProductUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if settings.DEMO_VULN_ADMIN_AUTH:
        pass
    else:
        if current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required",
            )

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(product)


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if settings.DEMO_VULN_ADMIN_AUTH:
        pass
    else:
        if current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required",
            )

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    db.delete(product)
    db.commit()


@router.get("/support/tickets", response_model=list[TicketResponse])
def admin_list_support_tickets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if settings.DEMO_VULN_ADMIN_AUTH:
        pass
    else:
        if current_user.role not in (UserRole.ADMIN, UserRole.SUPPORT):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin or Support access required",
            )

    tickets = db.query(SupportTicket).order_by(SupportTicket.created_at.desc()).all()
    return [TicketResponse.model_validate(t) for t in tickets]
