from typing import List, Optional
from fastapi import APIRouter,Depends, HTTPException, Query
from app import schemes,auth,crud
from sqlalchemy.orm import Session
from app.database import get_db

router=APIRouter(
    prefix="/api/classes",
    tags=["classes"]
)

@router.post("/",response_model=schemes.ClassResponse)
def create_class(class_in:schemes.ClassCreate,db:Session=Depends(get_db),user=Depends(auth.require_role(["admin"]))):
    return crud.create_class(db,class_in)

@router.get("/",response_model=List[schemes.ClassResponse])
def list_classes(search:Optional[str]=Query(None),skip:int=0,limit:int=50,db:Session=Depends(get_db),user=Depends(auth.require_role(["admin","staff","teacher"]))):
    return crud.list_class(db,skip=skip,limit=limit,search=search)

@router.post("/{class_id}/assign-student/{student_id}",response_model=schemes.ClassResponse)
def assign_student(class_id:int,student_id:int,db:Session=Depends(get_db),user=Depends(auth.require_role(["admin","staff"]))):
    c=crud.assign_student_to_class(db,student_id,class_id)
    if not c:
        raise HTTPException(status_code=404,detail="Student or Class not found")
    return c

@router.put("/{class_id}",response_model=schemes.ClassResponse)
def update_class(class_id:int,payload:schemes.ClassUpdate,db:Session=Depends(get_db),user=Depends(auth.require_role(["admin"]))):
    updated=crud.update_class(db,class_id,payload.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404,detail="Class not found")
    return updated

@router.delete("/{class_id}",response_model=schemes.ClassResponse)
def delete_class(class_id:int,db:Session=Depends(get_db),user=Depends(auth.require_role(["admin"]))):
    deleted=crud.delete_class(db,class_id)
    if not deleted:
        raise HTTPException(status_code=404,detail="Class not found")
    return deleted
