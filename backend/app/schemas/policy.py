from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.policy import PolicyCategory, PolicyType

# Shared properties
class PolicyBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    category: PolicyCategory
    type: PolicyType
    priority: Optional[int] = Field(0, ge=0)
    status: bool = True

# Properties to receive on policy creation
class PolicyCreate(PolicyBase):
    pass

# Properties to receive on policy update
class PolicyUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    category: Optional[PolicyCategory] = None
    type: Optional[PolicyType] = None
    priority: Optional[int] = Field(None, ge=0)
    status: Optional[bool] = None

# Properties shared by models stored in DB
class PolicyInDBBase(PolicyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Properties to return to client
class PolicyResponse(PolicyInDBBase):
    pass

# Properties stored in DB
class PolicyInDB(PolicyInDBBase):
    pass 