import React, { useState } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface CreateRuleWizardProps {
  open: boolean;
  onClose: () => void;
  onSave: (rule: Rule) => void;
}

interface Rule {
  id: number;
  name: string;
  description: string;
  template: string;
  category: string;
  type: string;
  priority: string;
  status: boolean;
  scope: string;
  triggers: Trigger[];
  action: Action;
}

interface Trigger {
  id: number;
  queryType: 'AND' | 'OR';
  codeResult: string;
  condition: 'equals' | 'not equals';
  value: string;
}

interface Action {
  type: 'recommendation' | 'alert' | 'block' | 'run' | 'ignore';
  name: string;
  description: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  remediationSteps: string;
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

const CreateRuleWizard: React.FC<CreateRuleWizardProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [rule, setRule] = useState<Rule>({
    id: Date.now(),
    name: '',
    description: '',
    template: '',
    category: '',
    type: 'Default',
    priority: '',
    status: true,
    scope: '',
    triggers: [],
    action: {
      type: 'recommendation',
      name: '',
      description: '',
      riskLevel: 'Medium',
      remediationSteps: '',
    },
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleTextFieldChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log('TextField change:', { field, value: event.target.value });
    if (field.startsWith('action.')) {
      const actionField = field.split('.')[1];
      console.log('Updating action field:', actionField);
      setRule((prev) => ({
        ...prev,
        action: {
          ...prev.action,
          [actionField]: event.target.value,
        },
      }));
    } else {
      console.log('Updating rule field:', field);
      setRule((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    }
  };

  const handleSelectChange = (field: string) => (
    event: SelectChangeEvent
  ) => {
    if (field.startsWith('action.')) {
      const actionField = field.split('.')[1];
      setRule((prev) => ({
        ...prev,
        action: {
          ...prev.action,
          [actionField]: event.target.value,
        },
      }));
    } else {
      setRule((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    }
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRule((prev) => ({
      ...prev,
      type: event.target.value,
    }));
  };

  const handleActionTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRule((prev) => ({
      ...prev,
      action: {
        ...prev.action,
        type: event.target.value as Action['type'],
      },
    }));
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRule((prev) => ({
      ...prev,
      status: event.target.checked,
    }));
  };

  const handleAddTrigger = () => {
    setRule((prev) => ({
      ...prev,
      triggers: [
        ...prev.triggers,
        {
          id: Date.now(),
          queryType: 'AND',
          codeResult: 'Vulnerability',
          condition: 'equals',
          value: 'Critical',
        },
      ],
    }));
  };

  const handleDeleteTrigger = (triggerId: number) => {
    setRule((prev) => ({
      ...prev,
      triggers: prev.triggers.filter((t) => t.id !== triggerId),
    }));
  };

  const handleTriggerChange = (
    triggerId: number,
    field: keyof Trigger,
    value: string
  ) => {
    setRule((prev) => ({
      ...prev,
      triggers: prev.triggers.map((t) =>
        t.id === triggerId ? { ...t, [field]: value } : t
      ),
    }));
  };

  const handleSave = () => {
    onSave(rule);
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
                value={rule.template}
                onChange={handleSelectChange('template')}
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
              value={rule.name}
              onFocus={(e) => console.log('Name field focused')}
              onBlur={(e) => console.log('Name field blurred')}
              onKeyDown={(e) => console.log('Name field keydown:', e.key)}
              onKeyPress={(e) => console.log('Name field keypress:', e.key)}
              onChange={(e) => {
                console.log('Name field raw change event:', e);
                const value = e.target.value;
                console.log('Attempting to set name to:', value);
                setRule(prev => {
                  console.log('Previous rule state:', prev);
                  const newState = { ...prev, name: value };
                  console.log('New rule state:', newState);
                  return newState;
                });
              }}
              margin="normal"
              required
              placeholder="Enter a descriptive name for your rule"
              autoComplete="off"
            />

            <TextField
              fullWidth
              label="Description"
              value={rule.description}
              onFocus={(e) => console.log('Description field focused')}
              onBlur={(e) => console.log('Description field blurred')}
              onKeyDown={(e) => console.log('Description field keydown:', e.key)}
              onKeyPress={(e) => console.log('Description field keypress:', e.key)}
              onChange={(e) => {
                console.log('Description field raw change event:', e);
                const value = e.target.value;
                console.log('Attempting to set description to:', value);
                setRule(prev => {
                  console.log('Previous rule state:', prev);
                  const newState = { ...prev, description: value };
                  console.log('New rule state:', newState);
                  return newState;
                });
              }}
              margin="normal"
              multiline
              rows={4}
              required
              placeholder="Describe the purpose of this rule"
              autoComplete="off"
            />

            <FormControl fullWidth margin="normal" disabled>
              <InputLabel>Category</InputLabel>
              <Select
                value={rule.category}
                onChange={handleSelectChange('category')}
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
                value={rule.type}
                onChange={handleRadioChange}
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
                value={rule.priority}
                onChange={handleSelectChange('priority')}
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
                    checked={rule.status}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label={rule.status ? 'On' : 'Off'}
              />
            </FormControl>

            <FormControl fullWidth margin="normal" disabled>
              <InputLabel>Scope</InputLabel>
              <Select
                value={rule.scope}
                onChange={handleSelectChange('scope')}
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
                onClick={handleAddTrigger}
                sx={{ 
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Add Trigger
              </Button>
            </Box>

            {rule.triggers.length === 0 ? (
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
                {rule.triggers.map((trigger, index) => (
                  <ListItem
                    key={trigger.id}
                    divider
                    sx={{
                      backgroundColor: 'background.paper',
                      mb: 1,
                      borderRadius: 1,
                      flexDirection: 'column',
                      alignItems: 'stretch',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {index > 0 && (
                        <FormControl sx={{ minWidth: 120, mr: 2 }}>
                          <Select
                            value={trigger.queryType}
                            onChange={(e) => handleTriggerChange(trigger.id, 'queryType', e.target.value)}
                            size="small"
                          >
                            <MenuItem value="AND">AND</MenuItem>
                            <MenuItem value="OR">OR</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                        Code Result: {trigger.codeResult}
                      </Typography>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteTrigger(trigger.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <FormControl sx={{ minWidth: 120 }}>
                        <Select
                          value={trigger.condition}
                          onChange={(e) => handleTriggerChange(trigger.id, 'condition', e.target.value)}
                          size="small"
                        >
                          <MenuItem value="equals">equals</MenuItem>
                          <MenuItem value="not equals">not equals</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl sx={{ minWidth: 120 }}>
                        <Select
                          value={trigger.value}
                          onChange={(e) => handleTriggerChange(trigger.id, 'value', e.target.value)}
                          size="small"
                        >
                          {priorities.map((priority) => (
                            <MenuItem key={priority} value={priority}>
                              {priority}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
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
                value={rule.action.type}
                onChange={handleActionTypeChange}
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
              value={rule.action.name}
              onChange={handleTextFieldChange('action.name')}
              margin="normal"
              required
              placeholder="Enter a name for this action"
            />

            <TextField
              fullWidth
              label="Description"
              value={rule.action.description}
              onChange={handleTextFieldChange('action.description')}
              margin="normal"
              multiline
              rows={4}
              required
              placeholder="Describe what this action does"
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Risk Level</InputLabel>
              <Select
                value={rule.action.riskLevel}
                onChange={handleSelectChange('action.riskLevel')}
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
              value={rule.action.remediationSteps}
              onChange={handleTextFieldChange('action.remediationSteps')}
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

            {rule.triggers.length === 0 ? (
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
                {rule.triggers.map((trigger, index) => (
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
                        <Typography variant="body1" component="div">
                          {trigger.codeResult} {trigger.condition} {trigger.value}
                        </Typography>
                      }
                    />
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
        return !!rule.name;
      case 1:
        return rule.triggers.length > 0;
      case 2:
        return !!rule.action.type && !!rule.action.name;
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
          Create Custom Rule
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
            onClick={handleSave}
            variant="contained"
          >
            Save Rule
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