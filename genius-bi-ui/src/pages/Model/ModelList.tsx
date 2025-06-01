import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { modelsService } from '../../services';
import type { Model } from '../../types';
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Box,
  Pagination,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

function ModelList() {
  const navigate = useNavigate();
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchModels = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await modelsService.getModels(page);
      setModels(response.items);
      setTotalPages(response.pages);
      setCurrentPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch models');
      setModels([]); // Reset models on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      try {
        await modelsService.deleteModel(id);
        fetchModels(currentPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete model');
      }
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    fetchModels(value);
  };

  const handleEdit = (id: number) => {
    navigate(`/models/edit/${id}`);
  };

  const handleRowClick = (id: number) => {
    navigate(`/models/${id}`);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} mb={3} gap={2}>
        <Typography variant="h4" component="h1">
          Models
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/models/create')}
          fullWidth={isMobile}
        >
          Create New Model
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell width="5%">ID</TableCell>
              <TableCell width="15%">Database Connection</TableCell>
              <TableCell width="15%">Database Name</TableCell>
              <TableCell width="15%">Table Name</TableCell>
              <TableCell width="15%">Model Name</TableCell>
              <TableCell width="20%">Description</TableCell>
              <TableCell width="10%">Created At</TableCell>
              <TableCell width="5%" align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {models && models.length > 0 ? (
              models.map((model) => (
                <TableRow 
                  key={model.id}
                  onClick={() => handleRowClick(model.id)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <TableCell>{model.id}</TableCell>
                  <TableCell>{model.database_id}</TableCell>
                  <TableCell>{model.database_name}</TableCell>
                  <TableCell>{model.table_name}</TableCell>
                  <TableCell>{model.model_name}</TableCell>
                  <TableCell sx={{ 
                    maxWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {model.description}
                  </TableCell>
                  <TableCell>{new Date(model.created_at).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleEdit(model.id);
                      }}
                      size={isMobile ? "small" : "medium"}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(model.id);
                      }}
                      size={isMobile ? "small" : "medium"}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No models found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      )}
    </Box>
  );
}

export default ModelList; 