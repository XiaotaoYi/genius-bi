import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analysisAssistantDatasetsService } from '../../services';
import type { AnalysisAssistantDataset } from '../../types';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

function AnalysisAssistantDatasetEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assistantDataset, setAssistantDataset] = useState<AnalysisAssistantDataset | null>(null);
  const [analysisAssistantId, setAnalysisAssistantId] = useState('');
  const [datasetId, setDatasetId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssistantDataset = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await analysisAssistantDatasetsService.getAnalysisAssistantDataset(Number(id));
        const assistantDatasetData = response.data;
        setAssistantDataset(assistantDatasetData);
        setAnalysisAssistantId(assistantDatasetData.analysis_assistant_id.toString());
        setDatasetId(assistantDatasetData.dataset_id.toString());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analysis assistant dataset');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssistantDataset();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      await analysisAssistantDatasetsService.updateAnalysisAssistantDataset(Number(id), {
        analysis_assistant_id: Number(analysisAssistantId),
        dataset_id: Number(datasetId)
      });
      navigate('/analysis-assistant-datasets');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update analysis assistant dataset');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !assistantDataset) {
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
          Edit Analysis Assistant Dataset
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Analysis Assistant ID"
            value={analysisAssistantId}
            onChange={(e) => setAnalysisAssistantId(e.target.value)}
            required
            type="number"
            margin="normal"
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Dataset ID"
            value={datasetId}
            onChange={(e) => setDatasetId(e.target.value)}
            required
            type="number"
            margin="normal"
            disabled={isLoading}
          />
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

export default AnalysisAssistantDatasetEdit; 