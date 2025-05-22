import React, { useState, ChangeEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  SelectChangeEvent,
  Paper,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog as MuiDialog,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Rule, PolicyCategory } from '../types/policy';

interface CreateRuleWizardProps {
  open: boolean;
  onClose: () => void;
  onSave: (rule: Omit<Rule, 'id' | 'policy_id' | 'created_at' | 'updated_at'>) => void;
  policyCategory: PolicyCategory;
}

const ruleSteps = ['General Details', 'Trigger', 'Actions', 'Trigger Results'];

const ruleTemplates = [
  'Vulnerability Scan',
  'Compliance Check',
  'Security Assessment',
];

const categories = [
  'Security',
  'Compliance',
  'Operations',
  'Cost',
];

const ruleTypes = [
  'Default',
  'Built-in',
  'Custom',
];

const priorities = [
  'Critical',
  'High',
  'Medium',
  'Low',
];

const scopes = [
  'Global',
  'Environment',
  'Resource Group',
  'Resource',
];

const actionTypes = [
  { value: 'recommendation', label: 'Generate a Recommendation' },
  { value: 'alert', label: 'Generate Alert' },
  { value: 'block', label: 'Block' },
  { value: 'run', label: 'Run an action' },
  { value: 'ignore', label: 'Ignore' },
];

const riskLevels = [
  'Critical',
  'High',
  'Medium',
  'Low',
];

interface Trigger {
  id: number;
  query: string;
  condition: 'equals' | 'not equals';
  value: string;
}

