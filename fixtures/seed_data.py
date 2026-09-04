"""
VyaparSetu - Database Seed Script
Generates synthetic Indian business data for the demo application.

Usage:
    1. Ensure PostgreSQL is running and the database exists
    2. cd backend && python -m fixtures.seed_data
"""

import os
import random
from datetime import datetime, timedelta, timezone
from decimal import Decimal

import bcrypt
from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    create_engine,
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://demo_user:demo_password@localhost:5432/vyaparsetu",
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

DEMO_PASSWORD = "Demo@123"


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="CUSTOMER", nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    phone = Column(String(20))
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    created_at = Column(DateTime(timezone=True), default=utcnow)
    user = relationship("User")


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100))
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    image_url = Column(String(512))
    created_at = Column(DateTime(timezone=True), default=utcnow)


class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    status = Column(String(50), default="PENDING", nullable=False)
    total_amount = Column(Float, default=0.0)
    shipping_address = Column(Text)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Float, nullable=False)
    order = relationship("Order", back_populates="items")


class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    invoice_number = Column(String(50), unique=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    amount = Column(Float, nullable=False)
    invoice_url = Column(String(512))
    created_at = Column(DateTime(timezone=True), default=utcnow)


class SupportTicket(Base):
    __tablename__ = "support_tickets"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="OPEN", nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100))
    resource_id = Column(Integer)
    created_at = Column(DateTime(timezone=True), default=utcnow)


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def random_date(start: datetime, end: datetime) -> datetime:
    delta = end - start
    random_days = random.randint(0, delta.days)
    random_seconds = random.randint(0, 86399)
    return start + timedelta(days=random_days, seconds=random_seconds)


USERS_DATA = [
    {"email": "rahul@demo.vyaparsetu.test", "name": "Rahul Kumar", "role": "CUSTOMER"},
    {"email": "priya@demo.vyaparsetu.test", "name": "Priya Sharma", "role": "CUSTOMER"},
    {"email": "support@demo.vyaparsetu.test", "name": "Support Team", "role": "SUPPORT"},
    {"email": "admin@demo.vyaparsetu.test", "name": "Admin User", "role": "ADMIN"},
]

CUSTOMER_PROFILES = [
    {
        "email": "rahul@demo.vyaparsetu.test",
        "phone": "+91-9876543210",
        "address": "42, MG Road, Near City Mall",
        "city": "Bengaluru",
        "state": "Karnataka",
    },
    {
        "email": "priya@demo.vyaparsetu.test",
        "phone": "+91-9876543211",
        "address": "15, Nehru Nagar, Opposite SBI Branch",
        "city": "Jaipur",
        "state": "Rajasthan",
    },
]

