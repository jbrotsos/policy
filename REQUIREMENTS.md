# Defender Portal Policy Management System Requirements

## Overview
The Defender Portal Policy Management System is designed to manage security and compliance policies with associated rules. 

## Core Components

### Policy
A policy represents a security or compliance rule set with the following attributes:
- Name: Unique identifier for the policy
- Description: Detailed explanation of the policy's purpose
- Category: Category of the policy (e.g., CSPM, Posture, Gating, Drift, Settings)
- Type: Possible values - Default, Built-in or Custom
- Priority
- Status: Whether the policy is active

### Rule
Rules are components of a policy that define specific conditions. They can be existing rules already created or a custom rule. To create a new rule, these are the the following attribues:
- Name: Unique identifier for the rule
- Description: Detailed explanation of the rule's purpose
- Category: List of categories that must be met for the rule to trigger
- Type: Possible values - Default, Built-in or Custom
- Priority
- Status: Whether the rule is active

## API Endpoints

### Policies
- GET /policies: List all policies
- POST /policies: Create a new policy with rules
- GET /policies/{id}: Get a specific policy and its rules
- PUT /policies/{id}: Update a policy and its rules
- DELETE /policies/{id}: Delete a policy and its associated rules

## Frontend Requirements

### Policy Management View
- This is the main page
- It should have the exact same look and feel like the figma file `/assets/design/mockups/create-a-new-policy.png`
- 5 Different types of policies: Posture, Drift Detection, Gated Deployment, DevOps, FIM, Anti-malware.
- The five different types of polices are tabs - when you click on the tab, you see all the policies of that type.
- The table will list all policies with the type, scope and action
- Each Policy can have multiple rules. Each rule should be shown in the table under the policy that it is associated with
- Must be able to edit, delete and enable/disable each existing policies and their rules
- Must be able to create a new policy.
- Each Button to Create New Policy and open the Create Policy Wizard - specific for that type of policy

### Creating a new policy wizard
- It should have the exact same look and feel as the figma file `/assets/design/mockups/create-a-new-policy-new-rule-general-details.png`
- Should have three different stages: "General details & scope", "Rules", and "Review and Finish"
- First Step of Policy Wizard: "General details and scope"
  - It should have the exact same look and feel as the figma file `/assets/design/mockups/create-a-new-policy-new-rule-general-details.png`
  - User should input Name. This is a text box.
  - User should input Description. This is a text box. 
  - User should select a Category. This is a drop down menu. This should be greyed outfor now.
  - User should select a Type. This is a radio button with the selection of "Default", "Built-in", or "Custom".
  - User should select a Priority. This is a drop down menu. This should be greyed out for now.
  - User should select a Status. Either on or off. The default should be on.
  - User should select the Scope. This is a drop down menu. This should be greyed out for now.
- Second Step of Policy Wizard: Rules
  - This is the second step of the Policy Wizard 
  - It should have the exact same look and feel as the figma file `/assets/design/mockups/create-a-new-policy-new-rule-rules.png`
  - It should list the already created rules
  - It should have a "Create custom rule" button
  - There is a Next and Cancel Button. The cancel button will close the wizard and not save anything.
- Third Step: Rule Wizard
  - This shoud start the Rule Wizard. This is the first step of the Rule Wizard.
  - It should have the exact same look and feel as the figma file: `/assets/design/mockups/create-a-new-policy-new-rule-rules-general-details.png`
  - User should select a Rule Template. This is a drop down menu. This shoud be disabled for now.
  - User should input a Name. This is a text box.
  - User should input a Description. This is a text box
  - User should enter a Category. This is a drop down menu. This should be disabled for now.
  - User should enter a Type. This is a radio button selection list with the selections being "Default", "Built-in" and "Custom"
  - User should select a Priority. This is a drop down menu. This should be disabled for now.
  - User should select a Status. Either on or off. The default should be on.
  - User should select the scope. This is a drop down menu. This should be disabled for now.
  - There is a Next and Cancel Button. The Next should only be enabled after inputting a Name. The cancel button will close the wizard and not save anything.
