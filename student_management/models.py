from sqlalchemy import Column, Integer, String, UniqueConstraint
from database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)

    # Optional: Add a unique constraint
    __table_args__ = (
        UniqueConstraint('email', name='uq_student_email'),
    )
