import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { datasetFieldsService } from '../../services';
import type { DatasetField } from '../../types';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert,
  MenuItem
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

function DatasetFieldEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [datasetField, setDatasetField] = useState<DatasetField | null>(null);
  const [dataset_id, setDatasetId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [field_type, setFieldType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fieldTypes = [
    'string',
    'integer',
    'float',
    'boolean',
    'date',
    'datetime',
    'timestamp'
  ];

  useEffect(() => {
    const fetchDatasetField = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await datasetFieldsService.getDatasetField(Number(id));
        const fieldData = response.data;
        setDatasetField(fieldData);
        setDatasetId(fieldData.dataset_id.toString());
        setName(fieldData.name);
        setDescription(fieldData.description);
        setFieldType(fieldData.field_type);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dataset field');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatasetField();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      await datasetFieldsService.updateDatasetField(Number(id), {
        dataset_id: Number(dataset_id),
        name,
        description,
        field_type
      });
      navigate('/dataset-fields');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update dataset field');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !datasetField) {
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
          Edit Dataset Field
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Dataset ID"
            value={dataset_id}
            onChange={(e) => setDatasetId(e.target.value)}
            required
            type="number"
            margin="normal"
            disabled={isLoading}
          />
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
          <TextField
            fullWidth
            select
            label="Field Type"
            value={field_type}
            onChange={(e) => setFieldType(e.target.value)}
            required
            margin="normal"
            disabled={isLoading}
          >
            {fieldTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
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

export default DatasetFieldEdit; 