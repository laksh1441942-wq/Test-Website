from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


# ── Auth ──────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


# ── User ──────────────────────────────────────────────────────────────
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Customer ──────────────────────────────────────────────────────────
class CustomerResponse(BaseModel):
    id: int
    user_id: int
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CustomerPublicResponse(BaseModel):
    id: int
    user_id: int
    city: Optional[str] = None
    state: Optional[str] = None

    class Config:
        from_attributes = True


# ── Product ───────────────────────────────────────────────────────────
class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    price: float
    stock: int
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProductCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    price: float
    stock: int = 0
    image_url: Optional[str] = None


# ── Order ─────────────────────────────────────────────────────────────
class OrderItemRequest(BaseModel):
    product_id: int
    quantity: int


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True


class OrderCreateRequest(BaseModel):
    shipping_address: str
    items: list[OrderItemRequest]


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    status: str
    total_amount: float
    shipping_address: Optional[str] = None
    created_at: Optional[datetime] = None
    items: list[OrderItemResponse] = []

    class Config:
        from_attributes = True


# ── Invoice ───────────────────────────────────────────────────────────
class InvoiceResponse(BaseModel):
    id: int
    order_id: int
    invoice_number: str
    customer_id: int
    amount: float
    invoice_url: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Support ───────────────────────────────────────────────────────────
class TicketCreateRequest(BaseModel):
    subject: str
    message: str


class TicketResponse(BaseModel):
    id: int
    customer_id: int
    subject: str
    message: str
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Health ────────────────────────────────────────────────────────────
class HealthResponse(BaseModel):
    status: str
    environment: str


# ── Security target info ─────────────────────────────────────────────
class SecurityInfoResponse(BaseModel):
    app_name: str
    vulnerabilities: dict


# Rebuild forward refs
TokenResponse.model_rebuild()
