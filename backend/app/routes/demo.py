from fastapi import APIRouter, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from urllib.parse import urlparse

from app.config import settings

router = APIRouter(prefix="/api/demo", tags=["demo"])


@router.get("/echo", response_class=HTMLResponse)
def reflected_echo(message: str = ""):
    """Intentional reflected-XSS fixture for DAST scanners."""
    if not settings.DEMO_VULN_REFLECTED_XSS:
        import html
        return HTMLResponse(f"<html><body><p>{html.escape(message)}</p></body></html>")

    # Keep this endpoint isolated from application data and state changes.
    return HTMLResponse(f"<html><body><p>Demo echo: {message}</p></body></html>")


@router.get("/redirect")
def demo_redirect(next_url: str = "/"):
    """Intentional open-redirect fixture for DAST scanners."""
    parsed = urlparse(next_url)
    if not settings.DEMO_VULN_OPEN_REDIRECT and (
        parsed.scheme or parsed.netloc or not next_url.startswith("/") or next_url.startswith("//")
    ):
        raise HTTPException(status_code=400, detail="Only local paths are allowed")
    return RedirectResponse(url=next_url, status_code=302)


@router.get("/debug/config")
def demo_debug_config():
    """Intentional low-risk configuration disclosure fixture."""
    if not settings.DEMO_VULN_DEBUG_DISCLOSURE:
        raise HTTPException(status_code=404, detail="Not found")

    return {
        "environment": settings.APP_ENV,
        "database_driver": settings.DATABASE_URL.split(":", 1)[0],
        "jwt_algorithm": settings.JWT_ALGORITHM,
        "enabled_demo_checks": [
            "BOLA",
            "SQLi",
            "XSS",
            "AdminAuth",
            "DataExposure",
            "MissingHeaders",
            "InvoiceIDOR",
            "WeakPasswordPolicy",
        ],
    }
