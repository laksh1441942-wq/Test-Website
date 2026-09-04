from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routes import admin, auth, customers, invoices, orders, products, support

app = FastAPI(
    title="VyaparSetu API",
    description="Intentionally vulnerable MSME demo backend",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Security headers middleware ───────────────────────────────────────
@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    response: Response = await call_next(request)
    if not settings.DEMO_VULN_HEADERS:
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


# ── Routers ───────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(customers.router)
app.include_router(support.router)
app.include_router(admin.router)
app.include_router(invoices.router)


# ── Startup ───────────────────────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


# ── Misc endpoints ────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "environment": settings.APP_ENV}


@app.get("/security/target-info")
def security_target_info():
    return {
        "app_name": "VyaparSetu",
        "vulnerabilities": {
            "BOLA": {
                "enabled": settings.DEMO_VULN_BOLA,
                "description": "Broken Object Level Authorization — any user can access any order by ID",
            },
            "SQLi": {
                "enabled": settings.DEMO_VULN_SQLI,
                "description": "SQL Injection — product search uses raw SQL with string interpolation",
            },
            "XSS": {
                "enabled": settings.DEMO_VULN_XSS,
                "description": "Stored Cross-Site Scripting — support ticket messages stored unsanitized",
            },
            "AdminAuth": {
                "enabled": settings.DEMO_VULN_ADMIN_AUTH,
                "description": "Broken admin authorization — admin endpoints do not verify ADMIN role",
            },
            "DataExposure": {
                "enabled": settings.DEMO_VULN_DATA_EXPOSURE,
                "description": "Sensitive data exposure — customer endpoint returns full PII",
            },
            "MissingHeaders": {
                "enabled": settings.DEMO_VULN_HEADERS,
                "description": "Missing security headers — no CSP, X-Content-Type-Options, or Referrer-Policy",
            },
        },
    }
