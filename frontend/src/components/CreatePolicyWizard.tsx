import React, { useState, useEffect, ChangeEvent } from 'react';
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
  FormLabel as MuiFormLabel,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { CreatePolicyData, Rule, PolicyCategory, PolicyType, PolicyPriority } from '../types/policy';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateRuleWizard from './CreateRuleWizard';

interface ExtendedPolicyData extends CreatePolicyData {
  type: PolicyType;
  scope: string;
}

interface CreatePolicyWizardProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePolicyData) => Promise<void>;
  selectedCategory: PolicyCategory;
}

const steps = ['General details and scope', 'Rules', 'Review'];

const categories = [
  'Security',
  'Compliance',
  'Operations',
  'Cost',
];

const policyTypes = [
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
  'Default',
  'Global',
  'Environment',
  'Resource Group',
  'Resource',
];

const actions = [
  'Allow',
  'Deny',
  'Audit',
  'Notify',
];

const CreatePolicyWizard: React.FC<CreatePolicyWizardProps> = ({
  open,
  onClose,
  onSubmit,
  selectedCategory,
}: CreatePolicyWizardProps) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<ExtendedPolicyData>({
    name: '',
    description: '',
    category: selectedCategory,
    type: 'Default',
    priority: 0,
    status: true,
    scope: 'Default',
  });
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  const [isRuleWizardOpen, setIsRuleWizardOpen] = useState(false);

  useEffect(() => {
    setFormData((prev: ExtendedPolicyData) => ({
      ...prev,
      category: selectedCategory,
    }));
  }, [selectedCategory]);

  const handleNext = () => {
    setActiveStep((prevStep: number) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleTextFieldChange = (field: keyof ExtendedPolicyData) => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev: ExtendedPolicyData) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: keyof ExtendedPolicyData) => (
    event: SelectChangeEvent<string>
  ) => {
    setFormData((prev: ExtendedPolicyData) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: ExtendedPolicyData) => ({
      ...prev,
      type: event.target.value as PolicyType,
    }));
  };

  const handleSwitchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: ExtendedPolicyData) => ({
      ...prev,
      status: event.target.checked,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log('Submitting policy data:', formData);
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      console.error('Error creating policy:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        fullError: error
      });
      // You might want to show this error to the user in a more user-friendly way
      alert(`Failed to create policy: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomRule = () => {
    setIsRuleWizardOpen(true);
  };

  const handleRuleSave = (ruleData: Omit<Rule, 'id' | 'policy_id' | 'created_at' | 'updated_at'>) => {
    // Create a temporary rule object with the provided data
    const newRule: Rule = {
      ...ruleData,
      id: Date.now(), // Temporary ID for frontend use
      policy_id: 0, // This will be set by the backend
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setRules((prevRules) => [...prevRules, newRule]);
    setIsRuleWizardOpen(false);
  };

  const handleDeleteRule = (ruleId: number) => {
    setRules((prevRules) => prevRules.filter((rule) => rule.id !== ruleId));
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
              Configure the basic settings for your {selectedCategory} policy.
            </Typography>
            
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={handleTextFieldChange('name')}
              margin="normal"
              required
              placeholder={`Enter a descriptive name for your ${selectedCategory} policy`}
            />
            
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={handleTextFieldChange('description')}
              margin="normal"
              multiline
              rows={4}
              required
              placeholder={`Describe the purpose and scope of this ${selectedCategory} policy`}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={handleSelectChange('category')}
                label="Category"
                disabled
              >
                <MenuItem value={selectedCategory}>{selectedCategory}</MenuItem>
              </Select>
            </FormControl>

            <FormControl component="fieldset" margin="normal">
              <MuiFormLabel component="legend">Type</MuiFormLabel>
              <RadioGroup
                value={formData.type}
                onChange={handleRadioChange}
                row
              >
                <FormControlLabel
                  value="Default"
                  control={<Radio />}
                  label="Default"
                />
                <FormControlLabel
                  value="Built-in"
                  control={<Radio />}
                  label="Built-in"
                />
                <FormControlLabel
                  value="Custom"
                  control={<Radio />}
                  label="Custom"
                />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth margin="normal" disabled>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority?.toString() ?? '0'}
                label="Priority"
                disabled
              >
                <MenuItem value="0">Low</MenuItem>
                <MenuItem value="1">Medium</MenuItem>
                <MenuItem value="2">High</MenuItem>
                <MenuItem value="3">Critical</MenuItem>
              </Select>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Priority selection will be enabled in a future update
              </Typography>
            </FormControl>

            <FormControl component="fieldset" margin="normal">
              <MuiFormLabel component="legend">Status</MuiFormLabel>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status}
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label={formData.status ? 'On' : 'Off'}
              />
            </FormControl>

            <FormControl fullWidth margin="normal" disabled>
              <InputLabel>Scope</InputLabel>
              <Select
                value={formData.scope || 'Default'}
                label="Scope"
                disabled
              >
                {scopes.map((scope) => (
                  <MenuItem key={scope} value={scope}>
                    {scope}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                Scope selection will be enabled in a future update
              </Typography>
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
                Rules
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateCustomRule}
                sx={{ 
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Create Custom Rule
              </Button>
            </Box>

            {rules.length === 0 ? (
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: 'background.default'
                }}
              >
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No rules have been created yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click "Create Custom Rule" to add your first rule
                </Typography>
              </Paper>
            ) : (
              <List>
                {rules.map((rule) => (
                  <ListItem
                    key={rule.id}
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
                          {rule.name}
                        </Box>
                      }
                      secondary={
                        <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                          <Box component="span" sx={{ typography: 'body2', color: 'text.secondary', display: 'block' }}>
                            {rule.description}
                          </Box>
                          <Box component="span" sx={{ typography: 'caption', color: 'text.secondary', display: 'block' }}>
                            Type: {rule.type}
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteRule(rule.id)}
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
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Policy Details
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Review the policy configuration before creating.
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                General Details
              </Typography>
              <Typography><strong>Name:</strong> {formData.name}</Typography>
              <Typography><strong>Description:</strong> {formData.description}</Typography>
              <Typography><strong>Type:</strong> {formData.type}</Typography>
              <Typography><strong>Scope:</strong> {formData.scope || 'Default'}</Typography>
              <Typography><strong>Status:</strong> {formData.status ? 'On' : 'Off'}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Rules
              </Typography>
              {rules.length === 0 ? (
                <Typography color="text.secondary">No rules added</Typography>
              ) : (
                rules.map((rule) => (
                  <Typography key={rule.id}>
                    • {rule.name} ({rule.type})
                  </Typography>
                ))
              )}
            </Paper>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
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
            Create New {selectedCategory} Policy
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
                {steps.map((label, index) => (
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
          {activeStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Policy'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={
                activeStep === 0 && (!formData.name || !formData.description) ||
                activeStep === 1 && rules.length === 0
              }
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <CreateRuleWizard
        open={isRuleWizardOpen}
        onClose={() => setIsRuleWizardOpen(false)}
        onSave={handleRuleSave}
        policyCategory={selectedCategory}
      />
    </>
  );
};

export default CreatePolicyWizard; 