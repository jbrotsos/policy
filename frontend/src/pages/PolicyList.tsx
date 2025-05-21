import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import policyService, { Policy, CreatePolicyData } from '../services/policyService';
import CreatePolicyWizard from '../components/CreatePolicyWizard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`policy-tabpanel-${index}`}
      aria-labelledby={`policy-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const policyTypes = [
  'Default',
  'Built-in',
  'Custom',
];

const PolicyList: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const data = await policyService.getPolicies();
      setPolicies(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch policies');
      console.error('Error fetching policies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleCreatePolicy = () => {
    setWizardOpen(true);
  };

  const handleWizardClose = () => {
    setWizardOpen(false);
  };

  const handleWizardSubmit = async (data: CreatePolicyData) => {
    try {
      await policyService.createPolicy(data);
      await fetchPolicies();
      setSnackbar({
        open: true,
        message: 'Policy created successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to create policy',
        severity: 'error',
      });
      console.error('Error creating policy:', err);
    }
  };

  const handleEditPolicy = async (policyId: number) => {
    // TODO: Implement edit policy dialog
    console.log('Edit policy', policyId);
  };

  const handleDeletePolicy = async (policyId: number) => {
    try {
      await policyService.deletePolicy(policyId);
      await fetchPolicies();
      setSnackbar({
        open: true,
        message: 'Policy deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete policy',
        severity: 'error',
      });
      console.error('Error deleting policy:', err);
    }
  };

  const handleToggleStatus = async (policyId: number, currentStatus: boolean) => {
    try {
      await policyService.togglePolicyStatus(policyId, !currentStatus);
      await fetchPolicies();
      setSnackbar({
        open: true,
        message: `Policy ${currentStatus ? 'disabled' : 'enabled'} successfully`,
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Failed to ${currentStatus ? 'disable' : 'enable'} policy`,
        severity: 'error',
      });
      console.error('Error toggling policy status:', err);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const filteredPolicies = policies.filter(
    (policy) => policy.type === policyTypes[selectedTab]
  );

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2,
        px: 2,
        py: 1,
      }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange} 
          aria-label="policy type tabs"
          sx={{ minHeight: 48 }}
        >
          {policyTypes.map((type, index) => (
            <Tab 
              key={type} 
              label={type} 
              id={`policy-tab-${index}`}
              sx={{ 
                textTransform: 'none',
                minHeight: 48,
                px: 3,
              }}
            />
          ))}
        </Tabs>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreatePolicy}
          sx={{ 
            ml: 2,
            textTransform: 'none',
            px: 3,
          }}
        >
          Create New Policy
        </Button>
      </Box>

      {policyTypes.map((type, index) => (
        <TabPanel key={type} value={selectedTab} index={index}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Policy Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPolicies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          No policies found. Click "Create New Policy" to add one.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPolicies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell>{policy.name}</TableCell>
                        <TableCell>{policy.category}</TableCell>
                        <TableCell>{policy.type}</TableCell>
                        <TableCell>
                          {policy.priority === 0 ? 'Low' :
                           policy.priority === 1 ? 'Medium' :
                           policy.priority === 2 ? 'High' :
                           policy.priority === 3 ? 'Critical' : 'Unknown'}
                        </TableCell>
                        <TableCell>{policy.status ? 'Enabled' : 'Disabled'}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit Policy">
                            <IconButton 
                              onClick={() => handleEditPolicy(policy.id)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Policy">
                            <IconButton 
                              onClick={() => handleDeletePolicy(policy.id)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={policy.status ? 'Disable Policy' : 'Enable Policy'}>
                            <IconButton 
                              onClick={() => handleToggleStatus(policy.id, policy.status)}
                              size="small"
                            >
                              {policy.status ? <ToggleOnIcon /> : <ToggleOffIcon />}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      ))}

      <CreatePolicyWizard
        open={wizardOpen}
        onClose={handleWizardClose}
        onSubmit={handleWizardSubmit}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PolicyList; 