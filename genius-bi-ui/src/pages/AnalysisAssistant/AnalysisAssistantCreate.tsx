import React, { useState, useEffect } from 'react';
import { analysisAssistantsService, datasetsService, analysisAssistantDatasetsService } from '../../services';
import type { AnalysisAssistant, Dataset } from '../../types';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

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
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function AnalysisAssistantCreate() {
  const [tabValue, setTabValue] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDatasets, setSelectedDatasets] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await datasetsService.getDatasets(1, 1000); // Fetch up to 1000 datasets
        setDatasets(response.items);
      } catch (err) {
        console.error('Failed to fetch datasets:', err);
        setError('Failed to load datasets');
      }
    };

    fetchDatasets();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDatasetChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedDatasets(
      typeof value === 'string' ? value.split(',').map(Number) : value,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const response = await analysisAssistantsService.createAnalysisAssistant({ name, description });
      const assistant = response.data;
      
      // Create dataset associations
      if (selectedDatasets.length > 0) {
        await Promise.all(
          selectedDatasets.map(datasetId =>
            analysisAssistantDatasetsService.createAnalysisAssistantDataset({
              analysis_assistant_id: assistant.id,
              dataset_id: datasetId
            })
          )
        );
      }
      
      window.location.href = '/analysis-assistants';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create analysis assistant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Analysis Assistant
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Basic" />
            <Tab label="Dataset" />
          </Tabs>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TabPanel value={tabValue} index={0}>
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
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="dataset-select-label">Datasets</InputLabel>
              <Select
                labelId="dataset-select-label"
                multiple
                value={selectedDatasets}
                onChange={handleDatasetChange}
                input={<OutlinedInput label="Datasets" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={datasets.find(d => d.id === value)?.name || ''}
                      />
                    ))}
                  </Box>
                )}
                disabled={isLoading}
              >
                {datasets.map((dataset) => (
                  <MenuItem key={dataset.id} value={dataset.id}>
                    {dataset.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </TabPanel>

          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Analysis Assistant'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AnalysisAssistantCreate; 