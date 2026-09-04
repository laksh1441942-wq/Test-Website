# VyaparSetu - Security Demo Guide

> **WARNING: This application contains intentional security vulnerabilities. It is designed strictly for cybersecurity training and demonstration purposes. Do NOT deploy this application to any public or production environment.**

---

## Overview

VyaparSetu is a fictional Indian B2B e-commerce platform built as an intentionally vulnerable demo application. Each vulnerability is controlled by an environment variable feature flag, allowing you to toggle them on/off independently.

## Vulnerability Flags

All vulnerabilities are controlled via environment variables. Set to `"true"` to enable, `"false"` to disable:

| Flag | Default | Description |
|------|---------|-------------|
| `DEMO_VULN_BOLA` | `true` | Broken Object Level Authorization |
| `DEMO_VULN_SQLI` | `true` | SQL Injection |
| `DEMO_VULN_XSS` | `true` | Cross-Site Scripting |
| `DEMO_VULN_ADMIN_AUTH` | `true` | Broken Admin Authentication |
| `DEMO_VULN_DATA_EXPOSURE` | `true` | Sensitive Data Exposure |
| `DEMO_VULN_HEADERS` | `true` | Missing Security Headers |

---

## 1. Broken Object Level Authorization (BOLA) - OWASP API1:2023

**Location:** `backend/app/routes/orders.py` — `GET /api/orders/{order_id}`

**What it does:** Any authenticated user can access any other user's order by supplying an arbitrary order ID. The endpoint does not verify that the requesting user owns the order.

**How to trigger:**
1. Log in as `rahul.kumar@demo.vyaparsetu.test` (customer)
2. Note your order IDs from `GET /api/orders`
3. Log out, then log in as `priya.sharma@demo.vyaparsetu.test`
4. Request `GET /api/orders/{rahul_order_id}`
5. The server returns Rahul's order details to Priya

**Remediation:**
- Add an ownership check: verify `order.user_id == current_user.id` before returning data
- Return `403 Forbidden` if the authenticated user does not own the resource

---

## 2. SQL Injection - OWASP A03:2021

**Location:** `backend/app/routes/products.py` — `GET /api/products/search`

**What it does:** The search query is interpolated directly into a raw SQL statement without parameterization, allowing an attacker to inject arbitrary SQL.

**How to trigger:**
1. Send a request to `GET /api/products/search?q=' OR '1'='1`
2. The server returns all products instead of filtered results
3. More damaging payloads: `'; DROP TABLE users; --`

**Remediation:**
- Use parameterized queries or an ORM query builder instead of string interpolation
- Never construct SQL with f-strings or `.format()` using user input

---

## 3. Cross-Site Scripting (XSS) - OWASP A03:2021

**Location:** `backend/app/routes/products.py` — `POST /api/products` (product `name` and `description` fields)

**What it does:** User-supplied product names and descriptions are stored and rendered without sanitization. When other users view the product catalog, the injected script executes in their browser.

**How to trigger:**
1. Create a product with `name` set to `<script>alert('XSS')</script>`
2. When any user loads the product listing page, the script executes
3. Reflected variant exists in the search results rendering

**Remediation:**
- Sanitize all user input before storage (strip HTML tags, encode entities)
- Use a Content Security Policy (CSP) header
- Encode output when rendering on the frontend

---

## 4. Broken Admin Authentication - OWASP A07:2021

**Location:** `backend/app/routes/admin.py` — `POST /api/admin/users/{user_id}/role`

**What it does:** The admin role-update endpoint does not verify that the caller actually has the `admin` role. Any authenticated user can promote themselves or others to admin.

**How to trigger:**
1. Log in as `rahul.kumar@demo.vyaparsetu.test` (customer role)
2. Send `POST /api/admin/users/rahul_id/role` with body `{"role": "admin"}`
3. The server updates the role without checking caller permissions
4. The customer now has full admin access

**Remediation:**
- Check `current_user.role == "admin"` before allowing any admin operation
- Use role-based access control (RBAC) middleware for all admin endpoints

---

## 5. Sensitive Data Exposure - OWASP A02:2021

**Location:** `backend/app/routes/users.py` — `GET /api/users/me`

**What it does:** The `/api/users/me` endpoint returns the full user record including `hashed_password`, `phone`, and internal fields. This data is unnecessary for the client and increases the attack surface.

**How to trigger:**
1. Log in as any user
2. Call `GET /api/users/me`
3. Observe that `hashed_password`, `phone`, internal IDs, and timestamps are returned in the response

**Remediation:**
- Create a response schema that excludes sensitive fields (`hashed_password`, `phone`, internal timestamps)
- Follow the principle of least exposure: only return what the client needs
- Never return password hashes in API responses

---

## 6. Missing Security Headers - OWASP A05:2021

**Location:** `backend/app/main.py` — FastAPI app middleware

**What it does:** The application does not set critical HTTP security headers, leaving it vulnerable to clickjacking, MIME sniffing, and other browser-based attacks.

**Missing headers:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security` (HSTS)
- `Content-Security-Policy`
- `X-XSS-Protection`

**How to trigger:**
1. Make any request to the API
2. Inspect response headers
3. Confirm security headers are absent

**Remediation:**
- Add a middleware that sets all recommended security headers on every response
- Use `X-Frame-Options: DENY` to prevent clickjacking
- Set `Content-Security-Policy` to restrict script sources

---

## Gitleaks Demo (Bonus)

The `.env.example` file contains dummy API keys (`DEMO_API_KEY`, `DEMO_PAYMENT_GATEWAY_KEY`) that will be flagged by Gitleaks or other secret-scanning tools. This demonstrates why secrets should never be committed to version control.

**How to trigger:**
1. Run `gitleaks detect --source .` in the project root
2. Gitleaks will flag the dummy keys in `.env.example`

**Remediation:**
- Use `.env.example` as a template only; real secrets go in `.env` (which is gitignored)
- Use a secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault) for production
- Add pre-commit hooks with secret scanning

---

## Safety Guidelines

1. **Never deploy this application publicly.** It is intended for local or isolated training environments only.
2. **Run behind a firewall** or on an isolated network. Do not expose ports 8000 or 5432 to the internet.
3. **Use dummy data only.** The seed script generates synthetic data — never substitute real PII or credentials.
4. **Disable vulnerabilities in CI/CD.** Ensure all `DEMO_VULN_*` flags are `false` in any pipeline that runs automated tests against real infrastructure.
5. **Educate, don't exploit.** This application exists to teach secure coding practices. Use it to learn how to identify and fix vulnerabilities, not to practice attacking real systems.
6. **Clean up after demos.** Destroy the Docker environment (`docker-compose down -v`) after each session to remove all data.

---

## Quick Start

```bash
# Copy environment file
cp .env.example .env

# Start the application
docker-compose up --build

# Seed the database
docker-compose exec backend python -m fixtures.seed_data

# Access
# Frontend:  http://localhost:5173
# Backend:   http://localhost:8000
# API Docs:  http://localhost:8000/docs
```