PRODUCTS_DATA = [
    ("A4 Copy Paper (500 sheets)", "Premium quality A4 copy paper for everyday printing and photocopying.", "Office Supplies", 249.00),
    ("Ballpoint Pen Pack (10 pcs)", "Smooth-writing ballpoint pens in assorted colors.", "Office Supplies", 149.00),
    ("Stapler Heavy Duty", "Heavy-duty stapler for thick document stacks.", "Office Supplies", 499.00),
    ("File Folder Set (20 pcs)", "Manila file folders for organized document storage.", "Office Supplies", 349.00),
    ("Desk Organizer 4-tier", "Wooden desk organizer with 4 compartments.", "Office Supplies", 899.00),
    ("Whiteboard Marker Set", "Dry-erase markers in 8 vibrant colors.", "Office Supplies", 199.00),
    ("Printer Ink Cartridge - Black", "High-yield black ink cartridge compatible with major printers.", "Electronics", 899.00),
    ("USB-C to USB-C Cable 1.5m", "Fast charging and data transfer cable.", "Electronics", 349.00),
    ("Wireless Mouse", "Ergonomic wireless mouse with adjustable DPI.", "Electronics", 699.00),
    ("Mechanical Keyboard", "RGB mechanical keyboard with blue switches.", "Electronics", 2499.00),
    ("Webcam HD 1080p", "Full HD webcam with built-in microphone.", "Electronics", 1799.00),
    ("Portable Charger 10000mAh", "Compact power bank with dual USB output.", "Electronics", 999.00),
    ("HDMI Cable 2m", "High-speed HDMI cable for 4K display.", "Electronics", 299.00),
    ("Noise Cancelling Headphones", "Over-ear headphones with active noise cancellation.", "Electronics", 3499.00),
    ("Laptop Stand Adjustable", "Aluminum laptop stand with height adjustment.", "Furniture", 1499.00),
    ("Ergonomic Office Chair", "Mesh office chair with lumbar support.", "Furniture", 8999.00),
    ("Wooden Study Table", "Solid wood study table with drawer.", "Furniture", 5499.00),
    ("Bookshelf 4-tier", "Engineered wood bookshelf for office or home.", "Furniture", 4299.00),
    ("Cabin Desk L-Shape", "L-shaped executive desk with storage.", "Furniture", 12999.00),
    ("Filing Cabinet 3-drawer", "Metal filing cabinet with lock.", "Furniture", 6499.00),
    ("Men's Formal Shirt - White", "Cotton formal shirt for office wear.", "Clothing", 799.00),
    ("Women's Kurta Set - Cotton", "Embroidered cotton kurta with palazzo.", "Clothing", 1299.00),
    ("Men's Trousers - Grey", "Slim-fit formal trousers.", "Clothing", 999.00),
    ("Women's Saree - Silk", "Banarasi silk saree with blouse piece.", "Clothing", 2499.00),
    ("Unisex Lab Coat", "White lab coat for medical and lab use.", "Clothing", 599.00),
    ("Basmati Rice (5 kg)", "Premium aged basmati rice.", "Food", 649.00),
    ("Toor Dal (1 kg)", "Unpolished toor dal for daily cooking.", "Food", 189.00),
    ("Mustard Oil (1 litre)", "Cold-pressed mustard oil.", "Food", 159.00),
    ("Sugar (2 kg)", "Refined white sugar.", "Food", 119.00),
    ("Namkeen Mixture (500g)", "Crunchy Indian snack mixture.", "Food", 129.00),
    ("Instant Noodles Pack (12 pcs)", "Pack of 12 instant noodles.", "Food", 179.00),
    ("Green Tea Bags (25 pcs)", "Organic green tea bags.", "Food", 249.00),
    ("Coffee Powder - Arabica (250g)", "Premium arabica coffee powder.", "Food", 399.00),
    ("Peanut Butter - Crunchy (400g)", "Natural crunchy peanut butter.", "Food", 299.00),
    ("Honey - Pure (500ml)", "Raw forest honey.", "Food", 349.00),
    ("Packaging Tape Roll (6 pcs)", "Clear packaging tape set.", "Packaging", 299.00),
    ("Bubble Wrap 30cm x 10m", "Protective bubble wrap for shipping.", "Packaging", 449.00),
    ("Corrugated Box Set (10 pcs)", "Corrugated shipping boxes.", "Packaging", 799.00),
    ("Thermal Receipt Paper Roll", "Thermal paper for receipt printers.", "Packaging", 199.00),
]

INDIAN_ADDRESSES = [
    "12, MG Road, Mumbai - 400001",
    "45, Nehru Nagar, Delhi - 110001",
    "78, Station Road, Pune - 411001",
    "23, Gandhi Marg, Chennai - 600001",
    "56, Rajouri Garden, Hyderabad - 500001",
    "89, Patel Nagar, Ahmedabad - 380001",
    "34, Salt Lake, Kolkata - 700001",
    "67, Malviya Nagar, Jaipur - 302001",
    "90, Gomti Nagar, Lucknow - 226001",
    "123, Anna Nagar, Coimbatore - 641001",
]

ORDER_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]
TICKET_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]
TICKET_SUBJECTS = [
    "Order not received yet",
    "Damaged product received",
    "Wrong item delivered",
    "Request for refund",
    "Bulk order inquiry",
    "Payment issue",
    "Product quality concern",
    "Delivery address change",
    "Invoice correction needed",
    "Account access problem",
    "Shipping delay complaint",
    "Missing items in order",
    "Warranty claim request",
    "Return policy query",
    "Discount code not working",
    "Catalog update request",
    "Custom packaging needed",
    "International shipping inquiry",
]


