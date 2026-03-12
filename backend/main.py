from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

# Database
from app.database.db import Base, engine

# Import models so tables are created
from app.models import user
from app.models import product
from app.models import category

# Import routers
from app.routes import auth
from app.routes import products
from app.routes import categories
from app.routes import upload


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="Dicalo Fashion API",
    description="Backend API for the Dicalo Fashion e-commerce platform",
    version="1.0.0"
)


# Include API routes
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(upload.router)


# Serve uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# Root route
@app.get("/")
def root():
    return {"message": "Dicalo Fashion API is running"}

