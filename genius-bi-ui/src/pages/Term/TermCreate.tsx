import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { termsService } from '../../services';
import type { Term } from '../../types';
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
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

function TermCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [synonym, setSynonym] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await termsService.createTerm({ name, synonym, description });
      navigate('/term');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create term');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/term');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          sx={{ mb: 2 }}
        >
          Back to List
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Create Term
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            required
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
          <TextField
            fullWidth
            required
            label="Synonym"
            value={synonym}
            onChange={(e) => setSynonym(e.target.value)}
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            disabled={isLoading}
          />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading || !name.trim() || !synonym.trim()}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default TermCreate; 