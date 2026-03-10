from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.schemes import UserCreate
from app import auth, schemes, models
from app.models import Student,Teacher,Class

def create_user(db:Session,user_in:UserCreate):
    hashed=auth.get_password_hash(user_in.password)
    user=models.User(username=user_in.username,hashed_password=hashed,role=user_in.role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, username: str, password: str):
    stmt = select(models.User).filter_by(username=username)
    user = db.execute(stmt).scalar_one_or_none()
    if not user:
        return None
    if not auth.verify_password(password, user.hashed_password):
        return None
    return user

#student
def create_student(db:Session,student_in:schemes.StudentCreate):
    student=models.Student(**student_in.dict())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

def get_student(db:Session,student_in:int):
    return db.get(models.Student,student_in)

def update_student(db:Session,student_in:int,values:dict):
    student=db.get(models.Student,student_in)
    if not student:
        return None
    for k,v in values.items():
        setattr(student,k,v)
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

def delete_student(db: Session, student_id: int):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        return None
    db.delete(student)
    db.commit()
    return student

def list_students(db:Session,skip:int=0,limit:int=50,search:Optional[str] = None,grade:Optional[str] = None,active:Optional[bool] = None):
    stmt=select(models.Student)
    if search:
        stmt=stmt.where(models.Student.name.ilike(f"%{search}%"))
    if grade:
        stmt=stmt.where(models.Student.grade==grade)
    if active is not None:
        stmt=stmt.where(models.Student.active==active)
    stmt = stmt.order_by(Student.id)
    stmt=stmt.offset(skip).limit(limit)
    return db.execute(stmt).scalars().all()

# ------------------- Teacher CRUD -------------------

def create_teacher(db: Session, teacher_in: schemes.TeacherCreate):
    data = teacher_in.dict()
    class_id = data.pop("class_id", None)  # Remove class_id from Teacher creation
    teacher = models.Teacher(**data)
    db.add(teacher)
    db.commit()
    db.refresh(teacher)

    # Assign class if class_id provided
    if class_id:
        cls = db.get(models.Class, class_id)
        if cls:
            cls.teacher = teacher
            db.add(cls)
            db.commit()
            db.refresh(cls)
    return teacher


def list_teacher(db: Session, skip: int = 0, limit: int = 50, search: Optional[str] = None):
    query = db.query(models.Teacher)
    if search:
        query = query.filter(models.Teacher.name.ilike(f"%{search}%"))
    query = query.order_by(models.Teacher.id)
    return query.offset(skip).limit(limit).all()


def get_teacher(db: Session, teacher_id: int):
    return db.query(models.Teacher).get(teacher_id)


def update_teacher(db: Session, teacher_id: int, teacher_in: schemes.TeacherUpdate):
    teacher = get_teacher(db, teacher_id)
    if not teacher:
        return None

    # Update normal fields
    for field, value in teacher_in.dict(exclude_unset=True).items():
        if field != "class_id":  # skip class_id here
            setattr(teacher, field, value)
    db.add(teacher)

    # Handle class assignment
    class_id = teacher_in.class_id
    if class_id is not None:
        # Remove teacher from previous classes
        for cls in teacher.classes:
            cls.teacher = None
            db.add(cls)

        if class_id:
            cls = db.get(models.Class, class_id)
            if cls:
                cls.teacher = teacher
                db.add(cls)

    db.commit()
    db.refresh(teacher)
    return teacher



def delete_teacher(db: Session, teacher_id: int):
    teacher = get_teacher(db, teacher_id)
    if not teacher:
        return None
    db.delete(teacher)
    db.commit()
    return True


#Classes
def create_class(db:Session,class_in:schemes.ClassCreate):
    classes=models.Class(**class_in.dict())
    db.add(classes)
    db.commit()
    db.refresh(classes)
    return classes

def get_classes(db:Session,cls_in:int):
    return db.get(models.Class,cls_in)

def list_class(db:Session,skip:int=0,limit:int=0,search:str |None=None):
    stmt=select(models.Class)
    if search:
        stmt=stmt.where(models.Class.name.ilike(f"%{search}%"))
    stmt = stmt.order_by(Class.id)
    stmt=stmt.offset(skip).limit(limit)
    return db.execute(stmt).scalars().all()

def assign_student_to_class(db: Session, student_id: int, class_id: int):
    student = db.get(models.Student, student_id)
    cls = db.get(models.Class, class_id)
    if not student or not cls:
        return None
    if student not in cls.students:
        cls.students.append(student)
        db.add(cls)
        db.commit()
        db.refresh(cls)
    return cls

def update_class(db:Session, class_id: int, values: dict):
    cls=db.get(models.Class,class_id)
    if not cls:
        return None
    for k, v in values.items():
        setattr(cls,k,v)
    db.add(cls)
    db.commit()
    db.refresh(cls)
    return cls

def delete_class(db:Session,class_id:int):
    cls=db.get(models.Class,class_id)
    if not cls:
        return None
    db.delete(cls)
    db.commit()
    return cls