- Fourth Step: Trigger
  - This is the second step of the Rules Wizard
  - It should have the exact same look and feel as the figma file: `/assets/design/mockups/create-a-new-policy-new-rule-rules-trigger.png`
  - This shoud be a Query type of experience.
  - It can be AND or OR for multiple queries
  - The query should be "Code Result: Vulnerability" 
  - The condition should be "equals" or "not equals"
  - The values for vulnerability should be "Critical", "High", "Medium" and "Low"
  - There is a Next and Cancel Button. The Next should only be enabled after inputting at least one query. The cancel button will close the wizard and not save anything.
- Fifth step: Actions
  - This is the third step of the Rules Wizard
  - It should have the exact same look and feel as the figma file: `/assets/design/mockups/create-a-new-policy-new-rule-rules-trigger-actions.png`
  - User should select an action. A radio button with the actions: "Generate a Recommendation", "Generate Alert", "Block", "Run an action", or "Ignore"
  - User should input a name for the action. This is a text box.
  - User should input a description. This is a text box.
  - User should select a Risk level. This can be Critical, High, Med or Low.
  - User should input a Remediation Steps. This is a text box.
  - There is a Next and Cancel Button. The Next should only be enabled after selecting an action. The cancel button will close the wizard and not save anything.
- Sixth Step: Trigger results
  - This is the fourth step of the Rules Wizard
  - It should have the exact same look and feel as the figma file: `/assets/design/mockups/create-a-new-policy-new-rule-rules-trigger-results.png`
  - It should list all the triggers that were created
  - There is a Next and Cancel Button. The Next should always be enabled. The cancel button will close the wizard and not save anything.
- Seventh Step: Rules results
  - This is the fifth and final step of the Rules Wizard
  - It should have the exact same look and feel as the figma file: `/assets/design/mockups/create-a-new-policy-new-rule-rules-trigger-rules-table.png`
  - This will display the new rule and the previous rules created in a table format. The columns are: "Rule name", "Category", "Type", "Priority", "Status", "Scope" and "Action"
  - There is a Next and Cancel Button. The Next should always be enabled. The cancel button will close the wizard and not save anything.
- Eight Step: Review and Finish
  - This is the third and last step of the policy wizard
  - This should just have one button for now: "Finish". This saves the policy and will show the policy on the policy table page.




### Rule Management
- Add rules to policies
- Edit rules within policies
- Remove rules from policies
- Enable/disable rules

### User Interface
- Clean, modern interface using the figmas located in `/assets/design/mockups`
- Use exact figma
- Responsive design for all screen sizes
- Clear navigation between policies and rules
- Form validation for all inputs
- Confirmation dialogs for destructive actions

## Security Requirements
- Input validation on all endpoints
- Proper error handling and logging
- CORS configuration for frontend access
- Database connection security
- API endpoint protection

## Performance Requirements
- Fast response times for API calls
- Efficient database queries
- Proper indexing on frequently queried fields
- Caching where appropriate

## Design Asset Management

### Asset Organization
- Dedicated `/assets/design` directory structure:
  - `/assets/ui-references`: UI mockups and screenshots
  - `/assets/mockups`: Full page mockups
  - `/assets/icons`: Icon assets
  - `/assets/branding`: Brand-related assets
- Clear naming conventions for all assets
- Version control for design assets
- Documentation of asset locations and usage

### Asset Requirements
- Supported file formats:
  - PNG for screenshots, figma and mockups
  - SVG for icons and logos
  - JPG for photographs
  - WebP for web-optimized images
- Image optimization guidelines
- Responsive design considerations
- Accessibility requirements for images

### Design Documentation
- DESIGN.md file with:
  - Asset organization structure
  - Naming conventions
  - Image optimization guidelines
  - Design system references
  - External design resource links

## High Level Review of Project
  1. Create a web app to manage policies and rules.
  2. The web app should be named "Defender Portal Policy Management"
  3. The web app will have a landing page that will have a list of all the policies
  4. The web app will have multiple tabs. Each tab has its own set of policies
  4. The web app will have a page to create a new policy.
      a. The policy will have a name, description, and a list of rules.
      b. When creating a new policy, the user will first select the policy domain from a dropdown list.
      c. The policy domain will be one of the following:
          i. CSPM
          ii. Drift Detection
          iii. Gated Deployment
          iv. DevOps
          iv. FIM
          v. Anti-malware       
  5. All policy tables will have a option to edit an existing policy.
  6. All policy tables will have a option to delete a policy.


## Principal guidelines:

