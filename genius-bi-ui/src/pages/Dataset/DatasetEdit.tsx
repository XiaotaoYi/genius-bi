import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { datasetsService } from '../../services';
import type { Dataset } from '../../types';
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

function DatasetEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataset = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await datasetsService.getDataset(Number(id));
        const datasetData = response.data;
        setDataset(datasetData);
        setName(datasetData.name);
        setDescription(datasetData.description);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dataset');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataset();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      await datasetsService.updateDataset(Number(id), { name, description });
      navigate('/datasets');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update dataset');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !dataset) {
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
          Edit Dataset
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

export default DatasetEdit; 