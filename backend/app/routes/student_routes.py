from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app import schemes, crud, auth
from app.database import get_db

router = APIRouter(
    prefix="/api/students",
    tags=["students"]
)


@router.post("/", response_model=schemes.StudentResponse)
def create_student(student_in: schemes.StudentCreate, db: Session = Depends(get_db)):
    return crud.create_student(db, student_in)


@router.get("/", response_model=List[schemes.StudentResponse])
def read_students(search: Optional[str] = Query(None),grade: Optional[str] = Query(None),active: Optional[bool] = Query(None),skip: int = 0,limit: int = 20,db: Session = Depends(get_db)):
    return crud.list_students(db,skip=skip,limit=limit,search=search,grade=grade,active=active)

@router.get("/{student_id}", response_model=schemes.StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db),user=Depends(auth.require_role(["admin", "staff", "teacher"]))):
    student = crud.get_student(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not Found")
    return student


@router.patch("/{student_id}", response_model=schemes.StudentResponse)
def update_student(student_id: int, payload: schemes.StudentUpdate, db: Session = Depends(get_db),user=Depends(auth.require_role(["admin", "staff"]))):
    updated = crud.update_student(db, student_id, payload.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Student not found")
    return updated

@router.delete("/{student_id}",response_model=dict)
def delete_student(student_id: int, db: Session=Depends(get_db), user=Depends(auth.require_role(["admin"]))):
    delete=crud.delete_student(db,student_id)
    if not delete:
        raise HTTPException(status_code=404, detail="Student not Found")
    return {"detail":f"Student {student_id} deleted successfully"}