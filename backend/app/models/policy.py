from sqlalchemy import Column, Integer, String, Boolean, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base_class import Base

class PolicyType(str, enum.Enum):
    DEFAULT = "Default"
    BUILT_IN = "Built-in"
    CUSTOM = "Custom"

class PolicyCategory(str, enum.Enum):
    CSPM = "CSPM"
    POSTURE = "Posture"
    GATING = "Gating"
    DRIFT = "Drift"
    SETTINGS = "Settings"
    DEVOPS = "DevOps"
    FIM = "FIM"
    ANTIMALWARE = "Anti-malware"

class Policy(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String)
    category = Column(Enum(PolicyCategory), nullable=False)
    type = Column(Enum(PolicyType), nullable=False)
    priority = Column(Integer, default=0)
    status = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    rules = relationship("Rule", back_populates="policy", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="policy") 