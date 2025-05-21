from sqlalchemy import Column, Integer, String, Boolean, Enum, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base_class import Base

class RuleType(str, enum.Enum):
    DEFAULT = "Default"
    BUILT_IN = "Built-in"
    CUSTOM = "Custom"

class RuleAction(str, enum.Enum):
    RECOMMENDATION = "Generate a Recommendation"
    ALERT = "Generate Alert"
    BLOCK = "Block"
    RUN_ACTION = "Run an action"
    IGNORE = "Ignore"

class RuleRiskLevel(str, enum.Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class Rule(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String)
    category = Column(String)  # List of categories as JSON
    type = Column(Enum(RuleType), nullable=False)
    priority = Column(Integer, default=0)
    status = Column(Boolean, default=True)
    
    # Rule specific fields
    action = Column(Enum(RuleAction), nullable=False)
    risk_level = Column(Enum(RuleRiskLevel))
    remediation_steps = Column(String)
    conditions = Column(JSON)  # Store query conditions as JSON
    scope = Column(JSON)  # Store scope configuration as JSON
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    policy_id = Column(Integer, ForeignKey("policy.id"), nullable=False)
    
    # Relationships
    policy = relationship("Policy", back_populates="rules")
    audit_logs = relationship("AuditLog", back_populates="rule") 