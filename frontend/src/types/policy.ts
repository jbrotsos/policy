export interface CreatePolicyData {
  name: string;
  description: string;
  category: string;
  priority: number;
  status: boolean;
  type: PolicyType;
  scope: string;
}

export interface Policy extends CreatePolicyData {
  id: number;
  created_at: string;
  updated_at: string;
  rules: Rule[];
}

export interface Rule {
  id: number;
  name: string;
  description: string;
  type: string;
  status: boolean;
  policy_id: number;
  created_at: string;
  updated_at: string;
}

export type PolicyCategory = 
  | 'Posture'
  | 'Drift Detection'
  | 'Gated Deployment'
  | 'DevOps'
  | 'FIM'
  | 'Anti-malware';

export type PolicyType = 'Default' | 'Built-in' | 'Custom';

export type PolicyPriority = 0 | 1 | 2 | 3;

export interface PolicyFilters {
  category?: PolicyCategory;
  type?: PolicyType;
  status?: boolean;
  priority?: PolicyPriority;
} 