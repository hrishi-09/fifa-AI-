import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Defaults to local SQLite so the project runs with zero setup.
# For production, set DATABASE_URL to a Postgres DSN, e.g.:
#   postgresql://user:password@localhost:5432/stadiumos
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./stadiumos.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
