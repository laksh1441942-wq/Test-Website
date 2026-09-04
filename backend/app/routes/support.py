from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.models import Customer, SupportTicket, TicketStatus, User
from app.schemas.schemas import TicketCreateRequest, TicketResponse
from app.security.auth import get_current_user

router = APIRouter(prefix="/api/support", tags=["support"])


class TicketReplyRequest(BaseModel):
    message: str


@router.post("/tickets", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(
    request: TicketCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No customer profile found for this user",
        )

    message = request.message
    if settings.DEMO_VULN_XSS:
        pass
    else:
        import html
        message = html.escape(message)

    ticket = SupportTicket(
        customer_id=customer.id,
        subject=request.subject,
        message=message,
        status=TicketStatus.OPEN,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return TicketResponse.model_validate(ticket)


@router.get("/tickets", response_model=list[TicketResponse])
def list_tickets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        return []

    tickets = (
        db.query(SupportTicket)
        .filter(SupportTicket.customer_id == customer.id)
        .order_by(SupportTicket.created_at.desc())
        .all()
    )
    return [TicketResponse.model_validate(t) for t in tickets]


@router.get("/tickets/{ticket_id}", response_model=TicketResponse)
def get_ticket(
    ticket_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer or ticket.customer_id != customer.id:
        if current_user.role.value not in ("SUPPORT", "ADMIN"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this ticket",
            )

    return TicketResponse.model_validate(ticket)


@router.post("/tickets/{ticket_id}/reply", response_model=TicketResponse)
def reply_to_ticket(
    ticket_id: int,
    request: TicketReplyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer or ticket.customer_id != customer.id:
        if current_user.role.value not in ("SUPPORT", "ADMIN"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this ticket",
            )

    reply_message = request.message
    if settings.DEMO_VULN_XSS:
        pass
    else:
        import html
        reply_message = html.escape(reply_message)

    ticket.message = f"{ticket.message}\n\n--- Reply ---\n{reply_message}"
    ticket.status = TicketStatus.IN_PROGRESS
    db.commit()
    db.refresh(ticket)
    return TicketResponse.model_validate(ticket)
