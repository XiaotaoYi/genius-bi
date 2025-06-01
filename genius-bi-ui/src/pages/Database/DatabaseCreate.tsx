import React, { useState } from 'react';
import { databasesService } from '../../services';
import type { Database } from '../../types';
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
import { useNavigate } from 'react-router-dom';

function DatabaseCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [jdbcStr, setJdbcStr] = useState('');
  const [version, setVersion] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await databasesService.createDatabase({ 
        name, 
        description,
        type,
        jdbc_str: jdbcStr,
        version,
        user,
        password
      });
      navigate('/databases');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create database');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Database
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
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            margin="normal"
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="JDBC String"
            value={jdbcStr}
            onChange={(e) => setJdbcStr(e.target.value)}
            required
            margin="normal"
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            required
            margin="normal"
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="User"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            margin="normal"
            disabled={isLoading}
          />
          <TextField
            fullWidth
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            disabled={isLoading}
            type="password"
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
              {isLoading ? 'Creating...' : 'Create Database'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default DatabaseCreate; 