def seed():
    password_hash = hash_password(DEMO_PASSWORD)
    now = utcnow()
    six_months_ago = now - timedelta(days=180)

    print("Dropping and recreating tables...")
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

    db = SessionLocal()
    try:
        print("Seeding users...")
        user_map = {}
        for u in USERS_DATA:
            user = User(
                name=u["name"],
                email=u["email"],
                password_hash=password_hash,
                role=u["role"],
                created_at=random_date(six_months_ago, now - timedelta(days=30)),
            )
            db.add(user)
            db.flush()
            user_map[u["email"]] = user
        print(f"  Created {len(USERS_DATA)} users")

        print("Seeding customer profiles...")
        customer_map = {}
        for cp in CUSTOMER_PROFILES:
            customer = Customer(
                user_id=user_map[cp["email"]].id,
                phone=cp["phone"],
                address=cp["address"],
                city=cp["city"],
                state=cp["state"],
            )
            db.add(customer)
            db.flush()
            customer_map[cp["email"]] = customer
        print(f"  Created {len(CUSTOMER_PROFILES)} customer profiles")

        print("Seeding products...")
        product_list = []
        for name, desc, category, price in PRODUCTS_DATA:
            product = Product(
                name=name,
                description=desc,
                category=category,
                price=price,
                stock=random.randint(50, 500),
                created_at=random_date(six_months_ago, now - timedelta(days=60)),
            )
            db.add(product)
            db.flush()
            product_list.append(product)
        print(f"  Created {len(PRODUCTS_DATA)} products")

        print("Seeding orders...")
        customer_emails = ["rahul@demo.vyaparsetu.test", "priya@demo.vyaparsetu.test"]
        order_list = []
        for i in range(135):
            cust_email = random.choice(customer_emails)
            status = random.choices(
                ORDER_STATUSES, weights=[15, 20, 25, 35, 5], k=1
            )[0]
            order = Order(
                customer_id=customer_map[cust_email].id,
                status=status,
                total_amount=0.0,
                shipping_address=random.choice(INDIAN_ADDRESSES),
                created_at=random_date(six_months_ago, now - timedelta(days=1)),
            )
            db.add(order)
            db.flush()
            order_list.append(order)
        print(f"  Created {len(order_list)} orders")

        print("Seeding order items...")
        total_items = 0
        for order in order_list:
            num_items = random.randint(1, 5)
            selected = random.sample(product_list, min(num_items, len(product_list)))
            total = 0.0
            for product in selected:
                qty = random.randint(1, 10)
                line_total = product.price * qty
                total += line_total
                db.add(OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=qty,
                    unit_price=product.price,
                ))
                total_items += 1
            order.total_amount = round(total, 2)
        print(f"  Created {total_items} order items")

        print("Seeding invoices...")
        invoice_count = 0
        non_cancelled = [o for o in order_list if o.status != "CANCELLED"]
        for idx, order in enumerate(non_cancelled[:65], start=1):
            db.add(Invoice(
                order_id=order.id,
                invoice_number=f"INV-2024-{idx:05d}",
                customer_id=order.customer_id,
                amount=order.total_amount,
                created_at=order.created_at + timedelta(days=random.randint(0, 3)),
            ))
            invoice_count += 1
        print(f"  Created {invoice_count} invoices")

        print("Seeding support tickets...")
        ticket_count = 0
        for i in range(18):
            cust_email = random.choice(customer_emails)
            db.add(SupportTicket(
                customer_id=customer_map[cust_email].id,
                subject=random.choice(TICKET_SUBJECTS),
                message="Customer reported an issue. Please investigate and resolve at the earliest. Reference order if applicable.",
                status=random.choice(TICKET_STATUSES),
                created_at=random_date(six_months_ago, now - timedelta(days=5)),
            ))
            ticket_count += 1
        print(f"  Created {ticket_count} support tickets")

        db.commit()
        print("\nSeed completed successfully!")
        print(f"  Users:            {len(USERS_DATA)}")
        print(f"  Customers:        {len(CUSTOMER_PROFILES)}")
        print(f"  Products:         {len(PRODUCTS_DATA)}")
        print(f"  Orders:           {len(order_list)}")
        print(f"  Order Items:      {total_items}")
        print(f"  Invoices:         {invoice_count}")
        print(f"  Support Tickets:  {ticket_count}")
        print(f"\nDemo accounts:")
        print(f"  rahul@demo.vyaparsetu.test / Demo@123 (Customer)")
        print(f"  priya@demo.vyaparsetu.test / Demo@123 (Customer)")
        print(f"  support@demo.vyaparsetu.test / Demo@123 (Support)")
        print(f"  admin@demo.vyaparsetu.test / Demo@123 (Admin)")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
