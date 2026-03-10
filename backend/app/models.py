from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Table
from sqlalchemy.orm import relationship
from app.database import Base
import datetime

# Association table for many-to-many Student <-> Class
student_class_table = Table(
    "student_classes",
    Base.metadata,
    Column("student_id", Integer, ForeignKey("students.id"), primary_key=True),
    Column("class_id", Integer, ForeignKey("classes.id"), primary_key=True),
)

# User model
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String(50), nullable=False)  

# Student model
class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), index=True, nullable=False)
    age = Column(Integer, nullable=False)                
    grade = Column(String(50), index=True, nullable=False)
    parent_contact = Column(String(100), nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Many-to-many with Class
    classes = relationship("Class", secondary=student_class_table, back_populates="students")

# Teacher model
class Teacher(Base):
    __tablename__ = "teachers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), index=True, nullable=False)
    subject = Column(String(100), nullable=True)
    email = Column(String(200), unique=True, index=True, nullable=False)
    active = Column(Boolean, default=True)

    # One-to-many: a teacher can have multiple classes
    classes = relationship("Class", back_populates="teacher")

# Class model
class Class(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=True)

    # Many-to-one: each class has one teacher
    teacher = relationship("Teacher", back_populates="classes")

    # Many-to-many: each class has many students
    students = relationship("Student", secondary=student_class_table, back_populates="classes")