The following guidelines outline the principles and requirements for establishing a unified policy management platform and infrastructure. These are essential to support Defender Portal Policy Management needs, ensuring that policies can be managed, configured, and utilized in a consistent manner. These guidelines are the main principle for policy domain owners to write specification requirements for their policy domain areas. While we strive for a unified platform to serve all domains, it is not necessary for all policies and rules in Defender portal to be managed through a dedicated and central experience area. 
 
### Solution overview:

Provide a single standardized API/Framework to manage policies in the Defender Portal Policy Management web app, including unified logic and workflow. Ensure consistent management across various policy experiences. 

  General requirements: 
  1. The policy management platform should accommodate all policy domain categories and their respective rule categories within the Defender Portal Policy Management web app by various security roles. A single platform that supports multiple domains, with each domain potentially having its own set of experiences. 
  2. Users can access and fully manage policies directly in the Defender Portal Policy Management web app without needing to use the Azure portal. 
  3. Policy is cloud agnostic (Multi-cloud agnostic approach): the central policy management platform must support multi-cloud environments, allowing policy creation with rules from multiple cloud providers and assignment to scopes across all clouds to create a unified organization-level policy. This means that: 
    a. The comprehensive framework and platform must support multi-cloud environments. 
    b. A single policy can be applied across multiple clouds, eliminating the need to create separate rules for each cloud. 
    c. A single rule can be applied on a single cloud environment. In posture, for example: Recommendation policies consist of rules. To apply a policy across different environments, users can create one policy, and select recommendation rules for each environment: one for Azure, one for GCP, and one for AWS.  
  4. Some policies or rules are configurations, while others, like posture rules, are query-based. Query-based rules should support multiple platforms (e.g., KQL or Azure policy) and one or more languages. 
  5. A policy is a collection of rules. 
  6. Policy & rule categories/domains support: The app must accommodate various categories of policies, including both existing and newly introduced policy & rules categories. This includes all policy categories mentioned here (and future ones).   
  7. A policy management domain groups one or more policies to serve as a centralized security rules manager. For example, Gated is the centralized manager for all Gating rules. 
  8. Events must be collected and supported for various policy types, enabling users to track, investigate, and take appropriate actions. These events are also visible to customers. 
  9. Support for notification and subscription on rules events is required. 
  10. There is a need for dashboards to monitor security rules and events activity. 
  11. The policy management app manages policies and rules' configurations, which are used by each workload policy domain (and run them). This run can trigger different artifacts: alerts, response action, recommendations, or events (to be defined by each policy domain). For example: 
    a. Policy Violations: These are triggered by CSPM/Posture rules. Posture policies consist of a set of rules. Each rule conducts a single check, potentially leading to one assessment or recommendation. It is advisable for customers to consolidate posture rules into a smaller number of policies to simplify management. A rule may serve in multiple policies affecting the same (cloud) resource. The result will be a single assessment and recommendation for the cloud asset, showing each policy's compliance impact. 
    b. Alerts: These are triggered by drift / Anti-malware rules.  
    c. Events (future features, for example: Gating events and monitoring). 
    d. Response action: for example: response actions 
  The trigger entity mentioned above is the outcome of the policy or rule action. The action refers to the activity performed by the Policy Management agent that affects the monitored resource. 
  12. There should be visibility into the effective policy, enabling users to understand which policy or rule determined the trigger. The triggered entity should be linked to its source policy or rule. 
  13. Auditing policies and rules are essential. The policy management app must track, display, and revert changes to policy definitions and assignments efficiently.
  14. Bottom-up approach: The platform should store a list of policies and rules applied to each asset/resource. Users should be able to view the effective policies and rules on asset/resources in a dedicated policies section (entity page), grouped by each domain experience. Each asset/resource should have a policy and rules configuration for users to track all activities. 
  13. Policy or rule or should accept parameters for configuration, such as a list of URLs or limits on specific fields (mainly for protect domains). 
  14. Policy or rule should support expiration period (time). 
  15. Policy rules should support import/export in industry standard formats such as OPA. 

