# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base
from app.models.policy import Policy
from app.models.rule import Rule
from app.models.user import User
from app.models.audit_log import AuditLog 