import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { modelsService, databasesService } from '../../services';
import type { Model, Database } from '../../types';
import {
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
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

function ModelEdit() {
  const { id } = useParams<{ id: string }>();
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
  const [isLoadingDatabases, setIsLoadingDatabases] = useState(true);
  const [isLoadingDatabaseNames, setIsLoadingDatabaseNames] = useState(false);
  const [isLoadingTableNames, setIsLoadingTableNames] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch database connections on component mount
  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        setIsLoadingDatabases(true);
        const response = await databasesService.getDatabases(1, 1000);
        setDatabases(response.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch database connections');
      } finally {
        setIsLoadingDatabases(false);
      }
    };

    fetchDatabases();
  }, []);

  // Fetch model data and related dropdowns
  useEffect(() => {
    const fetchModel = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const modelData = await modelsService.getModel(Number(id));
        setFormData({
          database_id: modelData.data.database_id.toString(),
          database_name: modelData.data.database_name || '',
          table_name: modelData.data.table_name || '',
          model_name: modelData.data.model_name || '',
          description: modelData.data.description || ''
        });

        // Fetch database names for the selected database connection
        if (modelData.data.database_id) {
          const dbNamesResponse = await databasesService.getDatabaseNames(modelData.data.database_id);
          setDatabaseNames(dbNamesResponse || []);

          // Fetch table names for the selected database and database name
          if (modelData.data.database_name) {
            const tableNamesResponse = await databasesService.getTableNames(
              modelData.data.database_id,
              modelData.data.database_name
            );
            setTableNames(tableNamesResponse || []);

            // Fetch fields for the selected table if available and initialize them
            if (modelData.data.table_name) {
              const fieldsResponse = await databasesService.getTableFields(
                modelData.data.database_id,
                modelData.data.database_name,
                modelData.data.table_name
              );
              // Initialize editable fields if they are null or undefined
              const initializedFields = fieldsResponse.map((field: any) => ({
                 ...field,
                 semantic_type: field.semantic_type || '',
                 extended_config: field.extended_config || '',
                 alias: field.alias || ''
              }));
              setFields(initializedFields || []);
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch model');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModel();
  }, [id]);

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
        setDatabaseNames(response || []);
        // Do not clear database_name here in edit mode to preserve existing value
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch database names');
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
        setTableNames(response || []);
        // Do not clear table_name here in edit mode to preserve existing value
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch table names');
      } finally {
        setIsLoadingTableNames(false);
      }
    };

    fetchTableNames();
  }, [formData.database_id, formData.database_name]);

  const handleChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

   const handleFieldChange = (index: number, field: string, value: any) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [field]: value };
    setFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    // Only submit when on the final step
    if (step === 2) {
      try {
        setIsLoading(true);
        setError(null);
        await modelsService.updateModel(Number(id), {
          ...formData,
          database_id: Number(formData.database_id),
          fields: fields // Include fields in the submission
        });
        navigate('/models');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update model');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNext = async () => {
     // Validate step 1 fields before moving to step 2
    if (!formData.database_id || !formData.database_name || !formData.table_name || !formData.model_name) {
        setError('Please fill in all required fields for Basic Information');
        return;
    }
    setError(null); // Clear previous errors
    // Fetch fields only if they haven't been fetched already (e.g., on initial load)
    if (fields.length === 0) {
       await fetchFields();
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleCancel = () => {
    navigate('/models');
  };

  const fetchFields = async () => {
    if (!formData.database_id || !formData.database_name || !formData.table_name) {
      setFields([]);
      return;
    }
    try {
      // setIsLoadingFields(true); // Assuming a loading state for fields
      const response = await databasesService.getTableFields(
        Number(formData.database_id),
        formData.database_name,
        formData.table_name
      );
      // Assuming response is an array of field objects with properties like name, type, semantic_type, extended_config, alias
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
    } finally {
      // setIsLoadingFields(false);
    }
  };


  if (isLoading && !formData.model_name && step === 1) { // Only show loading on initial load in step 1
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Model
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

         {step === 1 && ( // Render basic info form if step is 1
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid sx={{ width: '100%' }}>
                    <FormControl fullWidth required>
                      <InputLabel>Database Connection</InputLabel>
                      <Select
                        value={formData.database_id}
                        onChange={handleChange('database_id')}
                        label="Database Connection"
                        disabled={isLoading || isLoadingDatabases}
                      >
                        {databases.map((db) => (
                          <MenuItem key={db.id} value={db.id}>
                            {db.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid sx={{ width: '100%' }}>
                    <FormControl fullWidth required>
                      <InputLabel>Database Name</InputLabel>
                      <Select
                        value={formData.database_name}
                        onChange={handleChange('database_name')}
                        label="Database Name"
                        disabled={isLoading || isLoadingDatabaseNames || !formData.database_id}
                      >
                        {databaseNames.map((name) => (
                          <MenuItem key={name} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid sx={{ width: '100%' }}>
                    <FormControl fullWidth required>
                      <InputLabel>Table Name</InputLabel>
                      <Select
                        value={formData.table_name}
                        onChange={handleChange('table_name')}
                        label="Table Name"
                        disabled={isLoading || isLoadingTableNames || !formData.database_name}
                      >
                        {tableNames.map((name) => (
                          <MenuItem key={name} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      label="Model Name"
                      value={formData.model_name}
                      onChange={handleChange('model_name')}
                      required
                      disabled={isLoading}
                    />
                  </Grid>

                  <Grid sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={formData.description}
                      onChange={handleChange('description')}
                      multiline
                      rows={4}
                      disabled={isLoading}
                    />
                  </Grid>

                  <Grid sx={{ width: '100%' }} mt={3}>
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
                  </Grid>
                </Grid>
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
                          <TableCell align="right">Type</TableCell>
                          <TableCell align="right">Semantic Type</TableCell>
                          <TableCell align="right">Extended Config</TableCell>
                          <TableCell align="right">Alias</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fields.map((field: any, index: number) => (
                          <TableRow
                            key={field.name} // Assuming name is unique per table
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
                       onClick={handleSubmit} // Call handleSubmit on Save
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </Box>
         )}
      </Paper>
    </Box>
  );
}

export default ModelEdit; 