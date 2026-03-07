from sqlalchemy import Column, DateTime, Integer, String, Text, func

from app.core.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    profile_url = Column(String(512), nullable=False, index=True)
    headline = Column(Text, nullable=True)
    about = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)
    skills = Column(Text, nullable=True)
    total_score = Column(Integer, nullable=False)
    headline_score = Column(Integer, nullable=False)
    about_score = Column(Integer, nullable=False)
    experience_score = Column(Integer, nullable=False)
    skills_score = Column(Integer, nullable=False)
    keyword_score = Column(Integer, nullable=False)
    improved_headline = Column(Text, nullable=False)
    improved_about = Column(Text, nullable=False)
    suggestions = Column(Text, nullable=False)
    recruiter_feedback = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