### Policy requirements: 

  1. All policy categories/domains shall share common actions and attributes: 
    a. General: name, description, category. 
    b. Scope: cloud scopes (or cloud native scope). 
    c. Type: Default/built-in/custom. 
    d. Enabled/disabled. 
    e. Rule(s). 
    f. Additional attributes such as framework(s). 
  2. Users should be able to create new policies (custom) either via clone or empty from scratch. Then, define all the required parameters based on the policy type. 
  3. Custom policy may include both built-in and custom rules. 
  4. Users should be able to add/remove policies. 
  5. A set of built-in policies using built-in rules should be available to users out of the box. 
  6. Built-in policies, owned and controlled by Microsoft, cannot be modified but can be cloned. The Policy Management app includes these built-in policies, which consist of built-in rules. 
  7. Policies of all types (excluding built-in) can be customized by users to match the expected behavior of the Policy Management app. 
  8. Users should be able to enable/disable a policy at any time. This also applies to the default/built-in policiest. Disabling a policy is mostly used to stop any effect while fixing/handling security issues.  
  9. Some of the built-in policies may have a property of being the default for its category. 
  10. At any given time, you may take a policy (either  built-in or your custom policy) and set it to become the default.  
  11. Multiple instances of the same policy (rules instances) must be supported. This means that the same policy category can be created and used in multiple instances. 
  12. Policies and rules will be a consolidation of multiple categories per workload/domain: Policy management experience may support multiple policy categories. The use of multiple categories to differentiate multiple (protection) capabilities grouped together. For example: Gated policies may include admission control and gated categories managed in a single unified experience.  
  13. In relevant policy domains like CSPM/FIM, scope(s) are assigned at the policy level for selected groups of rules. 

### Rules requirements 

  1. All rule categories/domains rules shall share common actions and attributes: 
    a. General: name, description, category, priority. 
    b. Scope: cloud scopes (or cloud native scope). 
    c. Condition(s), include/allow list/ exclude list: to be defined by each domain. 
    d. Action(s): Audit, Block, Run, Alert, Ignore etc. 
    e. Enables/disabled. 
    f. Type: Default/built-in/custom. 
    g. Payload: list of attributes and actions per policy domain.  
  2. Users should be able to create new (custom) rules either via clone or empty from scratch. Then, define all the required parameters based on the policy type. 
  3. Users should be able to add/remove rules in a policy. 
  4. Rules (excluding built-in) can be customized by users to match the expected behavior of Policy Management app. 
  5. Users can edit rules' metadata, including recommendations data (custom rules only) 
  6. Built-in rules can't be changed. 
  7. Users should be able to enable/disable a rule at any time. This also applies to the default/built-in rules. 
  8. Rules configuration may include one or more actions to be applied. 
  9. Individual rules support: In relevant policy domains like gated/drift, scope(s) are assigned at the rule level.  In this scenario, rules must be configured with "Scope" (either native or cloud scopes). These scopes can be reusable as needed. 
  10. Rules can be applied to one or more scopes (multiple scopes) to avoid the need for separate policies for each scope (as done today). 
  11. One rule can be applied across multiple cloud environments within the scope. It allows for multi-cloud usage, although the query may differ between environments. User should be able to exclude environment as part of rule. If the scope includes Azure, GCP, and AWS environments, and the user wants the rule to apply only to Azure resources, he should be able to include or exclude environments accordingly. 
  12. Rules can apply to resources from multiple cloud providers.  
  13. Support is needed for prioritizing between rule instances. 
  14. CSPM rules: 
    a. A posture rule shall include a list of compliance standards (and their version and section). 
    b. For posture policy category, users should be able to consolidate all rules based on a compliance standard (e.g., NIST) into a single policy. These standards will also be utilized in the experience for filtering purposes. A posture rule should include a list of compliance standards, along with their versions and sections. 
  15. Conditions & exceptions to a policy assignment are managed at the rule level for fine grain adjustments: 
    a. Applied at resource level. 
    b. Conditional statements on resource level. 
    c. Exclusion: Everything but the excluded resources. 
    d. Inclusion: Only the included resources. 

### Cross SDLC lifecycle (protect) requirements: 

1. A comprehensive policy definition is needed across the SDLC, allowing users to choose the implementation phase and configuration. For example: zero critical CVE for Code, Build, Ship, Run. A potential solution is a policy/rule that can run across phases, with custom resources and actions for each phase. The policy may incorporate rules (recommendations) from various SDLC stages, allowing users to enable or disable and configure each occurrence at any SDLC stage (effect/action/resource, etc.).  