const CreateRuleWizard: React.FC<CreateRuleWizardProps> = ({
  open,
  onClose,
  onSave,
  policyCategory,
}: CreateRuleWizardProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [ruleData, setRuleData] = useState<Omit<Rule, 'id' | 'policy_id' | 'created_at' | 'updated_at'>>({
    name: '',
    description: '',
    type: '',
    status: true,
  });
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [isAddTriggerDialogOpen, setIsAddTriggerDialogOpen] = useState(false);
  const [newTrigger, setNewTrigger] = useState<Omit<Trigger, 'id'>>({
    query: 'Code Result: Vulnerability',
    condition: 'equals',
    value: 'Critical',
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleTextFieldChange = (field: keyof typeof ruleData) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setRuleData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setRuleData((prev) => ({
      ...prev,
      type: event.target.value,
    }));
  };

  const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRuleData((prev) => ({
      ...prev,
      status: event.target.checked,
    }));
  };

  const handleAddTrigger = () => {
    const trigger: Trigger = {
      ...newTrigger,
      id: Date.now(),
    };
    setTriggers((prev) => [...prev, trigger]);
    setIsAddTriggerDialogOpen(false);
    setNewTrigger({
      query: 'Code Result: Vulnerability',
      condition: 'equals',
      value: 'Critical',
    });
  };

  const handleDeleteTrigger = (triggerId: number) => {
    setTriggers((prev) => prev.filter((trigger) => trigger.id !== triggerId));
  };

  const handleTriggerChange = (field: keyof Omit<Trigger, 'id'>) => (
    event: SelectChangeEvent<string>
  ) => {
    setNewTrigger((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    onSave(ruleData);
    onClose();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              General Details
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configure the basic settings for your rule.
            </Typography>

            <FormControl fullWidth margin="normal" disabled>
              <InputLabel>Rule Template</InputLabel>
              <Select
                value={ruleData.type}
                onChange={handleSelectChange}
                label="Rule Template"
              >
                {ruleTemplates.map((template) => (
                  <MenuItem key={template} value={template}>
                    {template}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Name"
              value={ruleData.name}
              onChange={handleTextFieldChange('name')}
              margin="normal"
              required
              placeholder="Enter a descriptive name for your rule"
            />

            <TextField
              fullWidth
              label="Description"
              value={ruleData.description}
              onChange={handleTextFieldChange('description')}
              margin="normal"
              multiline
              rows={4}
              required
              placeholder="Describe the purpose and scope of this rule"
            />

            <FormControl fullWidth margin="normal" disabled>
              <InputLabel>Category</InputLabel>
              <Select
                value={ruleData.type}
                onChange={handleSelectChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl component="fieldset" margin="normal" required>
              <FormLabel component="legend">Type</FormLabel>
              <RadioGroup
                value={ruleData.type}
                onChange={handleSelectChange}
                row
              >
                {ruleTypes.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={<Radio />}
                    label={type}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth margin="normal" disabled>
              <InputLabel>Priority</InputLabel>
              <Select
                value={ruleData.type}
                onChange={handleSelectChange}
                label="Priority"
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Status</FormLabel>
              <FormControlLabel
                control={
                  <Switch
                    checked={ruleData.status}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label={ruleData.status ? 'On' : 'Off'}
              />
            </FormControl>

            <FormControl fullWidth margin="normal" disabled>
              <InputLabel>Scope</InputLabel>
              <Select
                value={ruleData.type}
                onChange={handleSelectChange}
                label="Scope"
              >
                {scopes.map((scope) => (
                  <MenuItem key={scope} value={scope}>
                    {scope}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3 
            }}>
              <Typography variant="h6" gutterBottom>
                Trigger
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsAddTriggerDialogOpen(true)}
                sx={{ 
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Add Trigger
              </Button>
            </Box>

            {triggers.length === 0 ? (
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: 'background.default'
                }}
              >
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No triggers have been added yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click "Add Trigger" to create your first trigger
                </Typography>
              </Paper>
            ) : (
              <List>
                {triggers.map((trigger) => (
                  <ListItem
                    key={trigger.id}
                    divider
                    sx={{
                      backgroundColor: 'background.paper',
                      mb: 1,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box component="span" sx={{ typography: 'body1' }}>
                          {trigger.query} {trigger.condition} {trigger.value}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteTrigger(trigger.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}

            <MuiDialog
              open={isAddTriggerDialogOpen}
              onClose={() => setIsAddTriggerDialogOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Add Trigger</DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Query</InputLabel>
                    <Select
                      value={newTrigger.query}
                      onChange={handleTriggerChange('query')}
                      label="Query"
                    >
                      <MenuItem value="Code Result: Vulnerability">
                        Code Result: Vulnerability
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Condition</InputLabel>
                    <Select
                      value={newTrigger.condition}
                      onChange={handleTriggerChange('condition')}
                      label="Condition"
                    >
                      <MenuItem value="equals">equals</MenuItem>
                      <MenuItem value="not equals">not equals</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Value</InputLabel>
                    <Select
                      value={newTrigger.value}
                      onChange={handleTriggerChange('value')}
                      label="Value"
                    >
                      <MenuItem value="Critical">Critical</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsAddTriggerDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddTrigger} variant="contained">
                  Add
                </Button>
              </DialogActions>
            </MuiDialog>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Configure the actions to take when triggers are activated.
            </Typography>

            <FormControl component="fieldset" margin="normal" required>
              <FormLabel component="legend">Action</FormLabel>
              <RadioGroup
                value={ruleData.type}
                onChange={handleSelectChange}
              >
                {actionTypes.map((action) => (
                  <FormControlLabel
                    key={action.value}
                    value={action.value}
                    control={<Radio />}
                    label={action.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label="Action Name"
              value={ruleData.name}
              onChange={handleTextFieldChange('name')}
              margin="normal"
              required
              placeholder="Enter a name for this action"
            />

            <TextField
              fullWidth
              label="Description"
              value={ruleData.description}
              onChange={handleTextFieldChange('description')}
              margin="normal"
              multiline
              rows={4}
              required
              placeholder="Describe what this action does"
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Risk Level</InputLabel>
              <Select
                value={ruleData.type}
                onChange={handleSelectChange}
                label="Risk Level"
              >
                {riskLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Remediation Steps"
              value={ruleData.description}
              onChange={handleTextFieldChange('description')}
              margin="normal"
              multiline
              rows={4}
              required
              placeholder="Enter the steps to remediate this issue"
            />
          </Box>
        );

      case 3:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trigger Results
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Review the triggers that will activate this rule.
            </Typography>

            {triggers.length === 0 ? (
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: 'background.default'
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No triggers have been configured
                </Typography>
              </Paper>
            ) : (
              <List>
                {triggers.map((trigger) => (
                  <ListItem
                    key={trigger.id}
                    divider
                    sx={{
                      backgroundColor: 'background.paper',
                      mb: 1,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box component="span" sx={{ typography: 'body1' }}>
                          {trigger.query} {trigger.condition} {trigger.value}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteTrigger(trigger.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!ruleData.name;
      case 1:
        return triggers.length > 0;
      case 2:
        return !!ruleData.name && !!ruleData.description;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '600px',
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          Create New Rule for {policyCategory} Policy
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          <Paper 
            elevation={0} 
            sx={{ 
              width: 240,
              borderRight: '1px solid',
              borderColor: 'divider',
              p: 2,
            }}
          >
            <Stepper 
              activeStep={activeStep} 
              orientation="vertical"
              sx={{ 
                '& .MuiStepLabel-label': {
                  fontSize: '0.875rem',
                },
              }}
            >
              {ruleSteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
          <Box sx={{ flexGrow: 1, p: 3 }}>
            {renderStepContent(activeStep)}
          </Box>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>Back</Button>
        )}
        {activeStep === ruleSteps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!isStepValid(activeStep)}
          >
            Create Rule
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={!isStepValid(activeStep)}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateRuleWizard; 