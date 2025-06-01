import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dimensionsService } from '../../services';
import type { ModelDimension } from '../../types';
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

// Define dimension types based on schema
const DIMENSION_TYPES = [
  { value: 'primary key', label: 'primary key' },
  { value: 'foreign key', label: 'foreign key' },
  { value: 'dimension', label: 'dimension' }
];

interface FormData {
  id: number;
  model_id: number;
  name: string;
  alias: string;
  dimension_type: string;
  description: string;
  express: string;
}

function DimensionEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dimension, setDimension] = useState<ModelDimension | null>(null);
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    model_id: 0,
    name: '',
    alias: '',
    dimension_type: '',
    description: '',
    express: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDimension = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await dimensionsService.getDimension(Number(id));
        const dimensionData = response.data as unknown as ModelDimension;
        setDimension(dimensionData);
        setFormData({
          id: dimensionData.id,
          model_id: dimensionData.model_id,
          name: dimensionData.name,
          alias: dimensionData.alias || '',
          dimension_type: dimensionData.dimension_type?.toString() || '',
          description: dimensionData.description || '',
          express: dimensionData.express || ''
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dimension');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDimension();
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
      const updateData = {
        ...formData,
        dimension_type: formData.dimension_type ? formData.dimension_type : undefined
      };
      await dimensionsService.updateDimension(Number(id), updateData);
      navigate('/dimensions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update dimension');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !dimension) {
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
          Edit Dimension
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
            helperText="Optional display name for the dimension"
          />

          <FormControl fullWidth margin="normal" disabled={isLoading}>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.dimension_type}
              onChange={handleChange('dimension_type')}
              label="Type"
            >
              {DIMENSION_TYPES.map((type) => (
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
            helperText="SQL expression or formula for the dimension"
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

export default DimensionEdit; 