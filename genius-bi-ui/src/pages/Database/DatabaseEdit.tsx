import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

function DatabaseEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [database, setDatabase] = useState<Database | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [jdbcStr, setJdbcStr] = useState('');
  const [version, setVersion] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatabase = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await databasesService.getDatabase(Number(id));
        const databaseData = response;
        setDatabase(databaseData);
        setName(databaseData.name);
        setDescription(databaseData.description);
        setType(databaseData.type || '');
        setJdbcStr(databaseData.jdbc_str || '');
        setVersion(databaseData.version || '');
        setUser(databaseData.user || '');
        setPassword(databaseData.password || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch database');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatabase();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      await databasesService.updateDatabase(Number(id), { 
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
      setError(err instanceof Error ? err.message : 'Failed to update database');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !database) {
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
          Edit Database
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
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default DatabaseEdit; 