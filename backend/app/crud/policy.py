from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.policy import Policy, PolicyCategory, PolicyType
from app.models.audit_log import AuditLog, AuditAction
from app.models.user import User
from app.schemas.policy import PolicyCreate, PolicyUpdate
from app.crud.base import CRUDBase

class CRUDPolicy(CRUDBase[Policy, PolicyCreate, PolicyUpdate]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[Policy]:
        return db.query(Policy).filter(Policy.name == name).first()

    def get_policies(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        category: Optional[PolicyCategory] = None,
        type: Optional[PolicyType] = None,
        status: Optional[bool] = None,
    ) -> List[Policy]:
        query = db.query(Policy)
        
        if category:
            query = query.filter(Policy.category == category)
        if type:
            query = query.filter(Policy.type == type)
        if status is not None:
            query = query.filter(Policy.status == status)
            
        return query.offset(skip).limit(limit).all()

    def create_policy(
        self, db: Session, *, obj_in: PolicyCreate, user: Optional[User] = None
    ) -> Policy:
        db_obj = Policy(
            name=obj_in.name,
            description=obj_in.description,
            category=obj_in.category,
            type=obj_in.type,
            priority=obj_in.priority,
            status=obj_in.status,
        )
        db.add(db_obj)
        db.flush()  # Flush to get the ID
        
        # Create audit log only if user is provided
        if user is not None:
            audit_log = AuditLog(
                action=AuditAction.CREATE,
                entity_type="policy",
                entity_id=db_obj.id,
                changes=obj_in.model_dump(),
                user_id=user.id,
                policy_id=db_obj.id,
            )
            db.add(audit_log)
        
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_policy(
        self,
        db: Session,
        *,
        db_obj: Policy,
        obj_in: PolicyUpdate,
        user: User,
    ) -> Policy:
        update_data = obj_in.model_dump(exclude_unset=True)
        
        # Create audit log before update
        audit_log = AuditLog(
            action=AuditAction.UPDATE,
            entity_type="policy",
            entity_id=db_obj.id,
            changes=update_data,
            user_id=user.id,
            policy_id=db_obj.id,
        )
        db.add(audit_log)
        
        # Update policy
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete_policy(
        self, db: Session, *, id: int, user: User
    ) -> Policy:
        obj = db.query(Policy).get(id)
        if not obj:
            return None
            
        # Create audit log
        audit_log = AuditLog(
            action=AuditAction.DELETE,
            entity_type="policy",
            entity_id=id,
            changes={"id": id},
            user_id=user.id,
            policy_id=id,
        )
        db.add(audit_log)
        
        db.delete(obj)
        db.commit()
        return obj

    def toggle_policy_status(
        self, db: Session, *, policy: Policy, user: User
    ) -> Policy:
        new_status = not policy.status
        update_data = {"status": new_status}
        
        # Create audit log
        audit_log = AuditLog(
            action=AuditAction.ENABLE if new_status else AuditAction.DISABLE,
            entity_type="policy",
            entity_id=policy.id,
            changes=update_data,
            user_id=user.id,
            policy_id=policy.id,
        )
        db.add(audit_log)
        
        policy.status = new_status
        db.add(policy)
        db.commit()
        db.refresh(policy)
        return policy

policy = CRUDPolicy(Policy) 