from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemes,crud,auth,models
from app.database import get_db
from fastapi.security import OAuth2PasswordRequestForm

router=APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

@router.post("/register",response_model=schemes.UserResponse)
def register(user_in:schemes.UserCreate,db:Session=Depends(get_db)):
    exisiting = db.query(models.User).filter(models.User.username == user_in.username).first()
    if exisiting:
        raise HTTPException(status_code=400,detail="Username Taken")
    user=crud.create_user(db,user_in)
    return user

@router.post("/token",response_model=schemes.Token)
def login_for_token(form_data:OAuth2PasswordRequestForm=Depends(),db:Session=Depends(get_db)):
    user=crud.authenticate_user(db,form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401,detail="Incorrect username or password")
    token=auth.create_access_token({"sub":user.username,"role":user.role})
    return {"access_token":token,"token_type":"bearer"}
