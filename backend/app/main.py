from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import admin, auth, cart, categories, orders, products, upload

app = FastAPI(title="Dicalo Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict:
    return {"ok": True, "service": "dicalo-backend", "message": "Backend is running"}


@app.get("/health")
def health() -> dict:
    return {"status": "healthy"}


app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(admin.router)
app.include_router(categories.router)
app.include_router(upload.router)
