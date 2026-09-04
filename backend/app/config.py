from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://demo_user:demo_password@localhost:5432/vyaparsetu"
    JWT_SECRET: str = "demo-only-replace-me"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60
    CORS_ORIGINS: str = "http://localhost:5173"
    APP_ENV: str = "demo"

    DEMO_VULN_BOLA: bool = True
    DEMO_VULN_SQLI: bool = True
    DEMO_VULN_XSS: bool = True
    DEMO_VULN_ADMIN_AUTH: bool = True
    DEMO_VULN_DATA_EXPOSURE: bool = True
    DEMO_VULN_HEADERS: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
