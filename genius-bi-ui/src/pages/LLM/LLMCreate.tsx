import React, { useState } from 'react';
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

function LLMCreate() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      const llmData = {
        ...formData,
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        timeout: formData.timeout ? parseInt(formData.timeout) : undefined
      };
      await llmsService.createLLM(llmData);
      window.location.href = '/llms';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create LLM');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New LLM
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
              {isLoading ? 'Creating...' : 'Create LLM'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default LLMCreate; 