import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

function AnalysisAssistantEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [assistant, setAssistant] = useState<AnalysisAssistant | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDatasets, setSelectedDatasets] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssistantAndDatasets = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);

        // Fetch assistant data
        const assistantResponse = await analysisAssistantsService.getAnalysisAssistant(Number(id));
        const assistantData = assistantResponse.data;
        setAssistant(assistantData);
        setName(assistantData.name);
        setDescription(assistantData.description);

        // Fetch all datasets
        const datasetsResponse = await datasetsService.getDatasets(1, 1000);
        setDatasets(datasetsResponse.items);

        // Fetch associated datasets
        const associatedDatasetsResponse = await analysisAssistantDatasetsService.getDatasetsByAssistantId(Number(id));
        console.log('Associated datasets response:', associatedDatasetsResponse);
        const selectedIds = associatedDatasetsResponse.items.map(d => d.id);
        console.log('Selected dataset IDs:', selectedIds);
        setSelectedDatasets(selectedIds);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssistantAndDatasets();
  }, [id]);

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
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Update assistant basic info
      await analysisAssistantsService.updateAnalysisAssistant(Number(id), { name, description });

      // Get current associated datasets
      const currentDatasetsResponse = await analysisAssistantDatasetsService.getDatasetsByAssistantId(Number(id));
      const currentDatasetIds = currentDatasetsResponse.items.map(d => d.id);

      // Find datasets to add and remove
      const datasetsToAdd = selectedDatasets.filter(id => !currentDatasetIds.includes(id));
      const datasetsToRemove = currentDatasetIds.filter(id => !selectedDatasets.includes(id));

      // Remove unselected datasets
      await Promise.all(
        datasetsToRemove.map(datasetId =>
          analysisAssistantDatasetsService.deleteAnalysisAssistantDataset(datasetId)
        )
      );

      // Add new datasets
      await Promise.all(
        datasetsToAdd.map(datasetId =>
          analysisAssistantDatasetsService.createAnalysisAssistantDataset({
            analysis_assistant_id: Number(id),
            dataset_id: datasetId
          })
        )
      );

      navigate('/analysis-assistants');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update analysis assistant');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !assistant) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Analysis Assistant
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
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AnalysisAssistantEdit; 