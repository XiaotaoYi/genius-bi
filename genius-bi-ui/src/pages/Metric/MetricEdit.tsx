import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { metricsService } from '../../services';
import type { ModelMetric } from '../../types';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

// Define metric types based on schema
const METRIC_TYPES = [
  { value: 'atom', label: 'atom' },
  { value: 'derived', label: 'derived' }
];

interface FormData {
  id: number;
  model_id: number;
  name: string;
  alias: string;
  metric_type: string;
  description: string;
  express: string;
}

function MetricEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [metric, setMetric] = useState<ModelMetric | null>(null);
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    model_id: 0,
    name: '',
    alias: '',
    metric_type: '',
    description: '',
    express: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetric = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await metricsService.getMetric(Number(id));
        const metricData = response.data as unknown as ModelMetric;
        setMetric(metricData);
        setFormData({
          id: metricData.id,
          model_id: metricData.model_id,
          name: metricData.name,
          alias: metricData.alias || '',
          metric_type: metricData.metric_type || '',
          description: metricData.description || '',
          express: metricData.express || ''
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metric');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetric();
  }, [id]);

  const handleChange = (field: keyof FormData) => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      await metricsService.updateMetric(Number(id), formData);
      navigate('/metrics');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update metric');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !metric) {
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
          Edit Metric
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={handleChange('name')}
            required
            margin="normal"
            disabled={isLoading}
          />
          
          <TextField
            fullWidth
            label="Alias"
            value={formData.alias}
            onChange={handleChange('alias')}
            margin="normal"
            disabled={isLoading}
            helperText="Optional display name for the metric"
          />

          <FormControl fullWidth margin="normal" disabled={isLoading}>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.metric_type}
              onChange={handleChange('metric_type')}
              label="Type"
            >
              {METRIC_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Expression"
            value={formData.express}
            onChange={handleChange('express')}
            multiline
            rows={2}
            margin="normal"
            disabled={isLoading}
            helperText="SQL expression or formula for the metric"
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={handleChange('description')}
            multiline
            rows={2}
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

export default MetricEdit;