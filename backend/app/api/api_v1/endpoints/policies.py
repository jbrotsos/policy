from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api import deps
from app.models.policy import Policy, PolicyCategory, PolicyType
from app.schemas.policy import PolicyCreate, PolicyUpdate, PolicyResponse
from app.crud import policy as policy_crud

router = APIRouter()

@router.get("/", response_model=List[PolicyResponse])
def list_policies(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    category: Optional[PolicyCategory] = None,
    type: Optional[PolicyType] = None,
    status: Optional[bool] = None,
    # Temporarily removed authentication for development
    # current_user = Depends(deps.get_current_active_user),
):
    """
    Retrieve policies with optional filtering.
    """
    return policy_crud.policy.get_policies(
        db, skip=skip, limit=limit, category=category, type=type, status=status
    )

@router.post("/", response_model=PolicyResponse)
def create_policy(
    *,
    db: Session = Depends(deps.get_db),
    policy_in: PolicyCreate,
    # Temporarily removed authentication for development
    # current_user = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new policy.
    """
    try:
        print(f"Received policy creation request: {policy_in}")
        print(f"Category type: {type(policy_in.category)}, value: {policy_in.category}")
        print(f"Type type: {type(policy_in.type)}, value: {policy_in.type}")
        
        # Check if policy with same name exists
        policy = policy_crud.policy.get_by_name(db, name=policy_in.name)
        if policy:
            print(f"Policy with name '{policy_in.name}' already exists")
            raise HTTPException(
                status_code=400,
                detail=f"Policy with name '{policy_in.name}' already exists",
            )
        
        # Create policy
        policy = policy_crud.policy.create_policy(db, obj_in=policy_in, user=None)
        print(f"Created policy with ID: {policy.id}")
        return policy
    except Exception as e:
        print(f"Error creating policy: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error creating policy: {str(e)}",
        )

@router.get("/{policy_id}", response_model=PolicyResponse)
def get_policy(
    *,
    db: Session = Depends(deps.get_db),
    policy_id: int,
):
    """
    Get policy by ID.
    """
    policy = policy_crud.get_policy(db, id=policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy

@router.put("/{policy_id}", response_model=PolicyResponse)
def update_policy(
    *,
    db: Session = Depends(deps.get_db),
    policy_id: int,
    policy_in: PolicyUpdate,
    current_user = Depends(deps.get_current_active_user),
):
    """
    Update policy.
    """
    policy = policy_crud.get_policy(db, id=policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    if policy.type == PolicyType.BUILT_IN:
        raise HTTPException(status_code=400, detail="Cannot modify built-in policy")
    return policy_crud.update_policy(db=db, db_obj=policy, obj_in=policy_in, user=current_user)

@router.delete("/{policy_id}", response_model=PolicyResponse)
def delete_policy(
    *,
    db: Session = Depends(deps.get_db),
    policy_id: int,
    current_user = Depends(deps.get_current_active_user),
):
    """
    Delete policy.
    """
    policy = policy_crud.get_policy(db, id=policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    if policy.type == PolicyType.BUILT_IN:
        raise HTTPException(status_code=400, detail="Cannot delete built-in policy")
    return policy_crud.delete_policy(db=db, id=policy_id, user=current_user)

@router.post("/{policy_id}/toggle", response_model=PolicyResponse)
def toggle_policy_status(
    *,
    db: Session = Depends(deps.get_db),
    policy_id: int,
    current_user = Depends(deps.get_current_active_user),
):
    """
    Toggle policy status (enable/disable).
    """
    policy = policy_crud.get_policy(db, id=policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy_crud.toggle_policy_status(db=db, policy=policy, user=current_user) 