from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker,declarative_base

DATABASE_URL=URL.create(
    "mssql+pyodbc",
    host="SSSLBG4NB946\\SQLEXPRESS01",
    database="school_db",
    query={
        "driver":"ODBC Driver 17 for SQL Server",
        "trusted_connection": "yes"  
    }
)

engine=create_engine(DATABASE_URL,echo=True)
SessionLocal=sessionmaker(autoflush=False, autocommit=False, bind=engine)
Base=declarative_base()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()