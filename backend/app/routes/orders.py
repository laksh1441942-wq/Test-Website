from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.models import (
    Customer,
    Order,
    OrderItem,
    OrderStatus,
    Product,
    User,
)
from app.schemas.schemas import OrderCreateRequest, OrderResponse
from app.security.auth import get_current_user

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.get("", response_model=list[OrderResponse])
def list_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        return []

    orders = db.query(Order).filter(Order.customer_id == customer.id).all()
    return [OrderResponse.model_validate(o) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if settings.DEMO_VULN_BOLA:
        # INTENTIONALLY VULNERABLE: returns ANY order by ID regardless of ownership
        return OrderResponse.model_validate(order)
    else:
        # FIXED: check that the authenticated user owns this order
        customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
        if not customer or order.customer_id != customer.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this order",
            )
        return OrderResponse.model_validate(order)


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    request: OrderCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No customer profile found for this user",
        )

    order = Order(
        customer_id=customer.id,
        status=OrderStatus.PENDING,
        shipping_address=request.shipping_address,
        total_amount=0.0,
    )
    db.add(order)
    db.flush()

    total = 0.0
    for item_req in request.items:
        product = db.query(Product).filter(Product.id == item_req.product_id).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product {item_req.product_id} not found",
            )
        if product.stock < item_req.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product {product.name}",
            )

        product.stock -= item_req.quantity
        line_total = product.price * item_req.quantity
        total += line_total

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item_req.quantity,
            unit_price=product.price,
        )
        db.add(order_item)

    order.total_amount = total
    db.commit()
    db.refresh(order)
    return OrderResponse.model_validate(order)
