from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.models import Customer, User
from app.schemas.schemas import CustomerPublicResponse, CustomerResponse
from app.security.auth import get_current_user

router = APIRouter(prefix="/api/customers", tags=["customers"])


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(
    customer_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")

    if settings.DEMO_VULN_DATA_EXPOSURE:
        # INTENTIONALLY VULNERABLE: returns ALL fields including PII
        return CustomerResponse.model_validate(customer)
    else:
        # FIXED: only return non-sensitive fields
        return CustomerPublicResponse.model_validate(customer)
