import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { databasesService, modelsService } from '../../services';
import type { Database } from '../../types';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

function ModelCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    database_id: '',
    database_name: '',
    table_name: '',
    model_name: '',
    description: ''
  });
  const [databases, setDatabases] = useState<Database[]>([]);
  const [databaseNames, setDatabaseNames] = useState<string[]>([]);
  const [tableNames, setTableNames] = useState<string[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDatabases, setIsLoadingDatabases] = useState(false);
  const [isLoadingDatabaseNames, setIsLoadingDatabaseNames] = useState(false);
  const [isLoadingTableNames, setIsLoadingTableNames] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch database connections on component mount
  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        setIsLoadingDatabases(true);
        const response = await databasesService.getDatabases(1,1000);
        setDatabases(response.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch database connections');
      } finally {
        setIsLoadingDatabases(false);
      }
    };

    fetchDatabases();
  }, []);

  // Fetch database names when database_id changes
  useEffect(() => {
    const fetchDatabaseNames = async () => {
      if (!formData.database_id) {
        setDatabaseNames([]);
        return;
      }

      try {
        setIsLoadingDatabaseNames(true);
        const response = await databasesService.getDatabaseNames(Number(formData.database_id));
        console.log('response data array:' + Array.isArray(response))
        setDatabaseNames(Array.isArray(response) ? response : []);
        setFormData(prev => ({ ...prev, database_name: '' }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch database names');
        setDatabaseNames([]);
      } finally {
        setIsLoadingDatabaseNames(false);
      }
    };

    fetchDatabaseNames();
  }, [formData.database_id]);

  // Fetch table names when database_id and database_name change
  useEffect(() => {
    const fetchTableNames = async () => {
      if (!formData.database_id || !formData.database_name) {
        setTableNames([]);
        return;
      }

      try {
        setIsLoadingTableNames(true);
        const response = await databasesService.getTableNames(
          Number(formData.database_id),
          formData.database_name
        );
        setTableNames(Array.isArray(response) ? response : []);
        setFormData(prev => ({ ...prev, table_name: '' }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch table names');
        setTableNames([]);
      } finally {
        setIsLoadingTableNames(false);
      }
    };

    fetchTableNames();
  }, [formData.database_id, formData.database_name]);

  // Function to fetch fields for the selected table
  const fetchFields = async () => {
    if (!formData.database_id || !formData.database_name || !formData.table_name) {
      setFields([]);
      return;
    }
    try {
      const response = await databasesService.getTableFields(
        Number(formData.database_id),
        formData.database_name,
        formData.table_name
      );
      const initializedFields = response.map((field: any) => ({
        ...field,
        semantic_type: field.semantic_type || '',
        extended_config: field.extended_config || '',
        alias: field.alias || ''
      }));
      setFields(initializedFields || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch table fields');
      setFields([]);
    }
  };

  const handleFieldChange = (index: number, field: string, value: any) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [field]: value };
    setFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2) {
      try {
        setIsLoading(true);
        setError(null);

        // Validate required fields
        //if (!formData.database_id || !formData.database_name || !formData.table_name || !formData.model_name) {
        //  throw new Error('Please fill in all required fields');
        //}

        await modelsService.createModel({
          database_id: Number(formData.database_id),
          database_name: formData.database_name,
          table_name: formData.table_name,
          model_name: formData.model_name,
          description: formData.description,
          fields: fields
        });

        navigate('/models');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create model');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNext = async () => {
    if (!formData.database_id || !formData.database_name || !formData.table_name || !formData.model_name) {
        setError('Please fill in all required fields for Basic Information');
        return;
    }
    setError(null);
    await fetchFields();
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleCancel = () => {
    navigate('/models');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Model
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {step === 1 && (
          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Database Connection</InputLabel>
              <Select
                value={formData.database_id}
                onChange={(e) => setFormData(prev => ({ ...prev, database_id: e.target.value }))}
                label="Database Connection"
                disabled={isLoading || isLoadingDatabases}
                required
              >
                {databases.map((db) => (
                  <MenuItem key={db.id} value={db.id}>
                    {db.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Database Name</InputLabel>
              <Select
                value={formData.database_name}
                onChange={(e) => setFormData(prev => ({ ...prev, database_name: e.target.value }))}
                label="Database Name"
                disabled={isLoading || isLoadingDatabaseNames || !formData.database_id}
                required
              >
                {Array.isArray(databaseNames) && databaseNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Table Name</InputLabel>
              <Select
                value={formData.table_name}
                onChange={(e) => setFormData(prev => ({ ...prev, table_name: e.target.value }))}
                label="Table Name"
                disabled={isLoading || isLoadingTableNames || !formData.database_name}
                required
              >
                {Array.isArray(tableNames) && tableNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Model Name"
              value={formData.model_name}
              onChange={(e) => setFormData(prev => ({ ...prev, model_name: e.target.value }))}
              required
              margin="normal"
              disabled={isLoading}
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={4}
              margin="normal"
              disabled={isLoading}
            />

            <Box mt={3}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                disabled={isLoading}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={isLoading}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {step === 2 && (
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              Field Information
            </Typography>
            {fields.length > 0 ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="left">Type</TableCell>
                      <TableCell align="left">Semantic Type</TableCell>
                      <TableCell align="left">Formular</TableCell>
                      <TableCell align="left">Alias</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((field: any, index: number) => (
                      <TableRow
                        key={field.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {field.name}
                        </TableCell>
                        <TableCell align="right">{field.type}</TableCell>
                        <TableCell align="right">
                          <TextField
                            value={field.semantic_type || ''}
                            onChange={(e) => handleFieldChange(index, 'semantic_type', e.target.value)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            value={field.extended_config || ''}
                            onChange={(e) => handleFieldChange(index, 'extended_config', e.target.value)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            value={field.alias || ''}
                            onChange={(e) => handleFieldChange(index, 'alias', e.target.value)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No fields found for this table.</Typography>
            )}

            <Box mt={3}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleBack}
                disabled={isLoading}
                sx={{ mr: 2 }}
              >
                Back
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                disabled={isLoading}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? 'Creating...' : 'Save'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ModelCreate; 