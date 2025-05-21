import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Policy, PolicyCategory, CreatePolicyData } from '../types/policy';
import CreatePolicyWizard from '../components/CreatePolicyWizard';
import { usePolicyService } from '../services/policyService';

const policyCategories: PolicyCategory[] = [
  'Posture',
  'Drift Detection',
  'Gated Deployment',
  'DevOps',
  'FIM',
  'Anti-malware',
];

const PolicyList: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState<boolean>(false);
  const { getPolicies, createPolicy, updatePolicy, deletePolicy } = usePolicyService();

  const selectedCategory = policyCategories[selectedTab];

  useEffect(() => {
    fetchPolicies();
  }, [selectedCategory]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPolicies({ category: selectedCategory });
      setPolicies(data);
    } catch (err) {
      setError('Failed to fetch policies. Please try again later.');
      console.error('Error fetching policies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleCreatePolicy = async (data: CreatePolicyData) => {
    try {
      await createPolicy(data);
      await fetchPolicies();
      setIsCreateWizardOpen(false);
    } catch (err) {
      setError('Failed to create policy. Please try again.');
      console.error('Error creating policy:', err);
    }
  };

  const handleEditPolicy = async (policy: Policy) => {
    try {
      await updatePolicy(policy.id, policy);
      await fetchPolicies();
    } catch (err) {
      setError('Failed to update policy. Please try again.');
      console.error('Error updating policy:', err);
    }
  };

  const handleDeletePolicy = async (policyId: number) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await deletePolicy(policyId);
        await fetchPolicies();
      } catch (err) {
        setError('Failed to delete policy. Please try again.');
        console.error('Error deleting policy:', err);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Policy Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateWizardOpen(true)}
        >
          Create New {selectedCategory} Policy
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="policy category tabs"
        >
          {policyCategories.map((category, index) => (
            <Tab
              key={category}
              label={category}
              id={`policy-tab-${index}`}
              aria-controls={`policy-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Rules</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>{policy.name}</TableCell>
                  <TableCell>{policy.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={['Low', 'Medium', 'High', 'Critical'][policy.priority]}
                      color={
                        policy.priority === 0
                          ? 'success'
                          : policy.priority === 1
                          ? 'info'
                          : policy.priority === 2
                          ? 'warning'
                          : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={policy.status ? 'Enabled' : 'Disabled'}
                      color={policy.status ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{policy.rules?.length || 0}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEditPolicy(policy)}
                      aria-label="edit policy"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeletePolicy(policy.id)}
                      aria-label="delete policy"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {policies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" color="text.secondary">
                      No {selectedCategory} policies found. Create one to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreatePolicyWizard
        open={isCreateWizardOpen}
        onClose={() => setIsCreateWizardOpen(false)}
        onSubmit={handleCreatePolicy}
        selectedCategory={selectedCategory}
      />
    </Box>
  );
};

export default PolicyList; 