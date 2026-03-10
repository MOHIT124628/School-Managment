from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app import crud, schemes, auth
from app.database import get_db

router = APIRouter(prefix="/api/teachers", tags=["teachers"])

@router.post("/", response_model=schemes.TeacherResponse)
def create_teacher_route(teacher_in: schemes.TeacherCreate,
                         db: Session = Depends(get_db),
                         user=Depends(auth.require_role(["admin"]))):
    try:
        return crud.create_teacher(db, teacher_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=List[schemes.TeacherResponse])
def list_teachers(search: Optional[str] = None,
                  skip: int = 0,
                  limit: int = 50,
                  db: Session = Depends(get_db),
                  user=Depends(auth.require_role(["admin","staff"]))):
    return crud.list_teacher(db, skip=skip, limit=limit, search=search)


@router.get("/{teacher_id}", response_model=schemes.TeacherResponse)
def get_teacher_route(teacher_id: int,
                      db: Session = Depends(get_db),
                      user=Depends(auth.require_role(["admin","staff"]))):
    teacher = crud.get_teacher(db, teacher_id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher


@router.patch("/{teacher_id}", response_model=schemes.TeacherResponse)
def update_teacher_route(teacher_id: int,
                         teacher_in: schemes.TeacherUpdate,
                         db: Session = Depends(get_db),
                         user=Depends(auth.require_role(["admin"]))):
    teacher = crud.update_teacher(db, teacher_id, teacher_in)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher


@router.delete("/{teacher_id}")
def delete_teacher_route(teacher_id: int,
                         db: Session = Depends(get_db),
                         user=Depends(auth.require_role(["admin"]))):
    result = crud.delete_teacher(db, teacher_id)
    if not result:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return {"detail": "Teacher deleted"}
