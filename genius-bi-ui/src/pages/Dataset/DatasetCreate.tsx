import React, { useState, useEffect } from 'react';
import { datasetsService, modelsService } from '../../services';
import type { Dataset, DatasetCreatePayload, DatasetFieldPayload } from '../../types';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  IconButton,
  SelectChangeEvent
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { ArrowForward, ArrowBack } from '@mui/icons-material';

interface ModelField {
  alias: string;
  type: 'dimension' | 'metric';
  model_name: string;
  id?: number; // Assuming fields might have IDs, though API only returns alias, type, model_name
  model_id: number | string; // Add model_id to ModelField interface for easier access
}

function DatasetCreate() {
  const [currentStep, setCurrentStep] = useState(1);
  // Step 1 State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Step 2 State
  const [availableModels, setAvailableModels] = useState<any[]>([]); // State for the model dropdown
  const [selectedModelId, setSelectedModelId] = useState<number | ''>('');
  const [availableFields, setAvailableFields] = useState<ModelField[]>([]); // Fields from selected model
  const [selectedAvailableFields, setSelectedAvailableFields] = useState<ModelField[]>([]); // Selected in left panel
  const [datasetFields, setDatasetFields] = useState<ModelField[]>([]); // Fields added to dataset (right panel)
  const [selectedDatasetFields, setSelectedDatasetFields] = useState<ModelField[]>([]); // Selected in right panel

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch list of models for the dropdown
    const fetchModels = async () => {
      try {
        const response = await modelsService.getModels(1, 1000); // Fetch up to 1000 models
        setAvailableModels(response.items);
      } catch (err) {
        console.error('Failed to fetch models:', err);
        // Handle error fetching models
      }
    };

    if (currentStep === 2 && availableModels.length === 0) {
      fetchModels();
    }
  }, [currentStep, availableModels.length]);

  useEffect(() => {
    // Fetch fields when a model is selected
    const fetchModelFields = async () => {
      if (selectedModelId) {
        try {
          setIsLoading(true);
          // The API endpoint /models/{model_id}/fields returns { data: ModelField[], total: number }
          const response = await modelsService.getModelFields(Number(selectedModelId));
          // Add model_id to each field for easier handling in the component
          const fieldsWithModelId = response.data.map((field: Omit<ModelField, 'model_id'>) => ({
              ...field,
              model_id: selectedModelId
          })) as ModelField[];
          setAvailableFields(fieldsWithModelId);
          setSelectedAvailableFields([]); // Clear selections when model changes
          // Do NOT clear datasetFields here, as they are already selected for the dataset
        } catch (err) {
          console.error('Failed to fetch model fields:', err);
          setError('Failed to load model fields.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchModelFields();
  }, [selectedModelId]);

  const handleNext = () => {
    if (!name || !description) {
      setError('Please fill in name and description.');
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSaveDataset = async () => {
    // TODO: Implement dataset creation API call with selected fields
    console.log('Saving dataset with:', { name, description, fields: datasetFields });
    try {
        setIsLoading(true);
        setError(null);
        // Assuming a create dataset API endpoint exists that accepts name, description, and a list of fields
        // You might need to adjust the data structure based on your backend API
        const datasetPayload: DatasetCreatePayload = { 
            name,
            description,
            // Map datasetFields to the format expected by the backend
            fields: datasetFields.map(field => ({ 
              field_id: field.id, // Ensure model_id is number when sending
              alias: field.alias,
              type: field.type
              // Include other necessary fields if the backend needs them
             })) 
        };
        await datasetsService.createDataset(datasetPayload);
        window.location.href = '/datasets'; // Navigate on success
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create dataset');
    } finally {
        setIsLoading(false);
    }
  };

  const handleModelSelectChange = (event: SelectChangeEvent<number | ''>) => {
    setSelectedModelId(event.target.value);
  };

  const handleAvailableFieldSelect = (field: ModelField) => () => {
    const isSelected = selectedAvailableFields.some(f => f.alias === field.alias && f.model_name === field.model_name && f.model_id === field.model_id); // Use alias, model_name, and model_id for uniqueness
    if (isSelected) {
      setSelectedAvailableFields(selectedAvailableFields.filter(f => !(f.alias === field.alias && f.model_name === field.model_name && f.model_id === field.model_id)));
    } else {
      setSelectedAvailableFields([...selectedAvailableFields, field]);
    }
  };

  const handleDatasetFieldSelect = (field: ModelField) => () => {
    const isSelected = selectedDatasetFields.some(f => f.alias === field.alias && f.model_name === field.model_name && f.model_id === field.model_id); // Use alias, model_name, and model_id for uniqueness
    if (isSelected) {
      setSelectedDatasetFields(selectedDatasetFields.filter(f => !(f.alias === field.alias && f.model_name === field.model_name && f.model_id === field.model_id)));
    } else {
      setSelectedDatasetFields([...selectedDatasetFields, field]);
    }
  };

  const handleMoveRight = () => {
    // Move selected available fields to dataset fields, avoiding duplicates by alias and model_name
    const newDatasetFields = [...datasetFields];
    selectedAvailableFields.forEach(selectedField => {
        if (!newDatasetFields.some(datasetField => datasetField.alias === selectedField.alias && datasetField.model_name === selectedField.model_name && datasetField.model_id === selectedField.model_id)) {
            newDatasetFields.push(selectedField);
        }
    });

    // Remove moved fields from available fields
    const newAvailableFields = availableFields.filter(field => 
      !selectedAvailableFields.some(selected => selected.alias === field.alias && selected.model_name === field.model_name && selected.model_id === field.model_id)
    );
    setDatasetFields(newDatasetFields);
    setAvailableFields(newAvailableFields);
    setSelectedAvailableFields([]); // Clear selection after moving
  };

  const handleMoveLeft = () => {
    // Move selected dataset fields back to available fields
    // Note: This logic assumes fields are moved back to the *currently selected* model's available fields list.
    // If fields could come from multiple models in the right panel, the logic would need to be more complex
    // to place them back into their original model's list or a combined 'all available' list.
    const newAvailableFields = [...availableFields];
     selectedDatasetFields.forEach(selectedField => {
        // Only add back to available if they belong to the currently selected model
         if (selectedField.model_id === selectedModelId) {
             if (!newAvailableFields.some(availableField => availableField.alias === selectedField.alias && availableField.model_name === selectedField.model_name && availableField.model_id === selectedField.model_id)) {
                 newAvailableFields.push(selectedField);
             }
         } // Else: If from a different model, they are just removed from the right panel.
     });

    // Remove moved fields from dataset fields
    const newDatasetFields = datasetFields.filter(field => 
      !selectedDatasetFields.some(selected => selected.alias === field.alias && selected.model_name === field.model_name && selected.model_id === field.model_id)
    );
    setAvailableFields(newAvailableFields);
    setDatasetFields(newDatasetFields);
    setSelectedDatasetFields([]); // Clear selection after moving
  };

  // Helper to check if a field is selected in a given list
  const isFieldSelected = (field: ModelField, selectedList: ModelField[]) => 
    selectedList.some(f => f.alias === field.alias && f.model_name === field.model_name && f.model_id === field.model_id);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Dataset - Step {currentStep}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {currentStep === 1 && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            <Typography variant="h6" gutterBottom>Basic Information</Typography>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              margin="normal"
              disabled={isLoading}
            />
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              margin="normal"
              disabled={isLoading}
            />
            <Box mt={3}>
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

        {currentStep === 2 && (
          <Box>
             <Typography variant="h6" gutterBottom>Field Mapping</Typography>
             <Grid container spacing={3}>
                {/* Left Panel: Available Fields */}
                <Grid>
                    <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>Available Fields</Typography>
                        <FormControl fullWidth margin="normal">
                           <InputLabel id="model-select-label">Switch Model</InputLabel>
                           <Select
                              labelId="model-select-label"
                              value={selectedModelId}
                              label="Switch Model"
                              onChange={handleModelSelectChange}
                           >
                              <MenuItem value=""><em>Select a model</em></MenuItem>
                              {availableModels.map((model) => (
                                 <MenuItem key={model.id} value={model.id}>
                                    {model.model_name}
                                 </MenuItem>
                              ))}
                           </Select>
                        </FormControl>

                         {/* Search Input for Available Fields */}
                         <TextField fullWidth label="Search" margin="normal" size="small" /> {/* TODO: Implement search logic */}

                        <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400, overflow: 'auto' }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell padding="checkbox"></TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Alias</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Belonging Model</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {isLoading ? (
                                <TableRow><TableCell colSpan={4} align="center"><CircularProgress size={20} /></TableCell></TableRow>
                              ) : availableFields.length === 0 ? (
                                <TableRow><TableCell colSpan={4} align="center">No fields available or select a model</TableCell></TableRow>
                              ) : (
                                availableFields.map((field, index) => (
                                  <TableRow 
                                    key={`${field.model_name}-${field.alias}-${index}`} // Use a composite key
                                    onClick={handleAvailableFieldSelect(field)}
                                    selected={isFieldSelected(field, selectedAvailableFields)}
                                    sx={{ cursor: 'pointer' }}
                                  >
                                    <TableCell padding="checkbox">
                                      <Checkbox 
                                        checked={isFieldSelected(field, selectedAvailableFields)}
                                        onChange={handleAvailableFieldSelect(field)}
                                      />
                                    </TableCell>
                                    <TableCell>{field.id}</TableCell>
                                    <TableCell>{field.alias}</TableCell>
                                    <TableCell>{field.type}</TableCell>
                                    <TableCell>{field.model_name}</TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                    </Paper>
                </Grid>

                {/* Middle Buttons */}
                <Grid  sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton 
                      onClick={handleMoveRight} 
                      disabled={selectedAvailableFields.length === 0}
                      sx={{ mb: 1 }}
                    >
                        <ArrowForward />
                    </IconButton>
                    <IconButton 
                      onClick={handleMoveLeft} 
                      disabled={selectedDatasetFields.length === 0}
                    >
                        <ArrowBack />
                    </IconButton>
                </Grid>

                {/* Right Panel: Dataset Fields */}
                <Grid>
                     <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>Selected Fields</Typography>

                         {/* Search Input for Dataset Fields */}
                         <TextField fullWidth label="Search" margin="normal" size="small" /> {/* TODO: Implement search logic */}

                         <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400, overflow: 'auto' }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell padding="checkbox"></TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Alias</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Belonging Model</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                               {datasetFields.length === 0 ? (
                                <TableRow><TableCell colSpan={4} align="center">No fields selected</TableCell></TableRow>
                              ) : (
                                datasetFields.map((field, index) => (
                                  <TableRow 
                                     key={`${field.model_name}-${field.alias}-${index}`} // Use a composite key
                                     onClick={handleDatasetFieldSelect(field)}
                                     selected={isFieldSelected(field, selectedDatasetFields)}
                                     sx={{ cursor: 'pointer' }}
                                   >
                                    <TableCell padding="checkbox">
                                       <Checkbox
                                          checked={isFieldSelected(field, selectedDatasetFields)}
                                          onChange={handleDatasetFieldSelect(field)}
                                       />
                                    </TableCell>
                                    <TableCell>{field.id}</TableCell>
                                    <TableCell>{field.alias}</TableCell>
                                    <TableCell>{field.type}</TableCell>
                                    <TableCell>{
                                      // Find the model name by model_id
                                      availableModels.find(m => m.id === field.model_id)?.model_name || 'Unknown Model'
                                    }</TableCell>
                                  </TableRow>
                                ))
                               )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                     </Paper>
                </Grid>
             </Grid>

            <Box mt={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveDataset}
                startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={isLoading || datasetFields.length === 0}
              >
                {isLoading ? 'Saving...' : 'Save Dataset'}
              </Button>
            </Box>
          </Box>
        )}

      </Paper>
    </Container>
  );
}

export default DatasetCreate;
 