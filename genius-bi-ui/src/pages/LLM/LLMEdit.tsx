import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { llmsService } from '../../services';
import type { LLM } from '../../types';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

function LLMEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [llm, setLLM] = useState<LLM | null>(null);
  const [formData, setFormData] = useState({
    connection_name: '',
    api_protocal: '',
    base_url: '',
    api_key: '',
    model_name: '',
    api_version: '',
    temperature: '',
    timeout: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLLM = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await llmsService.getLLM(Number(id));
        const llmData = response.data;
        setLLM(llmData);
        setFormData({
          connection_name: llmData.connection_name,
          api_protocal: llmData.api_protocal,
          base_url: llmData.base_url || '',
          api_key: llmData.api_key || '',
          model_name: llmData.model_name || '',
          api_version: llmData.api_version || '',
          temperature: llmData.temperature?.toString() || '',
          timeout: llmData.timeout?.toString() || '',
          description: llmData.description || ''
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch LLM');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLLM();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const llmData = {
        ...formData,
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        timeout: formData.timeout ? parseInt(formData.timeout) : undefined
      };
      await llmsService.updateLLM(Number(id), llmData);
      navigate('/llms');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update LLM');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !llm) {
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
          Edit LLM
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Connection Name"
                name="connection_name"
                value={formData.connection_name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </Grid>
            <Grid sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="API Protocol"
                name="api_protocal"
                value={formData.api_protocal}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </Grid>
            <Grid sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Base URL"
                name="base_url"
                value={formData.base_url}
                onChange={handleChange}
                disabled={isLoading}
              />
            </Grid>
            <Grid sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="API Key"
                name="api_key"
                value={formData.api_key}
                onChange={handleChange}
                type="password"
                disabled={isLoading}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                fullWidth
                label="Model Name"
                name="model_name"
                value={formData.model_name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                fullWidth
                label="API Version"
                name="api_version"
                value={formData.api_version}
                onChange={handleChange}
                disabled={isLoading}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                fullWidth
                label="Temperature"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                type="number"
                inputProps={{ step: "0.1", min: "0", max: "1" }}
                disabled={isLoading}
              />
            </Grid>
            <Grid sx={{ width: { xs: '100%', sm: '50%' } }}>
              <TextField
                fullWidth
                label="Timeout (seconds)"
                name="timeout"
                value={formData.timeout}
                onChange={handleChange}
                type="number"
                inputProps={{ min: "0" }}
                disabled={isLoading}
              />
            </Grid>
            <Grid sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                disabled={isLoading}
              />
            </Grid>
          </Grid>
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

export default LLMEdit; 