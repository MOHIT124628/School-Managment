from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token:str
    token_type:str

class TokenData(BaseModel):
    username: Optional[str]=None
    role:Optional[str]=None

class UserCreate(BaseModel):
    username:str = Field(...,min_length=3)
    password:str = Field(...,min_length=6)
    role: str = "staff"

class UserResponse(BaseModel):
    id:int
    username:str
    role:str

    class Config:
        orm_mode=True

# student
class StudentBase(BaseModel):
    name:str
    age:int
    grade:str
    parent_contact:Optional[str]=None
    active:Optional[bool]=True

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name:Optional[str]=None
    age:Optional[int]=None
    grade:Optional[str]=None
    parent_contact:Optional[str]=None
    active:Optional[bool]=None

class StudentResponse(StudentBase):
    id:int
    created_at:datetime

    class Config:
        orm_mode=True

#teacher
class TeacherBase(BaseModel):
    name: str
    subject: Optional[str] = None
    email: EmailStr
    active: Optional[bool] = True
    class_id: Optional[int] = None  # For frontend form


class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(BaseModel):
    name: Optional[str] = None
    subject: Optional[str] = None
    email: Optional[EmailStr] = None
    active: Optional[bool] = None
    class_id: Optional[int] = None


class TeacherResponse(TeacherBase):
    id: int
    class_: Optional[dict] = None  # {id, name}

    class Config:
        orm_mode = True

#class
class ClassBase(BaseModel):
    name:str
    teacher_id:Optional[int]=None

class ClassCreate(ClassBase):
    pass

class ClassUpdate(BaseModel):
    name:Optional[str]=None
    teacher_id:Optional[int]=None

class ClassResponse(ClassBase):
    id:int
    teacher:Optional[TeacherResponse]=None
    student:List[StudentResponse]=[]

    class Config:
        orm_mode=True