Policy & rules assignment:

A policy assignment entails the process of applying a single rule or a set of rules to a specific scope - either specific scope or all. For a policy to be implemented, users need to assign it and define its scope. There are two methods of assignment: 
1. Rules are grouped either by category/domain or standard or any other parameter and the group is then assigned on a scope. 
2. Assignment of each rule individually on scope. 

Requirements: 

1. A policy may be assigned to one or multiple scopes (cloud scope or cloud native environments). 
2. A policy can be assigned to a cloud-native scope, primarily for the workload owner 
3. Policies can be assigned to non-scopable cloud native resources, mainly in container areas. This includes: 
   a. Compute/Containers/Kubernetes/Controller 
   b. Compute/Containers/Kubernetes/Image 
   c. Compute/Containers/Kubernetes/Node pool (under cluster) 
   d. Compute/Containers/Registries/Image 
4. In addition to scopes, a policy may include a list of exclusions. These are specific resources within the scope that users do not want the policy to apply to. 
5. In addition to scopes, a policy may include a list of inclusions. These are specific resources within the scope that users do want the policy to apply to. 
6. Users can temporarily disable or enable a scope assignment for gradual rollout or troubleshooting. 
 
### Conflict resolution 

Defining policies will require multiple personas, which may lead to overlapping policies. For certain categories/domains of policies, prioritization of policies and rules is necessary. Conflicts between different policies and rules might occur, including opposite operations such as 'Allow' versus 'Block' (two rules configured with exact opposites). Furthermore, conflicts may arise when different scopes with shared resources implement the same policy category. This means that applying more than one rule to the same (cloud) scope may lead to a conflict. Some policy categories, like posture, do not have conflicts, while others, such as drift or settings, do. The suggested solution: 

1. For all policy domains except protection: Conflict avoidance. 
   a. Each policy or rule can be activated and applied to assets (scopes) without causing conflict. 
   b. The assignment depends on all active configurations. For instance, if both P1 and P2 are active on an asset, P2 will apply as it is more comprehensive. 
   c. Exclude/include can be applied to the rule to reduce policy conflicts. 
   d. Logical OR between inclusion; Logical AND between exclusions​ 
   e. Avoid reverse operations (e.g., Allow vs Block) 

A default policy (per category/domain): One policy (per category), assigned to 'all' scope, managed by the security admin (with permission across the entire tenant). This policy defines the default behavior and is used when nothing else is defined. A built-in default policy is provided to describe the default behavior. User may disable the default policy or clone it to create a custom default policy.  

2. Within protection policy domains: Rule prioritization within a policy. 
  a. Rules are ordered by creation date to resolve conflicts. 
  b. The policy evaluates rules in a predefined order. 
  c. New rules are evaluated last. 
  d. Possible 'reversed' instructions and support for 'break return'. 
  e. Only a single rule is enforced on an asset within the scope of the policy. 
  f. No predefined resolution across different policies 
  g. New rules are evaluated last, but customers can rearrange them based on access (Admins can swap the order of two policies to change a rule's priority). 

### Data consumption:

1. A programmatic interface for security policies rules CRUD, assignment and events management must be supported (API / CLI with role-based push tokens).  
2. Policies of all categories/domains will be managed using a single API, enabling users to automate the creation and management of policies. 
3. Import and export rules in industry-standard formats (e.g., OPA: Prizma, Aqua, etc.). 

### Audit & logs: 

1. An audit log (activity log) must be maintained for every policy and rule operation, including creation, assignment, and modifications. The full details of each operation should be stored and accessible for every change. 
3. Note: Events should be defined separately from policy to address different use cases, including policy management. The policy management platform should support event triggers while integrating with Policy Management app events. 

### Nonfunctional & performance requirements:

1. The following requirements focus on the performance, reliability, scalability, and other operational aspects of the policy framework: 
  a. Performance: The framework should handle many policies and rules efficiently, ensuring quick response times and minimal latency.
  b. Scalability: The platform must support scaling to accommodate increasing numbers of policies, rules, and users without compromising performance. 
  c. Security: The platform must ensure secure access and management of policies, protecting sensitive data and preventing unauthorized access. 
  d. Auditability: The platform must maintain detailed logs of all policy and rule operations, including creation, modification, and assignment, to support auditing and compliance. 