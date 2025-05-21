from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.base_class import Base

class AuditAction(str, enum.Enum):
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    ENABLE = "enable"
    DISABLE = "disable"

class AuditLog(Base):
    id = Column(Integer, primary_key=True, index=True)
    action = Column(Enum(AuditAction), nullable=False)
    entity_type = Column(String, nullable=False)  # "policy" or "rule"
    entity_id = Column(Integer, nullable=False)
    changes = Column(JSON)  # Store the changes made
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    policy_id = Column(Integer, ForeignKey("policy.id"))
    rule_id = Column(Integer, ForeignKey("rule.id"))
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")
    policy = relationship("Policy", back_populates="audit_logs")
    rule = relationship("Rule", back_populates="audit_logs") 